import { query } from '../../../config/database.js';

export const findUserByEmailRepo = async (email) => {
  const sqlText = 'SELECT * FROM users WHERE email = $1;';
  const result = await query(sqlText, [email]);
  return result.rows[0] || null;
};

export const createUserRepo = async (userData) => {
  const { name, email, password } = userData;
  const sqlText = `
    INSERT INTO users (name, email, password, role, status, is_active)
    VALUES ($1, $2, $3, 'EMPLOYEE', 'ACTIVE', true)
    RETURNING user_id, name, email, role, status, is_active, created_at;
  `;
  const result = await query(sqlText, [name, email, password]);
  return result.rows[0];
};
