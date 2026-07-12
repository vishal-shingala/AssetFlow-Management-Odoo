import { query } from "../config/database.js";

/**
 * Get all shared resources matching filtering, sorting, searching, and pagination params.
 */
export const getResources = async (queryParams = {}) => {
  const {
    page = 1,
    limit = 10,
    sortBy = "asset_name",
    sortOrder = "asc",
    search,
    category_id,
    status,
    condition,
    location,
  } = queryParams;

  let sql = `
    SELECT 
      a.id,
      a.asset_tag,
      a.asset_name,
      a.category_id,
      a.serial_number,
      a.purchase_date,
      a.purchase_cost,
      a.condition,
      a.location,
      a.is_shared,
      a.status,
      a.photo_url,
      a.created_at,
      a.updated_at,
      c.name as category_name
    FROM assets a
    LEFT JOIN asset_categories c ON a.category_id = c.category_id
    WHERE a.is_shared = TRUE
  `;

  const values = [];
  let paramIndex = 1;

  if (search) {
    sql += ` AND (a.asset_name ILIKE $${paramIndex} OR a.asset_tag ILIKE $${paramIndex} OR a.location ILIKE $${paramIndex})`;
    values.push(`%${search}%`);
    paramIndex++;
  }

  if (category_id) {
    sql += ` AND a.category_id = $${paramIndex}`;
    values.push(category_id);
    paramIndex++;
  }

  if (status) {
    sql += ` AND a.status = $${paramIndex}`;
    values.push(status);
    paramIndex++;
  }

  if (condition) {
    sql += ` AND a.condition = $${paramIndex}`;
    values.push(condition);
    paramIndex++;
  }

  if (location) {
    sql += ` AND a.location ILIKE $${paramIndex}`;
    values.push(`%${location}%`);
    paramIndex++;
  }

  // Get total count before pagination
  const countSql = `SELECT COUNT(*) FROM (${sql}) AS count_query`;
  const countResult = await query(countSql, values);
  const total = parseInt(countResult.rows[0].count, 10);

  // Sorting with strict whitelist to prevent SQL injection
  const allowedSortKeys = [
    "id",
    "asset_name",
    "asset_tag",
    "purchase_date",
    "purchase_cost",
    "condition",
    "status",
    "created_at",
  ];
  const sortKey = allowedSortKeys.includes(sortBy) ? sortBy : "asset_name";
  const sortDir = sortOrder.toLowerCase() === "desc" ? "DESC" : "ASC";

  sql += ` ORDER BY a.${sortKey} ${sortDir}`;

  // Pagination
  const offset = (page - 1) * limit;
  sql += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
  values.push(limit, offset);

  const result = await query(sql, values);

  return {
    resources: result.rows,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * Get a single shared resource by its ID.
 */
export const getResourceById = async (id) => {
  const sql = `
    SELECT 
      a.id,
      a.asset_tag,
      a.asset_name,
      a.category_id,
      a.serial_number,
      a.purchase_date,
      a.purchase_cost,
      a.condition,
      a.location,
      a.is_shared,
      a.status,
      a.photo_url,
      a.created_at,
      a.updated_at,
      c.name as category_name
    FROM assets a
    LEFT JOIN asset_categories c ON a.category_id = c.category_id
    WHERE a.id = $1 AND a.is_shared = TRUE
  `;
  const result = await query(sql, [id]);
  return result.rows[0] || null;
};
