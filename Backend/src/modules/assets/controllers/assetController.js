import * as assetService from '../services/assetService.js';

export const createAsset = async (req, res, next) => {
  try {
    const asset = await assetService.createAsset(req.body);
    res.status(201).json({
      success: true,
      message: 'Asset registered successfully',
      data: asset,
    });
  } catch (error) {
    next(error);
  }
};

export const getAssets = async (req, res, next) => {
  try {
    const result = await assetService.getAssets(req.query);
    res.status(200).json({
      success: true,
      message: 'Assets retrieved successfully',
      data: result.assets,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

export const searchAssets = async (req, res, next) => {
  try {
    const { q, limit } = req.query;
    const assets = await assetService.searchAssets(q, limit ? parseInt(limit, 10) : 20);
    res.status(200).json({
      success: true,
      message: 'Search completed successfully',
      data: assets,
    });
  } catch (error) {
    next(error);
  }
};

export const getAssetById = async (req, res, next) => {
  try {
    const asset = await assetService.getAssetById(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Asset retrieved successfully',
      data: asset,
    });
  } catch (error) {
    next(error);
  }
};

export const updateAsset = async (req, res, next) => {
  try {
    const asset = await assetService.updateAsset(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: 'Asset updated successfully',
      data: asset,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAsset = async (req, res, next) => {
  try {
    await assetService.deleteAsset(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Asset deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const allocateAsset = async (req, res, next) => {
  try {
    const allocation = await assetService.allocateAsset(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: 'Asset allocated successfully',
      data: allocation,
    });
  } catch (error) {
    next(error);
  }
};

export const createTransferRequest = async (req, res, next) => {
  try {
    const transferRequest = await assetService.createTransferRequest(req.params.id, req.body);
    res.status(201).json({
      success: true,
      message: 'Transfer request created successfully',
      data: transferRequest,
    });
  } catch (error) {
    next(error);
  }
};

export const approveTransfer = async (req, res, next) => {
  try {
    const { approved_by } = req.body;
    const approved = await assetService.approveTransfer(req.params.id, approved_by);
    res.status(200).json({
      success: true,
      message: 'Transfer request approved successfully',
      data: approved,
    });
  } catch (error) {
    next(error);
  }
};

export const rejectTransfer = async (req, res, next) => {
  try {
    const { rejected_by, reason } = req.body;
    const rejected = await assetService.rejectTransfer(req.params.id, rejected_by, reason);
    res.status(200).json({
      success: true,
      message: 'Transfer request rejected successfully',
      data: rejected,
    });
  } catch (error) {
    next(error);
  }
};

export const returnAsset = async (req, res, next) => {
  try {
    const returned = await assetService.returnAsset(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: 'Asset returned successfully',
      data: returned,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllocations = async (req, res, next) => {
  try {
    const allocations = await assetService.getAllocations();
    res.status(200).json({
      success: true,
      message: 'Allocations retrieved successfully',
      data: allocations,
    });
  } catch (error) {
    next(error);
  }
};

export const getAssetHistory = async (req, res, next) => {
  try {
    const history = await assetService.getAssetHistory(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Asset lifecycle history retrieved successfully',
      data: history,
    });
  } catch (error) {
    next(error);
  }
};
