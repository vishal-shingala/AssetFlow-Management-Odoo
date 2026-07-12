import { z } from '../../../shared/validators.js';

// Schema for creating a department (accepts frontend format with head/parentDept as strings)
export const createDepartmentSchema = z.object({
  name: z.string().min(1, 'Department name is required').max(255, 'Department name must not exceed 255 characters'),
  head: z.string().optional(),
  parentDept: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE'),
});

// Schema for updating a department
export const updateDepartmentSchema = createDepartmentSchema.partial();

// Schema for department query filtering
export const departmentFilterSchema = z.object({
  page: z.string().transform((val) => parseInt(val, 10)).pipe(z.number().int().positive().default(1)).optional(),
  limit: z.string().transform((val) => parseInt(val, 10)).pipe(z.number().int().positive().max(100).default(10)).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
  sortBy: z.enum(['department_id', 'name', 'status', 'created_at']).optional(),
  sortOrder: z.enum(['asc', 'desc']).default('asc').optional(),
  q: z.string().optional(),
});
