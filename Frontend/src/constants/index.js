// Navigation items for the sidebar
export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', path: '/', icon: 'HiOutlineSquares2X2' },
  { id: 'departments', label: 'Departments', path: '/departments', icon: 'HiOutlineBuildingOffice2' },
  { id: 'employees', label: 'Employees', path: '/employees', icon: 'HiOutlineUsers' },
  { id: 'assets', label: 'Assets', path: '/assets', icon: 'HiOutlineCube' },
  { id: 'allocations', label: 'Asset Allocation', path: '/allocations', icon: 'HiOutlineArrowsRightLeft' },
  { id: 'bookings', label: 'Resource Booking', path: '/bookings', icon: 'HiOutlineCalendarDays' },
  { id: 'maintenance', label: 'Maintenance', path: '/maintenance', icon: 'HiOutlineWrenchScrewdriver' },
  { id: 'reports', label: 'Reports', path: '/reports', icon: 'HiOutlineChartBarSquare' },
  { id: 'settings', label: 'Settings', path: '/settings', icon: 'HiOutlineCog6Tooth' },
];

// Status color mappings
export const STATUS_COLORS = {
  Available: 'success',
  Active: 'success',
  Allocated: 'primary',
  Reserved: 'secondary',
  'Under Maintenance': 'warning',
  'In Progress': 'warning',
  Pending: 'warning',
  Approved: 'secondary',
  Lost: 'danger',
  Retired: 'muted',
  Disposed: 'danger',
  Resolved: 'success',
  Completed: 'success',
  Returned: 'muted',
  Overdue: 'danger',
  Transferred: 'secondary',
  Upcoming: 'primary',
  Ongoing: 'success',
  Cancelled: 'danger',
  Inactive: 'muted',
  'On Leave': 'warning',
};

// Priority color mappings
export const PRIORITY_COLORS = {
  Critical: 'danger',
  High: 'warning',
  Medium: 'secondary',
  Low: 'muted',
};

// User profile (mock current user)
export const CURRENT_USER = {
  name: 'Alex Thompson',
  email: 'alex.thompson@assetflow.com',
  role: 'Admin',
  avatar: null,
};

// App info
export const APP_NAME = 'AssetFlow';
export const APP_TAGLINE = 'Enterprise Asset & Resource Management';
