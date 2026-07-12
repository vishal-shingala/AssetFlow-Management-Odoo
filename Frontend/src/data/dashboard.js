// Dashboard KPI Cards
export const kpiCards = [
  {
    id: 1,
    title: 'Assets Available',
    value: 847,
    change: '+12.5%',
    changeType: 'positive',
    icon: 'HiOutlineCube',
    color: 'primary',
  },
  {
    id: 2,
    title: 'Assets Allocated',
    value: 423,
    change: '+8.2%',
    changeType: 'positive',
    icon: 'HiOutlineUserGroup',
    color: 'secondary',
  },
  {
    id: 3,
    title: 'Under Maintenance',
    value: 56,
    change: '-3.1%',
    changeType: 'negative',
    icon: 'HiOutlineWrenchScrewdriver',
    color: 'warning',
  },
  {
    id: 4,
    title: 'Active Bookings',
    value: 38,
    change: '+15.3%',
    changeType: 'positive',
    icon: 'HiOutlineCalendarDays',
    color: 'success',
  },
  {
    id: 5,
    title: 'Upcoming Returns',
    value: 24,
    change: '+5.7%',
    changeType: 'positive',
    icon: 'HiOutlineArrowUturnLeft',
    color: 'danger',
  },
];

// Assets by Category Chart
export const assetsByCategory = [
  { name: 'Laptops', value: 320, fill: '#4F46E5' },
  { name: 'Monitors', value: 210, fill: '#818CF8' },
  { name: 'Furniture', value: 180, fill: '#10B981' },
  { name: 'Vehicles', value: 95, fill: '#F59E0B' },
  { name: 'Software', value: 150, fill: '#DC2626' },
  { name: 'Networking', value: 72, fill: '#6366F1' },
];

// Assets by Status Chart
export const assetsByStatus = [
  { name: 'Available', value: 847, fill: '#10B981' },
  { name: 'Allocated', value: 423, fill: '#4F46E5' },
  { name: 'Reserved', value: 64, fill: '#818CF8' },
  { name: 'Maintenance', value: 56, fill: '#F59E0B' },
  { name: 'Retired', value: 38, fill: '#6B7280' },
  { name: 'Disposed', value: 12, fill: '#DC2626' },
];

// Maintenance Overview Chart (Monthly)
export const maintenanceOverview = [
  { month: 'Jan', pending: 12, inProgress: 8, resolved: 18 },
  { month: 'Feb', pending: 15, inProgress: 10, resolved: 22 },
  { month: 'Mar', pending: 8, inProgress: 12, resolved: 25 },
  { month: 'Apr', pending: 20, inProgress: 6, resolved: 15 },
  { month: 'May', pending: 10, inProgress: 14, resolved: 28 },
  { month: 'Jun', pending: 7, inProgress: 9, resolved: 30 },
  { month: 'Jul', pending: 14, inProgress: 11, resolved: 20 },
];

// Department Asset Distribution
export const departmentAssets = [
  { department: 'Engineering', assets: 245 },
  { department: 'Marketing', assets: 120 },
  { department: 'Sales', assets: 185 },
  { department: 'HR', assets: 78 },
  { department: 'Finance', assets: 95 },
  { department: 'Operations', assets: 160 },
  { department: 'Design', assets: 110 },
];

// Recent Activities
export const recentActivities = [
  {
    id: 1,
    action: 'Asset Allocated',
    description: 'MacBook Pro 16" allocated to Sarah Johnson',
    user: 'Admin',
    time: '2 minutes ago',
    type: 'allocation',
  },
  {
    id: 2,
    action: 'Maintenance Request',
    description: 'Dell Monitor #M-2847 reported screen flickering',
    user: 'Mike Chen',
    time: '15 minutes ago',
    type: 'maintenance',
  },
  {
    id: 3,
    action: 'Asset Returned',
    description: 'Logitech Webcam returned by David Kim',
    user: 'Admin',
    time: '1 hour ago',
    type: 'return',
  },
  {
    id: 4,
    action: 'Booking Confirmed',
    description: 'Conference Room A booked for Team Standup',
    user: 'Emily Davis',
    time: '2 hours ago',
    type: 'booking',
  },
  {
    id: 5,
    action: 'New Asset Added',
    description: 'ThinkPad X1 Carbon added to inventory',
    user: 'Admin',
    time: '3 hours ago',
    type: 'addition',
  },
  {
    id: 6,
    action: 'Maintenance Resolved',
    description: 'HP Printer #P-1923 back online after toner replacement',
    user: 'Tech Support',
    time: '4 hours ago',
    type: 'resolved',
  },
];

// Recent Notifications
export const recentNotifications = [
  {
    id: 1,
    title: 'Asset Return Overdue',
    message: 'Laptop #L-4521 was due for return 2 days ago from James Wilson',
    time: '5 min ago',
    type: 'warning',
    read: false,
  },
  {
    id: 2,
    title: 'Maintenance Completed',
    message: 'Server rack maintenance in Building C completed successfully',
    time: '30 min ago',
    type: 'success',
    read: false,
  },
  {
    id: 3,
    title: 'New Booking Request',
    message: 'Meeting room B2 requested for July 15, 2:00 PM - 4:00 PM',
    time: '1 hour ago',
    type: 'info',
    read: true,
  },
  {
    id: 4,
    title: 'Low Stock Alert',
    message: 'USB-C Adapters stock below minimum threshold (3 remaining)',
    time: '2 hours ago',
    type: 'danger',
    read: true,
  },
  {
    id: 5,
    title: 'Asset Approval Needed',
    message: 'New laptop purchase request from Marketing department awaiting approval',
    time: '3 hours ago',
    type: 'info',
    read: true,
  },
];
