import * as repo from '../repositories/userRepository.js';
import { query } from '../../../config/database.js';
import logger from '../../../config/logger.js';

class ServiceError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.name = 'ServiceError';
    this.status = status;
  }
}

export const getUsers = async (filters) => {
  return repo.getUsersRepo(filters);
};

export const getUsersByRole = async (role) => {
  return repo.getUsersByRoleRepo(role);
};

export const getUserById = async (id) => {
  const user = await repo.getUserByIdRepo(id);
  if (!user) {
    throw new ServiceError(`User with ID ${id} not found`, 404);
  }
  return user;
};

export const createUser = async (userData) => {
  // Edge case: Check if email already exists
  const existingUser = await query(
    'SELECT user_id FROM users WHERE email = $1 LIMIT 1',
    [userData.email.trim()]
  );
  if (existingUser.rows.length > 0) {
    throw new ServiceError('User with this email already exists', 409);
  }
  
  // Edge case: Validate department exists if provided
  if (userData.department_id) {
    const deptExists = await query(
      'SELECT department_id FROM departments WHERE department_id = $1 LIMIT 1',
      [userData.department_id]
    );
    if (deptExists.rows.length === 0) {
      throw new ServiceError('Department not found', 404);
    }
  }
  
  const user = await repo.createUserRepo(userData);
  logger.info('Created user successfully', { userId: user.user_id, email: user.email });
  return user;
};

export const updateUser = async (id, updateData) => {
  await getUserById(id); // Ensure user exists
  
  // Edge case: Check if new email conflicts with existing user
  if (updateData.email) {
    const existingUser = await query(
      'SELECT user_id FROM users WHERE email = $1 AND user_id != $2 LIMIT 1',
      [updateData.email.trim(), id]
    );
    if (existingUser.rows.length > 0) {
      throw new ServiceError('User with this email already exists', 409);
    }
  }
  
  // Edge case: Validate department exists if provided
  if (updateData.department_id) {
    const deptExists = await query(
      'SELECT department_id FROM departments WHERE department_id = $1 LIMIT 1',
      [updateData.department_id]
    );
    if (deptExists.rows.length === 0) {
      throw new ServiceError('Department not found', 404);
    }
  }
  
  const updated = await repo.updateUserRepo(id, updateData);
  logger.info('Updated user successfully', { userId: id });
  return updated;
};

export const deleteUser = async (id) => {
  await getUserById(id);
  const deleted = await repo.deleteUserRepo(id);
  if (!deleted) {
    throw new ServiceError(`Failed to delete user ${id}`, 500);
  }
  logger.info('Deleted user successfully', { userId: id });
  return { success: true, id };
};
