import { query } from '../../../config/database.js';

export const getUsersRepo = async (filters = {}) => {
  const { role, status, search, page = 1, limit = 10, sortBy = 'user_id', sortOrder = 'asc' } = filters;
  const offset = (page - 1) * limit;

  const whereClauses = [];
  const params = [];
  let paramIndex = 1;

  if (role) {
    whereClauses.push(`u.role = $${paramIndex++}`);
    params.push(role);
  }

  if (status) {
    whereClauses.push(`u.status = $${paramIndex++}`);
    params.push(status);
  }

  if (search) {
    whereClauses.push(`(u.name ILIKE $${paramIndex++} OR u.email ILIKE $${paramIndex++})`);
    params.push(`%${search}%`, `%${search}%`);
  }

  const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

  const allowedSortColumns = ['user_id', 'name', 'email', 'role', 'status', 'created_at'];
  const sortCol = allowedSortColumns.includes(sortBy) ? `u.${sortBy}` : 'u.user_id';
  const orderDirection = sortOrder.toLowerCase() === 'desc' ? 'DESC' : 'ASC';

  const countSql = `SELECT COUNT(*) AS total FROM users u ${whereSql}`;
  const countResult = await query(countSql, params);
  const total = parseInt(countResult.rows[0].total, 10);

  const queryText = `
    SELECT 
      u.user_id,
      u.email,
      u.name,
      u.role,
      u.status,
      u.department_id,
      d.name AS department_name,
      u.created_at
    FROM users u
    LEFT JOIN departments d ON u.department_id = d.department_id
    ${whereSql}
    ORDER BY ${sortCol} ${orderDirection}
    LIMIT $${paramIndex++} OFFSET $${paramIndex++};
  `;

  const listParams = [...params, limit, offset];
  const result = await query(queryText, listParams);

  const transformedUsers = result.rows.map(user => ({
    id: user.user_id,
    name: user.name,
    email: user.email,
    role: user.role,
    department: user.department_name || '--',
    status: user.status === 'ACTIVE' ? 'Active' : 'Inactive',
  }));

  return {
    users: transformedUsers,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getUserByIdRepo = async (id) => {
  const result = await query(
    `SELECT u.*, d.name AS department_name 
     FROM users u 
     LEFT JOIN departments d ON u.department_id = d.department_id
     WHERE u.user_id = $1`,
    [id]
  );
  return result.rows[0] || null;
};

export const getUsersByRoleRepo = async (role) => {
  const result = await query(
    `SELECT user_id, email, name, role, status, department_id 
     FROM users WHERE role = $1 AND status = 'ACTIVE' ORDER BY name ASC`,
    [role]
  );
  return result.rows.map(user => ({
    id: user.user_id,
    user_id: user.user_id,
    email: user.email,
    name: user.name,
    role: user.role,
    status: user.status,
    department_id: user.department_id,
  }));
};

export const createUserRepo = async (userData) => {
  const {
    email,
    password,
    name,
    role = 'EMPLOYEE',
    department_id = null,
    status = 'ACTIVE',
  } = userData;

  const sqlText = `
    INSERT INTO users (
      email, password, name, role, department_id, status
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING user_id, email, name, role, status, department_id, created_at;
  `;

  const params = [
    email,
    password,
    name,
    role,
    department_id,
    status,
  ];

  const result = await query(sqlText, params);
  return result.rows[0];
};

export const updateUserRepo = async (id, updateData) => {
  const keys = Object.keys(updateData);
  if (keys.length === 0) return getUserByIdRepo(id);

  const setClauses = keys.map((key, index) => `${key} = $${index + 2}`);
  const params = [id, ...Object.values(updateData)];

  const sqlText = `
    UPDATE users
    SET ${setClauses.join(', ')}
    WHERE user_id = $1
    RETURNING user_id, email, name, role, status, department_id, created_at;
  `;

  const result = await query(sqlText, params);
  return result.rows[0] || null;
};

export const deleteUserRepo = async (id) => {
  const sqlText = 'DELETE FROM users WHERE user_id = $1 RETURNING user_id;';
  const result = await query(sqlText, [id]);
  return result.rowCount > 0;
};
