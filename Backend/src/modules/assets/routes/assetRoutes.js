import express from 'express';
import * as controller from '../controllers/assetController.js';
import * as schemas from '../schemas/assetSchemas.js';
import { validate, validateQuery } from '../../../shared/validators.js';

const router = express.Router();

// GET /api/assets/search - Search assets
router.get('/search', controller.searchAssets);

// POST /api/assets - Register new asset
router.post('/', validate(schemas.createAssetSchema), controller.createAsset);

// GET /api/assets - Get paginated asset directory
router.get('/', validateQuery(schemas.assetFilterSchema), controller.getAssets);

// GET /api/assets/:id - Get asset details
router.get('/:id', controller.getAssetById);

// PUT /api/assets/:id - Update asset details
router.put('/:id', validate(schemas.updateAssetSchema), controller.updateAsset);

// DELETE /api/assets/:id - Delete an asset
router.delete('/:id', controller.deleteAsset);

// POST /api/assets/:id/allocate - Allocate asset
router.post('/:id/allocate', validate(schemas.allocateAssetSchema), controller.allocateAsset);

// POST /api/assets/:id/transfer - Request asset transfer
router.post('/:id/transfer', validate(schemas.transferRequestSchema), controller.createTransferRequest);

// POST /api/assets/:id/transfer/approve - Approve asset transfer
router.post('/:id/transfer/approve', validate(schemas.approveTransferSchema), controller.approveTransfer);

// POST /api/assets/:id/transfer/reject - Reject asset transfer
router.post('/:id/transfer/reject', validate(schemas.rejectTransferSchema), controller.rejectTransfer);

// POST /api/assets/:id/return - Return allocated asset
router.post('/:id/return', validate(schemas.returnAssetSchema), controller.returnAsset);

// GET /api/assets/:id/history - Get asset lifecycle history
router.get('/:id/history', controller.getAssetHistory);

export default router;
