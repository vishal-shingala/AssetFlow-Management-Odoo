import apiClient from '../../../lib/api';

export const dashboardService = {
  getStats: async () => {
    const res = await apiClient.get('/dashboard');
    return res.data;
  }
};
