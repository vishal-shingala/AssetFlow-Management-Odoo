import { departments } from '../data/departments';
import { employees } from '../data/employees';
import { bookings } from '../data/bookings';
import { maintenanceRequests } from '../data/maintenance';
import { allocations } from '../data/allocations';
import {
  kpiCards, assetsByCategory, assetsByStatus,
  maintenanceOverview, departmentAssets,
  recentActivities, recentNotifications,
} from '../data/dashboard';
import {
  assetCategoryReport, assetStatusReport,
  departmentAllocationReport, maintenanceFrequencyReport,
  resourceUtilizationReport, recentReports,
} from '../data/reports';

import apiClient from './api.js';

export const departmentService = {
  getAll: async () => departments,
  getById: async (id) => departments.find((d) => d.id === id),
  create: async (data) => ({ ...data, id: Date.now() }),
  update: async (id, data) => ({ ...data, id }),
  delete: async (id) => ({ success: true, id }),
};

export const employeeService = {
  getAll: async () => employees,
  getById: async (id) => employees.find((e) => e.id === id),
  create: async (data) => ({ ...data, id: Date.now() }),
  update: async (id, data) => ({ ...data, id }),
  delete: async (id) => ({ success: true, id }),
};

export const resourceService = {
  getAll: async (params) => {
    const res = await apiClient.get('/resources', { params });
    return res.data; // Returns { resources: [...], pagination: {...} }
  },
  getById: async (id) => {
    const res = await apiClient.get(`/resources/${id}`);
    return res.data;
  }
};

export const bookingService = {
  getAll: async (params) => {
    const res = await apiClient.get('/bookings', { params });
    return res.data; // Returns bookings array
  },
  getById: async (id) => {
    const res = await apiClient.get(`/bookings/${id}`);
    return res.data;
  },
  create: async (data) => {
    const res = await apiClient.post('/bookings', data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await apiClient.put(`/bookings/${id}`, data);
    return res.data;
  },
  cancel: async (id) => {
    const res = await apiClient.patch(`/bookings/${id}/cancel`);
    return res.data;
  },
  delete: async (id) => {
    const res = await apiClient.delete(`/bookings/${id}`);
    return res.data;
  }
};


export const maintenanceService = {
  getAll: async () => maintenanceRequests,
  getById: async (id) => maintenanceRequests.find((m) => m.id === id),
  create: async (data) => ({ ...data, id: Date.now() }),
  update: async (id, data) => ({ ...data, id }),
  delete: async (id) => ({ success: true, id }),
};

export const allocationService = {
  getAll: async () => allocations,
  getById: async (id) => allocations.find((a) => a.id === id),
  create: async (data) => ({ ...data, id: Date.now() }),
  update: async (id, data) => ({ ...data, id }),
  delete: async (id) => ({ success: true, id }),
};

export const dashboardService = {
  getKpiCards: async () => kpiCards,
  getAssetsByCategory: async () => assetsByCategory,
  getAssetsByStatus: async () => assetsByStatus,
  getMaintenanceOverview: async () => maintenanceOverview,
  getDepartmentAssets: async () => departmentAssets,
  getRecentActivities: async () => recentActivities,
  getRecentNotifications: async () => recentNotifications,
};

export const reportService = {
  getAssetCategoryReport: async () => assetCategoryReport,
  getAssetStatusReport: async () => assetStatusReport,
  getDepartmentAllocationReport: async () => departmentAllocationReport,
  getMaintenanceFrequencyReport: async () => maintenanceFrequencyReport,
  getResourceUtilizationReport: async () => resourceUtilizationReport,
  getRecentReports: async () => recentReports,
};
