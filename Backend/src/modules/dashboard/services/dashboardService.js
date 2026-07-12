import { query } from '../../../config/database.js';

export const getDashboardStats = async (userId) => {
  // 1. KPI Queries
  const kpiQuery = `
    SELECT 
      COUNT(CASE WHEN status = 'AVAILABLE' THEN 1 END)::int as available,
      COUNT(CASE WHEN status = 'ALLOCATED' THEN 1 END)::int as allocated,
      COUNT(CASE WHEN status = 'UNDER_MAINTENANCE' THEN 1 END)::int as maintenance
    FROM assets;
  `;
  
  const activeBookingsQuery = `
    SELECT COUNT(*)::int FROM resource_bookings 
    WHERE status IN ('UPCOMING', 'ONGOING');
  `;
  
  const upcomingReturnsQuery = `
    SELECT COUNT(*)::int FROM asset_allocations 
    WHERE status = 'ACTIVE' AND expected_return_date >= CURRENT_DATE;
  `;

  // 2. Assets by Category Query
  const categoryQuery = `
    SELECT c.name, COUNT(a.id)::int as value
    FROM asset_categories c
    LEFT JOIN assets a ON a.category_id = c.category_id
    GROUP BY c.name
    HAVING COUNT(a.id) > 0;
  `;

  // 3. Assets by Status Query
  const statusQuery = `
    SELECT status as name, COUNT(*)::int as value 
    FROM assets 
    GROUP BY status;
  `;

  // 4. Maintenance Overview Query (last 6 months)
  const maintenanceQuery = `
    SELECT 
      TO_CHAR(created_at, 'Mon') as month,
      COUNT(CASE WHEN status = 'PENDING' THEN 1 END)::int as pending,
      COUNT(CASE WHEN status = 'IN_PROGRESS' THEN 1 END)::int as "inProgress",
      COUNT(CASE WHEN status = 'RESOLVED' THEN 1 END)::int as resolved
    FROM maintenance_requests
    WHERE created_at >= CURRENT_DATE - INTERVAL '6 months'
    GROUP BY TO_CHAR(created_at, 'Mon'), DATE_TRUNC('month', created_at)
    ORDER BY DATE_TRUNC('month', created_at);
  `;

  // 5. Department Asset Distribution Query
  const deptAssetsQuery = `
    SELECT d.name as department, COUNT(a.id)::int as assets
    FROM departments d
    LEFT JOIN asset_allocations a ON a.department_id = d.department_id AND a.status = 'ACTIVE'
    GROUP BY d.name;
  `;

  // 6. Recent Activities Query (limit 6)
  const activitiesQuery = `
    SELECT 
      l.log_id as id,
      l.action,
      l.entity_type as type,
      l.created_at as time,
      u.name as user
    FROM activity_logs l
    JOIN users u ON l.user_id = u.user_id
    ORDER BY l.created_at DESC
    LIMIT 6;
  `;

  // 7. Recent Notifications Query (limit 5)
  const notificationsQuery = `
    SELECT 
      notification_id as id,
      title,
      message,
      type,
      is_read as read,
      created_at as time
    FROM notifications
    WHERE user_id = $1 OR user_id IS NULL
    ORDER BY created_at DESC
    LIMIT 5;
  `;

  // Execute all queries in parallel
  const [
    kpiResult,
    activeBookingsResult,
    upcomingReturnsResult,
    categoryResult,
    statusResult,
    maintenanceResult,
    deptAssetsResult,
    activitiesResult,
    notificationsResult
  ] = await Promise.all([
    query(kpiQuery),
    query(activeBookingsQuery),
    query(upcomingReturnsQuery),
    query(categoryQuery),
    query(statusQuery),
    query(maintenanceQuery),
    query(deptAssetsQuery),
    query(activitiesQuery),
    query(notificationsQuery, [userId || null])
  ]);

  const kpis = kpiResult.rows[0] || { available: 0, allocated: 0, maintenance: 0 };
  const activeBookings = activeBookingsResult.rows[0] ? parseInt(activeBookingsResult.rows[0].count, 10) : 0;
  const upcomingReturns = upcomingReturnsResult.rows[0] ? parseInt(upcomingReturnsResult.rows[0].count, 10) : 0;

  // Map category colors
  const categoryColors = ['#4F46E5', '#818CF8', '#10B981', '#F59E0B', '#DC2626', '#6366F1', '#3B82F6', '#EC4899'];
  const assetsByCategoryMapped = categoryResult.rows.map((row, idx) => ({
    name: row.name,
    value: row.value,
    fill: categoryColors[idx % categoryColors.length]
  }));

  // Map status colors
  const statusColorMap = {
    'AVAILABLE': '#10B981',
    'ALLOCATED': '#4F46E5',
    'RESERVED': '#818CF8',
    'UNDER_MAINTENANCE': '#F59E0B',
    'LOST': '#EF4444',
    'RETIRED': '#6B7280',
    'DISPOSED': '#DC2626'
  };
  const assetsByStatusMapped = statusResult.rows.map(row => ({
    name: row.name.charAt(0) + row.name.slice(1).toLowerCase().replace('_', ' '),
    value: row.value,
    fill: statusColorMap[row.name] || '#6B7280'
  }));

  // Build a default maintenance trend if empty
  const maintenanceOverviewData = maintenanceResult.rows.length > 0 
    ? maintenanceResult.rows 
    : [
        { month: 'Jan', pending: 0, inProgress: 0, resolved: 0 },
        { month: 'Feb', pending: 0, inProgress: 0, resolved: 0 },
        { month: 'Mar', pending: 0, inProgress: 0, resolved: 0 }
      ];

  return {
    kpis: {
      available: kpis.available || 0,
      allocated: kpis.allocated || 0,
      maintenance: kpis.maintenance || 0,
      activeBookings,
      upcomingReturns
    },
    assetsByCategory: assetsByCategoryMapped,
    assetsByStatus: assetsByStatusMapped,
    maintenanceOverview: maintenanceOverviewData,
    departmentAssets: deptAssetsResult.rows,
    recentActivities: activitiesResult.rows.map(row => ({
      ...row,
      description: `${row.action} performed on ${row.type}`
    })),
    recentNotifications: notificationsResult.rows.map(row => ({
      ...row,
      read: row.read || false
    }))
  };
};
