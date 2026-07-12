import {
  assetCategoryReport, assetStatusReport,
  departmentAllocationReport, maintenanceFrequencyReport,
  resourceUtilizationReport, recentReports,
} from '../data/reports';

export const reportService = {
  getAssetCategoryReport: async () => assetCategoryReport,
  getAssetStatusReport: async () => assetStatusReport,
  getDepartmentAllocationReport: async () => departmentAllocationReport,
  getMaintenanceFrequencyReport: async () => maintenanceFrequencyReport,
  getResourceUtilizationReport: async () => resourceUtilizationReport,
  getRecentReports: async () => recentReports,
};
