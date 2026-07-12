import { z } from '../../../shared/validators.js';

// Schema for user query filtering
export const userFilterSchema = z.object({
  page: z.string().transform((val) => parseInt(val, 10)).pipe(z.number().int().positive().default(1)).optional(),
  limit: z.string().transform((val) => parseInt(val, 10)).pipe(z.number().int().positive().max(100).default(50)).optional(),
  role: z.enum(['EMPLOYEE', 'DEPARTMENT_HEAD', 'ASSET_MANAGER', 'ADMIN']).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
});
