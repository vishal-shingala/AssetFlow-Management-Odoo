import apiClient from '../../../lib/api';

export const allocationService = {
  getAll: async () => {
    const res = await apiClient.get('/assets/allocations');
    return res?.data || [];
  },
  allocate: async (assetId, data) => {
    const res = await apiClient.post(`/assets/${assetId}/allocate`, data);
    return res?.data;
  },
  returnAsset: async (assetId, data) => {
    const res = await apiClient.post(`/assets/${assetId}/return`, data);
    return res?.data;
  },
};
