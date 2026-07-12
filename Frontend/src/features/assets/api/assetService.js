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
    assetTag: asset.asset_tag || '',
    name: asset.asset_name || '',
    category: asset.category_name || 'Laptop',
    categoryId: asset.category_id || 1,
    serialNumber: asset.serial_number || 'N/A',
    purchaseDate: asset.purchase_date ? asset.purchase_date.split('T')[0] : '',
    warrantyExpiry: asset.warranty_expiry ? asset.warranty_expiry.split('T')[0] : '',
    value: parseFloat(asset.purchase_cost || 0),
    condition: formatCondition(asset.condition),
    location: asset.location || 'Main Office',
    status: formatStatus(asset.status),
    assignedTo: asset.assigned_to_name || '',
    isShared: asset.is_shared || false,
  };
}

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
    const payload = {
      asset_tag: data.assetTag || `AST-${Math.floor(100 + Math.random() * 900)}`,
      asset_name: data.name,
      category_id: parseInt(data.categoryId || 1, 10),
      serial_number: data.serialNumber || `SN-${Date.now()}`,
      purchase_date: data.purchaseDate || new Date().toISOString().split('T')[0],
      purchase_cost: parseFloat(data.value || 0),
      condition: (data.condition || 'EXCELLENT').toUpperCase(),
      location: data.location || 'Main Office',
      is_shared: false,
      status: 'AVAILABLE',
    };
    const res = await apiClient.post('/assets', payload);
    return mapBackendAsset(res?.data);
  },

  update: async (id, data) => {
    const res = await apiClient.put(`/assets/${id}`, data);
    return mapBackendAsset(res?.data);
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
