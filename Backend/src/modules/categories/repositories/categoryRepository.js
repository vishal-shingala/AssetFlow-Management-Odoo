import { query } from '../../../config/database.js';

// Create a new category
export const createCategoryRepo = async (categoryData) => {
  const {
    name,
    description = null,
    status = 'ACTIVE',
  } = categoryData;

  const sqlText = `
    INSERT INTO asset_categories (
      name, description, status
    )
    VALUES ($1, $2, $3)
    RETURNING *;
  `;

  const params = [
    name,
    description,
    status,
  ];

  const result = await query(sqlText, params);
  return result.rows[0];
};

// Get all categories with optional filters
export const getCategoriesRepo = async (filters) => {
  const {
    page = 1,
    limit = 10,
    status,
    search,
    sortBy = 'category_id',
    sortOrder = 'asc',
  } = filters;

  const offset = (page - 1) * limit;
  const whereClauses = [];
  const params = [];
  let paramIndex = 1;

  if (status) {
    whereClauses.push(`c.status = $${paramIndex++}`);
    params.push(status);
  }

  if (search) {
    whereClauses.push(`c.name ILIKE $${paramIndex++}`);
    params.push(`%${search}%`);
  }

  const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

  // Validate sortable column to prevent SQL injection
  const allowedSortColumns = ['category_id', 'name', 'status', 'created_at'];
  const sortCol = allowedSortColumns.includes(sortBy) ? `c.${sortBy}` : 'c.category_id';
  const orderDirection = sortOrder.toLowerCase() === 'desc' ? 'DESC' : 'ASC';

  const countSql = `SELECT COUNT(*) AS total FROM asset_categories c ${whereSql}`;
  const countResult = await query(countSql, params);
  const total = parseInt(countResult.rows[0].total, 10);

  const sqlText = `
    SELECT 
      c.*
    FROM asset_categories c
    ${whereSql}
    ORDER BY ${sortCol} ${orderDirection}
    LIMIT $${paramIndex++} OFFSET $${paramIndex++};
  `;

  const listParams = [...params, limit, offset];
  const listResult = await query(sqlText, listParams);

  // Transform data to match frontend expectations
  const transformedCategories = listResult.rows.map(cat => ({
    id: cat.category_id,
    name: cat.name,
    description: cat.description || '--',
    status: cat.status === 'ACTIVE' ? 'Active' : 'Inactive',
  }));

  return {
    categories: transformedCategories,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// Get single category by ID
export const getCategoryByIdRepo = async (id) => {
  const sqlText = `
    SELECT 
      c.*
    FROM asset_categories c
    WHERE c.category_id = $1;
  `;
  const result = await query(sqlText, [id]);
  return result.rows[0] || null;
};

// Update a category
export const updateCategoryRepo = async (id, updateData) => {
  const keys = Object.keys(updateData);
  if (keys.length === 0) return getCategoryByIdRepo(id);

  const setClauses = keys.map((key, index) => `${key} = $${index + 2}`);
  const params = [id, ...Object.values(updateData)];

  const sqlText = `
    UPDATE asset_categories
    SET ${setClauses.join(', ')}
    WHERE category_id = $1
    RETURNING *;
  `;

  const result = await query(sqlText, params);
  return result.rows[0] || null;
};

// Delete category
export const deleteCategoryRepo = async (id) => {
  const sqlText = 'DELETE FROM asset_categories WHERE category_id = $1 RETURNING category_id;';
  const result = await query(sqlText, [id]);
  return result.rowCount > 0;
};

// Get categories by status
export const getCategoriesByStatusRepo = async (status) => {
  const sqlText = `
    SELECT 
      c.*
    FROM asset_categories c
    WHERE c.status = $1
    ORDER BY c.name ASC;
  `;
  const result = await query(sqlText, [status]);
  return result.rows;
};
