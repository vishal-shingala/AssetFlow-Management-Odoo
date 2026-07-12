import express from 'express';
import * as controller from '../controllers/assetController.js';
import * as schemas from '../schemas/assetSchemas.js';
import { validate, validateQuery } from '../../../shared/validators.js';
import { authenticate, authorize } from '../../../middlewares/auth.middleware.js';

const router = express.Router();

// Apply authentication to all asset routes
router.use(authenticate);

// GET /api/assets/search - Search assets
router.get('/search', controller.searchAssets);

// POST /api/assets - Register new asset (Asset Manager & Admin)
router.post('/', authorize(['ASSET_MANAGER', 'ADMIN']), validate(schemas.createAssetSchema), controller.createAsset);

// GET /api/assets - Get paginated asset directory
router.get('/', validateQuery(schemas.assetFilterSchema), controller.getAssets);

// GET /api/assets/allocations - Get all asset allocations (Dept Head, Asset Manager, Admin)
router.get('/allocations', authorize(['DEPARTMENT_HEAD', 'ASSET_MANAGER', 'ADMIN']), controller.getAllocations);

// GET /api/assets/:id - Get asset details
router.get('/:id', controller.getAssetById);

// PUT /api/assets/:id - Update asset details (Asset Manager & Admin)
router.put('/:id', authorize(['ASSET_MANAGER', 'ADMIN']), validate(schemas.updateAssetSchema), controller.updateAsset);

// DELETE /api/assets/:id - Delete an asset (Asset Manager & Admin)
router.delete('/:id', authorize(['ASSET_MANAGER', 'ADMIN']), controller.deleteAsset);

// POST /api/assets/:id/allocate - Allocate asset (Asset Manager & Admin)
router.post('/:id/allocate', authorize(['ASSET_MANAGER', 'ADMIN']), validate(schemas.allocateAssetSchema), controller.allocateAsset);

// POST /api/assets/:id/transfer - Request asset transfer (Any authenticated user)
router.post('/:id/transfer', validate(schemas.transferRequestSchema), controller.createTransferRequest);

// POST /api/assets/:id/transfer/approve - Approve asset transfer (Dept Head, Asset Manager, Admin)
router.post('/:id/transfer/approve', authorize(['DEPARTMENT_HEAD', 'ASSET_MANAGER', 'ADMIN']), validate(schemas.approveTransferSchema), controller.approveTransfer);

// POST /api/assets/:id/transfer/reject - Reject asset transfer (Dept Head, Asset Manager, Admin)
router.post('/:id/transfer/reject', authorize(['DEPARTMENT_HEAD', 'ASSET_MANAGER', 'ADMIN']), validate(schemas.rejectTransferSchema), controller.rejectTransfer);

// POST /api/assets/:id/return - Return allocated asset (Asset Manager & Admin)
router.post('/:id/return', authorize(['ASSET_MANAGER', 'ADMIN']), validate(schemas.returnAssetSchema), controller.returnAsset);

// GET /api/assets/:id/history - Get asset lifecycle history
router.get('/:id/history', controller.getAssetHistory);

export default router;
