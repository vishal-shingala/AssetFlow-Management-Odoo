import * as repo from '../repositories/departmentRepository.js';
import { query } from '../../../config/database.js';
import logger from '../../../config/logger.js';

// Service error helper
class ServiceError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.name = 'ServiceError';
    this.status = status;
  }
}

// Helper function to resolve head name to user_id
const resolveHeadId = async (headName) => {
  if (!headName || headName === '--' || headName.trim() === '') {
    return null;
  }
  const trimmedName = headName.trim();
  logger.info('Resolving head ID', { headName: trimmedName });
  const result = await query(
    'SELECT user_id FROM users WHERE name = $1 LIMIT 1',
    [trimmedName]
  );
  const userId = result.rows.length > 0 ? result.rows[0].user_id : null;
  logger.info('Head ID resolution result', { headName: trimmedName, userId, found: result.rows.length > 0 });
  return userId;
};

// Helper function to resolve parent department name to department_id
const resolveParentDepartmentId = async (parentDeptName) => {
  if (!parentDeptName || parentDeptName === '--' || parentDeptName.trim() === '') {
    return null;
  }
  const result = await query(
    'SELECT department_id FROM departments WHERE name = $1 LIMIT 1',
    [parentDeptName.trim()]
  );
  return result.rows.length > 0 ? result.rows[0].department_id : null;
};

export const createDepartment = async (departmentData) => {
  // Resolve head name to user_id
  const department_head_id = await resolveHeadId(departmentData.head);
  
  // Resolve parent department name to department_id
  const parent_department_id = await resolveParentDepartmentId(departmentData.parentDept);
  
  // Transform frontend data to backend format
  const transformedData = {
    name: departmentData.name,
    status: departmentData.status || 'ACTIVE',
    parent_department_id,
    department_head_id,
  };
  
  const department = await repo.createDepartmentRepo(transformedData);
  logger.info('Created department successfully', { departmentId: department.department_id, name: department.name });
  return department;
};

export const getDepartments = async (filters) => {
  return repo.getDepartmentsRepo(filters);
};

export const searchDepartments = async (queryStr, limit = 20) => {
  if (!queryStr || queryStr.trim().length === 0) {
    return [];
  }
  return repo.searchDepartmentsRepo(queryStr.trim(), limit);
};

export const getDepartmentById = async (id) => {
  const department = await repo.getDepartmentByIdRepo(id);
  if (!department) {
    throw new ServiceError(`Department with ID ${id} not found`, 404);
  }
  return department;
};

export const updateDepartment = async (id, updateData) => {
  await getDepartmentById(id); // Ensure department exists
  const updated = await repo.updateDepartmentRepo(id, updateData);
  logger.info('Updated department successfully', { departmentId: id });
  return updated;
};

export const deleteDepartment = async (id) => {
  await getDepartmentById(id);
  const deleted = await repo.deleteDepartmentRepo(id);
  if (!deleted) {
    throw new ServiceError(`Failed to delete department ${id}`, 500);
  }
  logger.info('Deleted department successfully', { departmentId: id });
  return { success: true, id };
};

export const getDepartmentsByStatus = async (status) => {
  return repo.getDepartmentsByStatusRepo(status);
};

export const getChildDepartments = async (parentId) => {
  await getDepartmentById(parentId); // Ensure parent exists
  return repo.getChildDepartmentsRepo(parentId);
};
