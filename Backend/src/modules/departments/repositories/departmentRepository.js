import { query } from '../../../config/database.js';

// Create a new department
export const createDepartmentRepo = async (departmentData) => {
  const {
    name,
    parent_department_id = null,
    department_head_id = null,
    status = 'ACTIVE',
  } = departmentData;

  const sqlText = `
    INSERT INTO departments (
      name, parent_department_id, department_head_id, status
    )
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;

  const params = [
    name,
    parent_department_id,
    department_head_id,
    status,
  ];

  const result = await query(sqlText, params);
  return result.rows[0];
};

// Get all departments with optional filters
export const getDepartmentsRepo = async (filters) => {
  const {
    page = 1,
    limit = 10,
    status,
    search,
    sortBy = 'department_id',
    sortOrder = 'asc',
  } = filters;

  const offset = (page - 1) * limit;
  const whereClauses = [];
  const params = [];
  let paramIndex = 1;

  if (status) {
    whereClauses.push(`d.status = $${paramIndex++}`);
    params.push(status);
  }

  if (search) {
    whereClauses.push(`(d.name ILIKE $${paramIndex++} OR u.name ILIKE $${paramIndex++})`);
    params.push(`%${search}%`, `%${search}%`);
  }

  const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

  // Validate sortable column to prevent SQL injection
  const allowedSortColumns = ['department_id', 'name', 'status', 'created_at'];
  const sortCol = allowedSortColumns.includes(sortBy) ? `d.${sortBy}` : 'd.department_id';
  const orderDirection = sortOrder.toLowerCase() === 'desc' ? 'DESC' : 'ASC';

  const countSql = `SELECT COUNT(*) AS total FROM departments d LEFT JOIN users u ON d.department_head_id = u.user_id ${whereSql}`;
  const countResult = await query(countSql, params);
  const total = parseInt(countResult.rows[0].total, 10);

  const sqlText = `
    SELECT 
      d.*,
      pd.name AS parent_department_name,
      u.name AS department_head_name,
      u.email AS department_head_email
    FROM departments d
    LEFT JOIN departments pd ON d.parent_department_id = pd.department_id
    LEFT JOIN users u ON d.department_head_id = u.user_id
    ${whereSql}
    ORDER BY ${sortCol} ${orderDirection}
    LIMIT $${paramIndex++} OFFSET $${paramIndex++};
  `;

  const listParams = [...params, limit, offset];
  const listResult = await query(sqlText, listParams);

  // Transform data to match frontend expectations
  const transformedDepartments = listResult.rows.map(dept => ({
    id: dept.department_id,
    name: dept.name,
    head: dept.department_head_name || '',
    parentDept: dept.parent_department_name || '--',
    department_head_id: dept.department_head_id,
    parent_department_id: dept.parent_department_id,
    status: dept.status === 'ACTIVE' ? 'Active' : 'Inactive',
  }));

  return {
    departments: transformedDepartments,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// Search departments by name or head name
export const searchDepartmentsRepo = async (q, limit = 20) => {
  const sqlText = `
    SELECT 
      d.*,
      pd.name AS parent_department_name,
      u.name AS department_head_name,
      u.email AS department_head_email
    FROM departments d
    LEFT JOIN departments pd ON d.parent_department_id = pd.department_id
    LEFT JOIN users u ON d.department_head_id = u.user_id
    WHERE 
      d.name ILIKE $1 OR
      u.name ILIKE $1
    ORDER BY d.name ASC
    LIMIT $2;
  `;
  const result = await query(sqlText, [`%${q}%`, limit]);
  return result.rows;
};

// Get single department by ID
export const getDepartmentByIdRepo = async (id) => {
  const sqlText = `
    SELECT 
      d.*,
      pd.name AS parent_department_name,
      u.name AS department_head_name,
      u.email AS department_head_email
    FROM departments d
    LEFT JOIN departments pd ON d.parent_department_id = pd.department_id
    LEFT JOIN users u ON d.department_head_id = u.user_id
    WHERE d.department_id = $1;
  `;
  const result = await query(sqlText, [id]);
  return result.rows[0] || null;
};

// Update a department
export const updateDepartmentRepo = async (id, updateData) => {
  const keys = Object.keys(updateData);
  if (keys.length === 0) return getDepartmentByIdRepo(id);

  const setClauses = keys.map((key, index) => `${key} = $${index + 2}`);
  const params = [id, ...Object.values(updateData)];

  const sqlText = `
    UPDATE departments
    SET ${setClauses.join(', ')}
    WHERE department_id = $1
    RETURNING *;
  `;

  const result = await query(sqlText, params);
  return result.rows[0] || null;
};

// Delete department
export const deleteDepartmentRepo = async (id) => {
  const sqlText = 'DELETE FROM departments WHERE department_id = $1 RETURNING department_id;';
  const result = await query(sqlText, [id]);
  return result.rowCount > 0;
};

// Get departments by status
export const getDepartmentsByStatusRepo = async (status) => {
  const sqlText = `
    SELECT 
      d.*,
      pd.name AS parent_department_name,
      u.name AS department_head_name
    FROM departments d
    LEFT JOIN departments pd ON d.parent_department_id = pd.department_id
    LEFT JOIN users u ON d.department_head_id = u.user_id
    WHERE d.status = $1
    ORDER BY d.name ASC;
  `;
  const result = await query(sqlText, [status]);
  return result.rows;
};

// Get child departments of a parent department
export const getChildDepartmentsRepo = async (parentId) => {
  const sqlText = `
    SELECT 
      d.*,
      pd.name AS parent_department_name,
      u.name AS department_head_name
    FROM departments d
    LEFT JOIN departments pd ON d.parent_department_id = pd.department_id
    LEFT JOIN users u ON d.department_head_id = u.user_id
    WHERE d.parent_department_id = $1
    ORDER BY d.name ASC;
  `;
  const result = await query(sqlText, [parentId]);
  return result.rows;
};
