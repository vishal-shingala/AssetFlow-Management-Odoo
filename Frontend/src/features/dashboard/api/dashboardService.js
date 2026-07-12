import {
  kpiCards, assetsByCategory, assetsByStatus,
  maintenanceOverview, departmentAssets,
  recentActivities, recentNotifications,
} from '../data/dashboard';

export const dashboardService = {
  getKpiCards: async () => kpiCards,
  getAssetsByCategory: async () => assetsByCategory,
  getAssetsByStatus: async () => assetsByStatus,
  getMaintenanceOverview: async () => maintenanceOverview,
  getDepartmentAssets: async () => departmentAssets,
  getRecentActivities: async () => recentActivities,
  getRecentNotifications: async () => recentNotifications,
};
