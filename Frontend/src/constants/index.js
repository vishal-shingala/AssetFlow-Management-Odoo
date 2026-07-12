// Navigation items for the sidebar
export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', path: '/', icon: 'pi-th-large' },
  { id: 'departments', label: 'Departments', path: '/departments', icon: 'pi-building' },
  { id: 'employees', label: 'Employees', path: '/employees', icon: 'pi-users' },
  { id: 'assets', label: 'Assets', path: '/assets', icon: 'pi-box' },
  { id: 'allocations', label: 'Asset Allocation', path: '/allocations', icon: 'pi-arrows-h' },
  { id: 'bookings', label: 'Resource Booking', path: '/bookings', icon: 'pi-calendar' },
  { id: 'maintenance', label: 'Maintenance', path: '/maintenance', icon: 'pi-wrench' },
  { id: 'reports', label: 'Reports', path: '/reports', icon: 'pi-chart-bar' },
  { id: 'settings', label: 'Settings', path: '/settings', icon: 'pi-cog' },
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
