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

export const getEmployees = async (params = {}) => {
  try {
    const response = await api.get('/users', { params: { ...params, role: 'EMPLOYEE' } });
    return response.data;
  } catch (error) {
    console.error('API Error - getEmployees:', error);
    throw error;
  }
};

export const createEmployee = async (data) => {
  try {
    const response = await api.post('/users', { ...data, role: 'EMPLOYEE' });
    return response.data;
  } catch (error) {
    console.error('API Error - createEmployee:', error);
    throw error;
  }
};

export const updateEmployee = async (id, data) => {
  try {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('API Error - updateEmployee:', error);
    throw error;
  }
};

export const deleteEmployee = async (id) => {
  try {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error('API Error - deleteEmployee:', error);
    throw error;
  }
};

export const getEmployeeById = async (id) => {
  try {
    const response = await api.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error('API Error - getEmployeeById:', error);
    throw error;
  }
};
