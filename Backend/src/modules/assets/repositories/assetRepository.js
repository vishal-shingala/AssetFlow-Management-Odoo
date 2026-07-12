import { query, transaction } from '../../../config/database.js';

// Create a new asset
export const createAssetRepo = async (assetData) => {
  const {
    asset_tag,
    asset_name,
    category_id,
    serial_number,
    purchase_date,
    purchase_cost,
    condition = 'GOOD',
    location,
    is_shared = false,
    status = 'AVAILABLE',
    photo_url,
  } = assetData;

  const sqlText = `
    INSERT INTO assets (
      asset_tag, asset_name, category_id, serial_number, purchase_date,
      purchase_cost, condition, location, is_shared, status, photo_url
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    RETURNING *;
  `;

  const params = [
    asset_tag,
    asset_name,
    category_id,
    serial_number || null,
    purchase_date,
    purchase_cost || null,
    condition,
    location || null,
    is_shared,
    status,
    photo_url || null,
  ];

  const result = await query(sqlText, params);
  return result.rows[0];
};

// Check if asset tag or serial number exists
export const findAssetByTagOrSerial = async (assetTag, serialNumber) => {
  let sqlText = 'SELECT id, asset_tag, serial_number FROM assets WHERE asset_tag = $1';
  const params = [assetTag];

  if (serialNumber) {
    sqlText += ' OR serial_number = $2';
    params.push(serialNumber);
  }

  const result = await query(sqlText, params);
  return result.rows;
};

