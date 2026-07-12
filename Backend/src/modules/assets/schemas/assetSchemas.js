import { z } from '../../../shared/validators.js';

// Schema for creating an asset
export const createAssetSchema = z.object({
  asset_tag: z.string().min(1, 'Asset tag is required').max(50, 'Asset tag must not exceed 50 characters'),
  asset_name: z.string().min(1, 'Asset name is required').max(255, 'Asset name must not exceed 255 characters'),
  category_id: z.number().int().positive('Category ID must be a positive integer'),
  serial_number: z.string().max(100, 'Serial number must not exceed 100 characters').optional().nullable(),
  purchase_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Purchase date must be in YYYY-MM-DD format'),
  purchase_cost: z.number().nonnegative('Purchase cost cannot be negative').optional().nullable(),
  condition: z.enum(['EXCELLENT', 'GOOD', 'FAIR', 'POOR', 'DAMAGED']).default('GOOD'),
  location: z.string().max(255, 'Location must not exceed 255 characters').optional().nullable(),
  is_shared: z.boolean().default(false),
  status: z.enum(['AVAILABLE', 'ALLOCATED', 'RESERVED', 'UNDER_MAINTENANCE', 'LOST', 'RETIRED', 'DISPOSED']).default('AVAILABLE'),
  photo_url: z.string().url('Invalid URL').max(500, 'Photo URL too long').optional().nullable(),
});

// Schema for updating an asset
export const updateAssetSchema = createAssetSchema.partial();

// Schema for allocating an asset
export const allocateAssetSchema = z.object({
  employee_id: z.number().int().positive('Employee ID must be a positive integer'),
  department_id: z.number().int().positive('Department ID must be a positive integer'),
  allocated_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Allocated date must be in YYYY-MM-DD format'),
  expected_return_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Expected return date must be in YYYY-MM-DD format').optional().nullable(),
  condition_notes: z.string().max(1000).optional().nullable(),
  remarks: z.string().max(1000).optional().nullable(),
});

// Schema for initiating a transfer request
export const transferRequestSchema = z.object({
  from_employee: z.number().int().positive('Current employee ID is required'),
  to_employee: z.number().int().positive('Target employee ID is required'),
  requested_by: z.number().int().positive('Requested by user ID is required'),
});

// Schema for approving a transfer request
export const approveTransferSchema = z.object({
  approved_by: z.number().int().positive('Approved by user ID is required'),
});

// Schema for rejecting a transfer request
export const rejectTransferSchema = z.object({
  rejected_by: z.number().int().positive('Rejected by user ID is required'),
  reason: z.string().max(500).optional().nullable(),
});

// Schema for returning an asset
export const returnAssetSchema = z.object({
  actual_return_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Actual return date must be in YYYY-MM-DD format'),
  condition_notes: z.string().max(1000).optional().nullable(),
  remarks: z.string().max(1000).optional().nullable(),
  status: z.enum(['AVAILABLE', 'UNDER_MAINTENANCE', 'RETIRED']).default('AVAILABLE'),
});

// Schema for asset query filtering
export const assetFilterSchema = z.object({
  page: z.string().transform((val) => parseInt(val, 10)).pipe(z.number().int().positive().default(1)).optional(),
  limit: z.string().transform((val) => parseInt(val, 10)).pipe(z.number().int().positive().max(100).default(10)).optional(),
  status: z.string().optional(),
  category_id: z.string().transform((val) => parseInt(val, 10)).optional(),
  sortBy: z.enum(['asset_name', 'asset_tag', 'purchase_date', 'created_at', 'status']).optional(),
  sortOrder: z.enum(['asc', 'desc']).default('asc').optional(),
  q: z.string().optional(),
});
