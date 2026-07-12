import apiClient from '../../../lib/api.js';

export const getEmployees = async (params = {}) => {
  try {
    return await apiClient.get('/users', { params: { ...params, role: 'EMPLOYEE' } });
  } catch (error) {
    console.error('API Error - getEmployees:', error);
    throw error;
  }
};

export const createEmployee = async (data) => {
  try {
    return await apiClient.post('/users', { ...data, role: 'EMPLOYEE' });
  } catch (error) {
    console.error('API Error - createEmployee:', error);
    throw error;
  }
};

export const updateEmployee = async (id, data) => {
  try {
    return await apiClient.put(`/users/${id}`, data);
  } catch (error) {
    console.error('API Error - updateEmployee:', error);
    throw error;
  }
};

export const deleteEmployee = async (id) => {
  try {
    return await apiClient.delete(`/users/${id}`);
  } catch (error) {
    console.error('API Error - deleteEmployee:', error);
    throw error;
  }
};

export const getEmployeeById = async (id) => {
  try {
    return await apiClient.get(`/users/${id}`);
  } catch (error) {
    console.error('API Error - getEmployeeById:', error);
    throw error;
  }
};
