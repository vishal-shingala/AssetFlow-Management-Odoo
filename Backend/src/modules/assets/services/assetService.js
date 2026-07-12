import * as repo from '../repositories/assetRepository.js';
import logger from '../../../config/logger.js';

// Service error helper
class ServiceError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.name = 'ServiceError';
    this.status = status;
  }
}

export const createAsset = async (assetData) => {
  // Check uniqueness of tag or serial number
  const existing = await repo.findAssetByTagOrSerial(assetData.asset_tag, assetData.serial_number);
  if (existing.length > 0) {
    throw new ServiceError('Asset tag or serial number already exists', 409);
  }

  const asset = await repo.createAssetRepo(assetData);
  logger.info('Created asset successfully', { assetId: asset.id, asset_tag: asset.asset_tag });
  return asset;
};

export const getAssets = async (filters) => {
  return repo.getAssetsRepo(filters);
};

export const searchAssets = async (queryStr, limit = 20) => {
  if (!queryStr || queryStr.trim().length === 0) {
    return [];
  }
  return repo.searchAssetsRepo(queryStr.trim(), limit);
};

export const getAssetById = async (id) => {
  const asset = await repo.getAssetByIdRepo(id);
  if (!asset) {
    throw new ServiceError(`Asset with ID ${id} not found`, 404);
  }
  return asset;
};

export const updateAsset = async (id, updateData) => {
  await getAssetById(id); // Ensure asset exists
  const updated = await repo.updateAssetRepo(id, updateData);
  logger.info('Updated asset successfully', { assetId: id });
  return updated;
};

export const deleteAsset = async (id) => {
  await getAssetById(id);
  const deleted = await repo.deleteAssetRepo(id);
  if (!deleted) {
    throw new ServiceError(`Failed to delete asset ${id}`, 500);
  }
  logger.info('Deleted asset successfully', { assetId: id });
  return { success: true, id };
};

export const allocateAsset = async (assetId, allocationData) => {
  const asset = await getAssetById(assetId);
  if (asset.status !== 'AVAILABLE') {
    throw new ServiceError(`Asset is currently ${asset.status} and cannot be allocated`, 400);
  }

  const allocation = await repo.allocateAssetRepo(assetId, allocationData);
  logger.info('Allocated asset successfully', { assetId, allocationId: allocation.id });
  return allocation;
};

export const createTransferRequest = async (assetId, transferData) => {
  await getAssetById(assetId);
  const transferRequest = await repo.createTransferRequestRepo(assetId, transferData);
  logger.info('Created transfer request successfully', { transferId: transferRequest.id, assetId });
  return transferRequest;
};

export const approveTransfer = async (transferRequestId, approvedBy) => {
  const approved = await repo.approveTransferRepo(transferRequestId, approvedBy);
  if (!approved) {
    throw new ServiceError('Transfer request not found or not in PENDING status', 400);
  }
  logger.info('Approved transfer request successfully', { transferRequestId, approvedBy });
  return approved;
};

export const rejectTransfer = async (transferRequestId, rejectedBy, reason) => {
  const rejected = await repo.rejectTransferRepo(transferRequestId, rejectedBy, reason);
  if (!rejected) {
    throw new ServiceError('Transfer request not found or not in PENDING status', 400);
  }
  logger.info('Rejected transfer request successfully', { transferRequestId, rejectedBy });
  return rejected;
};

export const returnAsset = async (assetId, returnData) => {
  await getAssetById(assetId);
  const returned = await repo.returnAssetRepo(assetId, returnData);
  if (!returned) {
    throw new ServiceError('No active allocation found for this asset', 400);
  }
  logger.info('Returned asset successfully', { assetId });
  return returned;
};

export const getAssetHistory = async (assetId) => {
  await getAssetById(assetId);
  return repo.getAssetHistoryRepo(assetId);
};
