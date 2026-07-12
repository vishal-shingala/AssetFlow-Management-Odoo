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
  // Edge case: Check if department name already exists
  const existingDept = await query(
    'SELECT department_id FROM departments WHERE name = $1 LIMIT 1',
    [departmentData.name.trim()]
  );
  if (existingDept.rows.length > 0) {
    throw new ServiceError('Department with this name already exists', 409);
  }
  
  // Handle both name-based and ID-based inputs for head
  let department_head_id;
  if (departmentData.department_head_id !== undefined) {
    department_head_id = departmentData.department_head_id;
  } else {
    department_head_id = await resolveHeadId(departmentData.head);
  }
  
  // Edge case: Check if head is already assigned to another department
  if (department_head_id) {
    const existingHead = await query(
      'SELECT department_id FROM departments WHERE department_head_id = $1 LIMIT 1',
      [department_head_id]
    );
    if (existingHead.rows.length > 0) {
      throw new ServiceError('This user is already assigned as head of another department', 400);
    }
  }
  
  // Resolve parent department name to department_id
  const parent_department_id = await resolveParentDepartmentId(departmentData.parentDept);
  
  // Edge case: Validate parent department exists if provided
  if (parent_department_id) {
    const parentExists = await query(
      'SELECT department_id FROM departments WHERE department_id = $1 LIMIT 1',
      [parent_department_id]
    );
    if (parentExists.rows.length === 0) {
      throw new ServiceError('Parent department not found', 404);
    }
  }
  
  // Transform frontend data to backend format
  const transformedData = {
    name: departmentData.name,
    status: departmentData.status || 'ACTIVE',
    parent_department_id,
    department_head_id,
  };
  
  const department = await repo.createDepartmentRepo(transformedData);
  logger.info('Created department successfully', { departmentId: department.department_id, name: department.name, department_head_id });
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
  
  logger.info('Update department request', { id, updateData });
  
  // Handle both name-based and ID-based inputs
  let transformedData = { ...updateData };
  
  // If frontend sends IDs directly, use them
  if (updateData.department_head_id !== undefined) {
    logger.info('Processing department_head_id', { department_head_id: updateData.department_head_id });
    // Edge case: Check if head is already assigned to another department
    if (updateData.department_head_id) {
      const existingHead = await query(
        'SELECT department_id FROM departments WHERE department_head_id = $1 AND department_id != $2 LIMIT 1',
        [updateData.department_head_id, id]
      );
      if (existingHead.rows.length > 0) {
        throw new ServiceError('This user is already assigned as head of another department', 400);
      }
    }
    transformedData.department_head_id = updateData.department_head_id;
    delete transformedData.head;
  } else if (updateData.head !== undefined) {
    // Legacy: resolve head name to user_id
    const department_head_id = await resolveHeadId(updateData.head);
    
    // Edge case: Check if head is already assigned to another department
    if (department_head_id) {
      const existingHead = await query(
        'SELECT department_id FROM departments WHERE department_head_id = $1 AND department_id != $2 LIMIT 1',
        [department_head_id, id]
      );
      if (existingHead.rows.length > 0) {
        throw new ServiceError('This user is already assigned as head of another department', 400);
      }
    }
    transformedData.department_head_id = department_head_id;
    delete transformedData.head;
  }
  
  if (updateData.parent_department_id !== undefined) {
    logger.info('Processing parent_department_id', { parent_department_id: updateData.parent_department_id });
    // Edge case: Prevent department from being its own parent
    if (transformedData.parent_department_id === id) {
      throw new ServiceError('A department cannot be its own parent', 400);
    }
    
    // Edge case: Check for circular references
    if (transformedData.parent_department_id) {
      const hasCircularReference = await checkCircularReference(id, transformedData.parent_department_id);
      if (hasCircularReference) {
        throw new ServiceError('Circular reference detected: This would create a loop in department hierarchy', 400);
      }
    }
    
    transformedData.parent_department_id = updateData.parent_department_id;
    delete transformedData.parentDept;
  } else if (updateData.parentDept !== undefined) {
    // Legacy: resolve parent department name to department_id
    const parentId = await resolveParentDepartmentId(updateData.parentDept);
    
    // Edge case: Prevent department from being its own parent
    if (parentId === id) {
      throw new ServiceError('A department cannot be its own parent', 400);
    }
    
    // Edge case: Check for circular references
    if (parentId) {
      const hasCircularReference = await checkCircularReference(id, parentId);
      if (hasCircularReference) {
        throw new ServiceError('Circular reference detected: This would create a loop in department hierarchy', 400);
      }
    }
    
    transformedData.parent_department_id = parentId;
    delete transformedData.parentDept;
  }
  
  logger.info('Transformed data for update', { transformedData });
  const updated = await repo.updateDepartmentRepo(id, transformedData);
  logger.info('Updated department successfully', { departmentId: id, updated });
  return updated;
};

// Helper function to check for circular references in department hierarchy
const checkCircularReference = async (currentId, newParentId) => {
  if (!newParentId) return false;
  
  // Check if newParentId is already a descendant of currentId
  let currentDept = await getDepartmentById(newParentId);
  const visited = new Set();
  
  while (currentDept && currentDept.parent_department_id) {
    if (currentDept.parent_department_id === currentId) {
      return true; // Circular reference found
    }
    if (visited.has(currentDept.parent_department_id)) {
      return true; // Loop detected
    }
    visited.add(currentDept.parent_department_id);
    currentDept = await getDepartmentById(currentDept.parent_department_id);
  }
  
  return false;
};

export const deleteDepartment = async (id) => {
  await getDepartmentById(id);
  
  // Edge case: Check if department has child departments
  const childDepartments = await query(
    'SELECT department_id FROM departments WHERE parent_department_id = $1 LIMIT 1',
    [id]
  );
  if (childDepartments.rows.length > 0) {
    throw new ServiceError('Cannot delete department: It has child departments. Please reassign or delete child departments first.', 400);
  }
  
  // Edge case: Check if department has employees assigned (excluding the department head)
  const employees = await query(
    'SELECT user_id FROM users WHERE department_id = $1 AND user_id != (SELECT department_head_id FROM departments WHERE department_id = $1) LIMIT 1',
    [id]
  );
  if (employees.rows.length > 0) {
    throw new ServiceError('Cannot delete department: It has employees assigned. Please reassign employees first.', 400);
  }
  
  // Edge case: Delete asset allocations if they exist
  await query(
    'DELETE FROM asset_allocations WHERE department_id = $1',
    [id]
  );
  logger.info('Deleted asset allocations for department', { departmentId: id });
  
  // Get the department head before deletion
  const dept = await getDepartmentById(id);
  const headId = dept.department_head_id;
  
  const deleted = await repo.deleteDepartmentRepo(id);
  if (!deleted) {
    throw new ServiceError(`Failed to delete department ${id}`, 500);
  }
  
  // Free department_id for the department head in users table
  if (headId) {
    await query(
      'UPDATE users SET department_id = NULL WHERE user_id = $1',
      [headId]
    );
    logger.info('Freed department_id for department head', { userId: headId, departmentId: id });
  }
  
  // Remove head link from other departments that had this department as their head
  // (This handles the case where a department head is deleted)
  await query(
    'UPDATE departments SET department_head_id = NULL WHERE department_head_id = $1',
    [id]
  );
  
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
