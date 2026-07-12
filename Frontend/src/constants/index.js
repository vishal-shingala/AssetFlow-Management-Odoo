import { LayoutDashboard, Building2, Users, Box, ArrowRightLeft, Calendar, Wrench, BarChart3, Settings } from 'lucide-react';

// Navigation items for the sidebar
export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', path: '/', icon: LayoutDashboard },
  { id: 'departments', label: 'Departments', path: '/departments', icon: Building2 },
  { id: 'employees', label: 'Employees', path: '/employees', icon: Users },
  { id: 'assets', label: 'Assets', path: '/assets', icon: Box },
  { id: 'allocations', label: 'Asset Allocation', path: '/allocations', icon: ArrowRightLeft },
  { id: 'bookings', label: 'Resource Booking', path: '/bookings', icon: Calendar },
  { id: 'maintenance', label: 'Maintenance', path: '/maintenance', icon: Wrench },
  { id: 'reports', label: 'Reports', path: '/reports', icon: BarChart3 },
  { id: 'settings', label: 'Settings', path: '/settings', icon: Settings },
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