// Get paginated assets directory
export const getAssetsRepo = async (filters) => {
  const {
    page = 1,
    limit = 10,
    status,
    category_id,
    sortBy = 'id',
    sortOrder = 'asc',
  } = filters;

  const offset = (page - 1) * limit;
  const whereClauses = [];
  const params = [];
  let paramIndex = 1;

  if (status) {
    whereClauses.push(`a.status = $${paramIndex++}`);
    params.push(status);
  }

  if (category_id) {
    whereClauses.push(`a.category_id = $${paramIndex++}`);
    params.push(category_id);
  }

  const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

  // Validate sortable column to prevent SQL injection
  const allowedSortColumns = ['id', 'asset_name', 'asset_tag', 'purchase_date', 'created_at', 'status'];
  const sortCol = allowedSortColumns.includes(sortBy) ? `a.${sortBy}` : 'a.id';
  const orderDirection = sortOrder.toLowerCase() === 'desc' ? 'DESC' : 'ASC';

  const countSql = `SELECT COUNT(*) AS total FROM assets a ${whereSql}`;
  const countResult = await query(countSql, params);
  const total = parseInt(countResult.rows[0].total, 10);

  const sqlText = `
    SELECT 
      a.*,
      c.name AS category_name
    FROM assets a
    LEFT JOIN asset_categories c ON a.category_id = c.category_id
    ${whereSql}
    ORDER BY ${sortCol} ${orderDirection}
    LIMIT $${paramIndex++} OFFSET $${paramIndex++};
  `;

  const listParams = [...params, limit, offset];
  const listResult = await query(sqlText, listParams);

  return {
    assets: listResult.rows,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// Search assets full-text across asset_tag, asset_name, serial_number, location
export const searchAssetsRepo = async (q, limit = 20) => {
  const sqlText = `
    SELECT 
      a.*,
      c.name AS category_name
    FROM assets a
    LEFT JOIN asset_categories c ON a.category_id = c.category_id
    WHERE 
      a.asset_tag ILIKE $1 OR
      a.asset_name ILIKE $1 OR
      COALESCE(a.serial_number, '') ILIKE $1 OR
      COALESCE(a.location, '') ILIKE $1
    ORDER BY a.asset_name ASC
    LIMIT $2;
  `;
  const result = await query(sqlText, [`%${q}%`, limit]);
  return result.rows;
};

// Get single asset by ID with active allocation
export const getAssetByIdRepo = async (id) => {
  const sqlText = `
    SELECT 
      a.*,
      c.name AS category_name
    FROM assets a
    LEFT JOIN asset_categories c ON a.category_id = c.category_id
    WHERE a.id = $1;
  `;
  const result = await query(sqlText, [id]);
  return result.rows[0] || null;
};

// Update an asset
export const updateAssetRepo = async (id, updateData) => {
  const keys = Object.keys(updateData);
  if (keys.length === 0) return getAssetByIdRepo(id);

  const setClauses = keys.map((key, index) => `${key} = $${index + 2}`);
  const params = [id, ...Object.values(updateData)];

  const sqlText = `
    UPDATE assets
    SET ${setClauses.join(', ')}
    WHERE id = $1
    RETURNING *;
  `;

  const result = await query(sqlText, params);
  return result.rows[0] || null;
};

// Delete asset
export const deleteAssetRepo = async (id) => {
  const sqlText = 'DELETE FROM assets WHERE id = $1 RETURNING id;';
  const result = await query(sqlText, [id]);
  return result.rowCount > 0;
};

// Allocate asset inside a transaction
export const allocateAssetRepo = async (assetId, allocationData) => {
  return transaction(async (client) => {
    const {
      employee_id,
      department_id,
      allocated_date,
      expected_return_date = null,
      condition_notes = null,
      remarks = null,
    } = allocationData;

    // Insert allocation record
    const insertAllocationSql = `
      INSERT INTO asset_allocations (
        asset_id, employee_id, department_id, allocated_date,
        expected_return_date, status, condition_notes, remarks
      )
      VALUES ($1, $2, $3, $4, $5, 'ACTIVE', $6, $7)
      RETURNING *;
    `;
    const allocResult = await client.query(insertAllocationSql, [
      assetId,
      employee_id,
      department_id,
      allocated_date,
      expected_return_date,
      condition_notes,
      remarks,
    ]);

    // Update asset status
    const updateAssetSql = `
      UPDATE assets SET status = 'ALLOCATED' WHERE id = $1 RETURNING *;
    `;
    await client.query(updateAssetSql, [assetId]);

    // Log in transfer history
    const historySql = `
      INSERT INTO transfer_history (asset_id, action, performed_by, description)
      VALUES ($1, 'ALLOCATED', $2, $3);
    `;
    await client.query(historySql, [
      assetId,
      employee_id,
      `Asset allocated to employee ID ${employee_id} in department ID ${department_id}`,
    ]);

    return allocResult.rows[0];
  });
};

// Create a transfer request
export const createTransferRequestRepo = async (assetId, transferData) => {
  const { from_employee, to_employee, requested_by } = transferData;
  const sqlText = `
    INSERT INTO transfer_requests (asset_id, from_employee, to_employee, requested_by, status)
    VALUES ($1, $2, $3, $4, 'PENDING')
    RETURNING *;
  `;
  const result = await query(sqlText, [assetId, from_employee, to_employee, requested_by]);
  return result.rows[0];
};

// Approve transfer request inside transaction
export const approveTransferRepo = async (transferRequestId, approvedBy) => {
  return transaction(async (client) => {
    // 1. Get request
    const getReqSql = 'SELECT * FROM transfer_requests WHERE id = $1 FOR UPDATE;';
    const reqResult = await client.query(getReqSql, [transferRequestId]);
    const transferReq = reqResult.rows[0];
    if (!transferReq || transferReq.status !== 'PENDING') {
      return null;
    }

    // 2. Update request status
    const updateReqSql = `
      UPDATE transfer_requests
      SET status = 'APPROVED', approved_by = $2, approved_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *;
    `;
    const updatedReqResult = await client.query(updateReqSql, [transferRequestId, approvedBy]);

    // 3. Update active asset_allocations to point to new employee
    const updateAllocSql = `
      UPDATE asset_allocations
      SET employee_id = $2
      WHERE asset_id = $1 AND status = 'ACTIVE';
    `;
    await client.query(updateAllocSql, [transferReq.asset_id, transferReq.to_employee]);

    // 4. Log in transfer history
    const historySql = `
      INSERT INTO transfer_history (asset_id, action, performed_by, description)
      VALUES ($1, 'TRANSFER_APPROVED', $2, $3);
    `;
    await client.query(historySql, [
      transferReq.asset_id,
      approvedBy,
      `Transfer approved from employee ${transferReq.from_employee} to ${transferReq.to_employee}`,
    ]);

    return updatedReqResult.rows[0];
  });
};

// Reject transfer request
export const rejectTransferRepo = async (transferRequestId, rejectedBy, reason) => {
  const sqlText = `
    UPDATE transfer_requests
    SET status = 'REJECTED', approved_by = $2, approved_at = CURRENT_TIMESTAMP
    WHERE id = $1 AND status = 'PENDING'
    RETURNING *;
  `;
  const result = await query(sqlText, [transferRequestId, rejectedBy]);
  return result.rows[0] || null;
};

// Return asset inside transaction
export const returnAssetRepo = async (assetId, returnData) => {
  return transaction(async (client) => {
    const {
      actual_return_date,
      condition_notes = null,
      remarks = null,
      status = 'AVAILABLE',
    } = returnData;

    // 1. Mark active allocation as RETURNED
    const updateAllocSql = `
      UPDATE asset_allocations
      SET status = 'RETURNED', actual_return_date = $2, condition_notes = COALESCE($3, condition_notes), remarks = COALESCE($4, remarks)
      WHERE asset_id = $1 AND status = 'ACTIVE'
      RETURNING *;
    `;
    const allocResult = await client.query(updateAllocSql, [
      assetId,
      actual_return_date,
      condition_notes,
      remarks,
    ]);

    // 2. Update asset status
    const updateAssetSql = `
      UPDATE assets SET status = $2 WHERE id = $1 RETURNING *;
    `;
    await client.query(updateAssetSql, [assetId, status]);

    // 3. Log in transfer history
    const historySql = `
      INSERT INTO transfer_history (asset_id, action, performed_by, description)
      VALUES ($1, 'RETURNED', 1, $2);
    `;
    await client.query(historySql, [
      assetId,
      `Asset returned on ${actual_return_date}. Status set to ${status}`,
    ]);

    return allocResult.rows[0] || null;
  });
};

// Get all asset allocations with joined details
export const getAllAllocationsRepo = async () => {
  const sql = `
    SELECT 
      aa.id,
      aa.asset_id,
      aa.employee_id,
      aa.department_id,
      aa.allocated_date AS "allocatedDate",
      aa.actual_return_date AS "returnDate",
      aa.expected_return_date,
      CASE 
        WHEN aa.status = 'ACTIVE' THEN 'Active'
        WHEN aa.status = 'RETURNED' THEN 'Returned'
        ELSE aa.status 
      END AS status,
      aa.remarks,
      a.asset_name AS asset,
      a.asset_tag AS "assetTag",
      COALESCE(u.name, 'Unassigned') AS employee,
      COALESCE(d.name, 'Unassigned') AS department
    FROM asset_allocations aa
    LEFT JOIN assets a ON aa.asset_id = a.id
    LEFT JOIN users u ON aa.employee_id = u.user_id
    LEFT JOIN departments d ON aa.department_id = d.department_id
    ORDER BY aa.allocated_date DESC, aa.id DESC;
  `;
  const result = await query(sql);
  return result.rows;
};

// Get complete history for an asset
export const getAssetHistoryRepo = async (assetId) => {
  const allocationsSql = `
    SELECT 
      'ALLOCATION' AS record_type,
      id,
      asset_id,
      employee_id,
      department_id,
      allocated_date AS event_date,
      status,
      remarks AS details
    FROM asset_allocations
    WHERE asset_id = $1
  `;

  const transfersSql = `
    SELECT 
      'TRANSFER_REQUEST' AS record_type,
      id,
      asset_id,
      from_employee AS employee_id,
      to_employee AS department_id,
      requested_at AS event_date,
      status,
      'Transfer requested' AS details
    FROM transfer_requests
    WHERE asset_id = $1
  `;

  const historyLogsSql = `
    SELECT 
      action AS record_type,
      id,
      asset_id,
      performed_by AS employee_id,
      NULL::int AS department_id,
      created_at AS event_date,
      action AS status,
      description AS details
    FROM transfer_history
    WHERE asset_id = $1
  `;

  const combinedSql = `
    (${allocationsSql})
    UNION ALL
    (${transfersSql})
    UNION ALL
    (${historyLogsSql})
    ORDER BY event_date DESC;
  `;

  const result = await query(combinedSql, [assetId]);
  return result.rows;
};
