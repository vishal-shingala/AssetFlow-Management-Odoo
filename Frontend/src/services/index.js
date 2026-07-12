import { departments } from '../features/departments/data/departments';
import { employees } from '../features/employees/data/employees';
import { bookings } from '../features/bookings/data/bookings';
import { maintenanceRequests } from '../features/maintenance/data/maintenance';
import { allocations } from '../features/allocations/data/allocations';
import {
  kpiCards, assetsByCategory, assetsByStatus,
  maintenanceOverview, departmentAssets,
  recentActivities, recentNotifications,
} from '../features/dashboard/data/dashboard';
import {
  assetCategoryReport, assetStatusReport,
  departmentAllocationReport, maintenanceFrequencyReport,
  resourceUtilizationReport, recentReports,
} from '../features/reports/data/reports';

import apiClient from '../lib/api.js';

export const departmentService = {
  getAll: async () => departments,
  getById: async (id) => departments.find((d) => d.id === id),
  create: async (data) => ({ ...data, id: Date.now() }),
  update: async (id, data) => ({ ...data, id }),
  delete: async (id) => ({ success: true, id }),
};

export const employeeService = {
  getAll: async () => {
    try {
      const res = await apiClient.get('/users');
      const users = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
      return users.map((u) => ({
        id: u.user_id || u.id,
        name: u.name || u.email,
        email: u.email,
        department: u.department || u.department_name || 'N/A',
        role: u.role,
        status: u.status || 'Active',
      }));
    } catch (error) {
      console.error('Failed to fetch users from backend, falling back to mock data:', error);
      return employees;
    }
  },
  getById: async (id) => {
    try {
      const res = await apiClient.get(`/users/${id}`);
      const u = res?.data || res;
      return u ? { id: u.user_id || u.id, name: u.name, email: u.email, department: u.department_name || 'N/A', role: u.role } : null;
    } catch {
      return employees.find((e) => e.id === id);
    }
  },
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
