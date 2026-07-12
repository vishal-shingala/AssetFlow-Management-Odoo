import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const getDepartments = async (params = {}) => {
  try {
    const response = await api.get('/departments', { params });
    return response.data;
  } catch (error) {
    console.error('API Error - getDepartments:', error);
    throw error;
  }
};

export const createDepartment = async (data) => {
  try {
    const response = await api.post('/departments', data);
    return response.data;
  } catch (error) {
    console.error('API Error - createDepartment:', error);
    throw error;
  }
};

export const updateDepartment = async (id, data) => {
  try {
    const response = await api.put(`/departments/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('API Error - updateDepartment:', error);
    throw error;
  }
};

export const deleteDepartment = async (id) => {
  try {
    const response = await api.delete(`/departments/${id}`);
    return response.data;
  } catch (error) {
    console.error('API Error - deleteDepartment:', error);
    throw error;
  }
};

export const searchDepartments = async (query, limit = 20) => {
  try {
    const response = await api.get('/departments/search', { params: { q: query, limit } });
    return response.data;
  } catch (error) {
    console.error('API Error - searchDepartments:', error);
    throw error;
  }
};

export const getDepartmentById = async (id) => {
  try {
    const response = await api.get(`/departments/${id}`);
    return response.data;
  } catch (error) {
    console.error('API Error - getDepartmentById:', error);
    throw error;
  }
};
