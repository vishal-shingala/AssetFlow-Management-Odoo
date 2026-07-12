import apiClient from './api.js';

export const departmentService = {
  getAll: async (params = {}) => {
    const response = await apiClient.get('/departments', { params });
    return response;
  },
  
  getById: async (id) => {
    const response = await apiClient.get(`/departments/${id}`);
    return response;
  },
  
  create: async (data) => {
    const response = await apiClient.post('/departments', data);
    return response;
  },
  
  update: async (id, data) => {
    const response = await apiClient.put(`/departments/${id}`, data);
    return response;
  },
  
  delete: async (id) => {
    const response = await apiClient.delete(`/departments/${id}`);
    return response;
  },
  
  search: async (query, limit = 20) => {
    const response = await apiClient.get('/departments/search', {
      params: { q: query, limit }
    });
    return response;
  },
  
  getByStatus: async (status) => {
    const response = await apiClient.get(`/departments/status/${status}`);
    return response;
  },
  
  getChildDepartments: async (parentId) => {
    const response = await apiClient.get(`/departments/${parentId}/children`);
    return response;
  },
};

export default departmentService;
