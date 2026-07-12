import apiClient from '../../../lib/api.js';

export const getDepartments = async (params = {}) => {
  try {
    return await apiClient.get('/departments', { params });
  } catch (error) {
    console.error('API Error - getDepartments:', error);
    throw error;
  }
};

export const createDepartment = async (data) => {
  try {
    return await apiClient.post('/departments', data);
  } catch (error) {
    console.error('API Error - createDepartment:', error);
    throw error;
  }
};

export const updateDepartment = async (id, data) => {
  try {
    console.log('API updateDepartment - Calling with:', { id, data });
    const response = await apiClient.put(`/departments/${id}`, data);
    console.log('API updateDepartment - Response:', response);
    return response;
  } catch (error) {
    console.error('API Error - updateDepartment:', error);
    console.error('Error response:', error.response);
    console.error('Error request:', error.request);
    throw error;
  }
};

export const deleteDepartment = async (id) => {
  try {
    return await apiClient.delete(`/departments/${id}`);
  } catch (error) {
    console.error('API Error - deleteDepartment:', error);
    throw error;
  }
};

export const searchDepartments = async (query, limit = 20) => {
  try {
    return await apiClient.get('/departments/search', { params: { q: query, limit } });
  } catch (error) {
    console.error('API Error - searchDepartments:', error);
    throw error;
  }
};

export const getDepartmentById = async (id) => {
  try {
    return await apiClient.get(`/departments/${id}`);
  } catch (error) {
    console.error('API Error - getDepartmentById:', error);
    throw error;
  }
};

export const getEmployees = async () => {
  try {
    return await apiClient.get('/users/role/EMPLOYEE');
  } catch (error) {
    console.error('API Error - getEmployees:', error);
    throw error;
  }
};
