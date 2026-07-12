import apiClient from '../../../lib/api.js';

export const getCategories = async (params = {}) => {
  try {
    return await apiClient.get('/categories', { params });
  } catch (error) {
    console.error('API Error - getCategories:', error);
    throw error;
  }
};

export const createCategory = async (data) => {
  try {
    return await apiClient.post('/categories', data);
  } catch (error) {
    console.error('API Error - createCategory:', error);
    throw error;
  }
};

export const updateCategory = async (id, data) => {
  try {
    return await apiClient.put(`/categories/${id}`, data);
  } catch (error) {
    console.error('API Error - updateCategory:', error);
    throw error;
  }
};

export const deleteCategory = async (id) => {
  try {
    return await apiClient.delete(`/categories/${id}`);
  } catch (error) {
    console.error('API Error - deleteCategory:', error);
    throw error;
  }
};

export const getCategoryById = async (id) => {
  try {
    return await apiClient.get(`/categories/${id}`);
  } catch (error) {
    console.error('API Error - getCategoryById:', error);
    throw error;
  }
};
