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

export const bookingService = {
  getAll: async () => bookings,
  getById: async (id) => bookings.find((b) => b.id === id),
  create: async (data) => ({ ...data, id: Date.now() }),
  update: async (id, data) => ({ ...data, id }),
  delete: async (id) => ({ success: true, id }),
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
