// Asset Service Layer - Connected to live backend API (/assets)
import apiClient from '../../../lib/api';
import { assetCategories, assetStatuses, assetConditions } from '../data/assets';

function mapBackendAsset(asset) {
  const formatStatus = (s) => {
    if (!s) return 'Available';
    const upper = s.toUpperCase();
    if (upper === 'AVAILABLE') return 'Available';
    if (upper === 'ALLOCATED') return 'Allocated';
    if (upper === 'RESERVED') return 'Reserved';
    if (upper === 'UNDER_MAINTENANCE' || upper === 'UNDER MAINTENANCE') return 'Under Maintenance';
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
  };

  const formatCondition = (c) => {
    if (!c) return 'Good';
    const upper = c.toUpperCase();
    if (upper === 'EXCELLENT') return 'Excellent';
    if (upper === 'GOOD') return 'Good';
    if (upper === 'FAIR') return 'Fair';
    if (upper === 'POOR') return 'Poor';
    return c.charAt(0).toUpperCase() + c.slice(1).toLowerCase();
  };

  return {
    id: asset.id,
    assetTag: asset.asset_tag || asset.assetTag || '',
    name: asset.asset_name || asset.name || '',
    category: asset.category_name || asset.category || 'Laptop',
    categoryId: asset.category_id || asset.categoryId || 1,
    serialNumber: asset.serial_number || asset.serialNumber || '',
    purchaseDate: (asset.purchase_date || asset.purchaseDate || '').split('T')[0],
    warrantyExpiry: (asset.warranty_expiry || asset.warrantyExpiry || '').split('T')[0],
    value: parseFloat(asset.purchase_cost || asset.value || 0),
    condition: formatCondition(asset.condition),
    location: asset.location || 'Main Office',
    status: formatStatus(asset.status),
    assignedTo: asset.assigned_to_name || asset.assignedTo || '',
    isShared: asset.is_shared || asset.isShared || false,
  };
}

const resolveCategoryId = (category) => {
  const map = {
    laptop: 1,
    monitor: 2,
    tablet: 3,
    peripheral: 4,
    networking: 5,
    server: 3,
    printer: 4,
    'mobile device': 3,
  };
  return map[String(category || '').trim().toLowerCase()] || 1;
};

export const assetService = {
  getAll: async (params = {}) => {
    const res = await apiClient.get('/assets', { params });
    const rawAssets = res?.data || [];
    return rawAssets.map(mapBackendAsset);
  },

  getById: async (id) => {
    const res = await apiClient.get(`/assets/${id}`);
    return mapBackendAsset(res?.data);
  },

  create: async (data) => {
    const catId = resolveCategoryId(data.category);
    const payload = {
      asset_tag: data.assetTag,
      asset_name: data.name,
      category_id: parseInt(catId, 10),
      serial_number: data.serialNumber,
      purchase_date: data.purchaseDate,
      warranty_expiry: data.warrantyExpiry,
      purchase_cost: parseFloat(data.value),
      condition: (data.condition || 'EXCELLENT').toUpperCase(),
      location: data.location,
      is_shared: false,
      status: 'AVAILABLE',
    };
    const res = await apiClient.post('/assets', payload);
    const createdObj = res?.data || {};
    return mapBackendAsset({
      ...createdObj,
      category_id: catId,
      category_name: data.category || 'Laptop',
    });
  },

  update: async (id, data) => {
    const catId = resolveCategoryId(data.category);
    const payload = {
      asset_name: data.name,
      asset_tag: data.assetTag,
      category_id: parseInt(catId, 10),
      serial_number: data.serialNumber,
      purchase_date: data.purchaseDate,
      warranty_expiry: data.warrantyExpiry,
      location: data.location,
      condition: (data.condition || 'EXCELLENT').toUpperCase(),
      purchase_cost: parseFloat(data.value || 0),
    };
    const res = await apiClient.put(`/assets/${id}`, payload);
    const updatedObj = res?.data || {};
    return mapBackendAsset({
      ...updatedObj,
      category_id: catId,
      category_name: data.category || 'Laptop',
    });
  },

  delete: async (id) => {
    return await apiClient.delete(`/assets/${id}`);
  },

  search: async (query) => {
    const res = await apiClient.get('/assets/search', { params: { q: query } });
    const rawAssets = res?.data || [];
    return rawAssets.map(mapBackendAsset);
  },

  getCategories: async () => assetCategories,
  getStatuses: async () => assetStatuses,
  getConditions: async () => assetConditions,
};

export default assetService;
