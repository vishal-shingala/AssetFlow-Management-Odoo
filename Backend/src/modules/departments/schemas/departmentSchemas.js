import { z } from '../../../shared/validators.js';

// Schema for creating a department (accepts both string and ID formats)
export const createDepartmentSchema = z.object({
  name: z.string().min(1, 'Department name is required').max(255, 'Department name must not exceed 255 characters'),
  head: z.string().optional(),
  parentDept: z.string().optional(),
  department_head_id: z.number().int().nullable().optional(),
  parent_department_id: z.number().int().nullable().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE'),
});

// Schema for updating a department (accepts both string and ID formats)
export const updateDepartmentSchema = z.object({
  name: z.string().min(1, 'Department name is required').max(255, 'Department name must not exceed 255 characters').optional(),
  head: z.string().optional(),
  parentDept: z.string().optional(),
  department_head_id: z.number().int().nullable().optional(),
  parent_department_id: z.number().int().nullable().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
}).partial();

// Schema for department query filtering
export const departmentFilterSchema = z.object({
  page: z.string().transform((val) => parseInt(val, 10)).pipe(z.number().int().positive().default(1)).optional(),
  limit: z.string().transform((val) => parseInt(val, 10)).pipe(z.number().int().positive().max(100).default(10)).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
  sortBy: z.enum(['department_id', 'name', 'status', 'created_at']).optional(),
  sortOrder: z.enum(['asc', 'desc']).default('asc').optional(),
  q: z.string().optional(),
});
