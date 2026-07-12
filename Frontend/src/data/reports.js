// Asset Category Distribution
export const assetCategoryReport = [
  { name: 'Laptops', value: 320, fill: '#4F46E5' },
  { name: 'Monitors', value: 210, fill: '#818CF8' },
  { name: 'Furniture', value: 180, fill: '#10B981' },
  { name: 'Vehicles', value: 95, fill: '#F59E0B' },
  { name: 'Software', value: 150, fill: '#DC2626' },
  { name: 'Networking', value: 72, fill: '#6366F1' },
  { name: 'Peripherals', value: 145, fill: '#EC4899' },
  { name: 'Tablets', value: 68, fill: '#14B8A6' },
];

// Asset Status Overview
export const assetStatusReport = [
  { name: 'Available', value: 847, fill: '#10B981' },
  { name: 'Allocated', value: 423, fill: '#4F46E5' },
  { name: 'Reserved', value: 64, fill: '#818CF8' },
  { name: 'Maintenance', value: 56, fill: '#F59E0B' },
  { name: 'Retired', value: 38, fill: '#6B7280' },
  { name: 'Disposed', value: 12, fill: '#DC2626' },
];

// Department-wise Asset Allocation
export const departmentAllocationReport = [
  { department: 'Engineering', laptops: 85, monitors: 42, furniture: 30, other: 88 },
  { department: 'Marketing', laptops: 35, monitors: 18, furniture: 15, other: 52 },
  { department: 'Sales', laptops: 55, monitors: 28, furniture: 22, other: 80 },
  { department: 'HR', laptops: 15, monitors: 12, furniture: 18, other: 33 },
  { department: 'Finance', laptops: 20, monitors: 15, furniture: 12, other: 48 },
  { department: 'Operations', laptops: 40, monitors: 22, furniture: 25, other: 73 },
  { department: 'Design', laptops: 30, monitors: 28, furniture: 10, other: 42 },
];

// Maintenance Frequency (Last 6 Months)
export const maintenanceFrequencyReport = [
  { month: 'Feb', critical: 3, high: 8, medium: 12, low: 5 },
  { month: 'Mar', critical: 2, high: 10, medium: 15, low: 8 },
  { month: 'Apr', critical: 5, high: 7, medium: 10, low: 6 },
  { month: 'May', critical: 1, high: 12, medium: 18, low: 4 },
  { month: 'Jun', critical: 4, high: 6, medium: 14, low: 9 },
  { month: 'Jul', critical: 2, high: 9, medium: 11, low: 7 },
];

// Resource Utilization (%)
export const resourceUtilizationReport = [
  { resource: 'Meeting Rooms', utilization: 78, bookings: 145 },
  { resource: 'Conference Halls', utilization: 62, bookings: 48 },
  { resource: 'Projectors', utilization: 45, bookings: 67 },
  { resource: 'Company Cars', utilization: 85, bookings: 92 },
  { resource: 'Video Conf. Units', utilization: 70, bookings: 110 },
];

// Recent Reports
export const recentReports = [
  {
    id: 1,
    name: 'Monthly Asset Report - June 2026',
    type: 'Asset Report',
    generatedBy: 'System',
    date: '2026-07-01',
    size: '2.4 MB',
    format: 'PDF',
  },
  {
    id: 2,
    name: 'Q2 Maintenance Summary',
    type: 'Maintenance Report',
    generatedBy: 'Admin',
    date: '2026-07-02',
    size: '1.8 MB',
    format: 'PDF',
  },
  {
    id: 3,
    name: 'Department Allocation Overview',
    type: 'Allocation Report',
    generatedBy: 'System',
    date: '2026-07-05',
    size: '3.1 MB',
    format: 'Excel',
  },
  {
    id: 4,
    name: 'Resource Utilization Report',
    type: 'Utilization Report',
    generatedBy: 'Admin',
    date: '2026-07-08',
    size: '1.2 MB',
    format: 'PDF',
  },
  {
    id: 5,
    name: 'Warranty Expiry Tracker',
    type: 'Asset Report',
    generatedBy: 'System',
    date: '2026-07-10',
    size: '0.8 MB',
    format: 'CSV',
  },
];
