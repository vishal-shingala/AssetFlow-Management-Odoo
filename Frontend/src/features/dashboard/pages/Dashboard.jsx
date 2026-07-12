import React, { useState, useEffect } from 'react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, AreaChart, Area,
} from 'recharts';
import { ArrowUpRight, ArrowDownRight, Box, Users, Wrench, Calendar, CornerDownLeft } from 'lucide-react';
import Card from '../../../components/ui/Card';
import NotificationCard from '../../../components/ui/NotificationCard';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import { dashboardService } from '../api/dashboardService';

const colorMap = {
  primary: 'bg-primary/10 text-primary',
  secondary: 'bg-secondary/10 text-secondary',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  danger: 'bg-danger/10 text-danger',
};

const activityIcons = {
  allocation: '🔗',
  maintenance: '🔧',
  return: '↩️',
  booking: '📅',
  addition: '➕',
  resolved: '✅',
};

const tooltipStyle = {
  borderRadius: '10px',
  border: 'none',
  boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
  fontSize: '13px',
  padding: '10px 14px',
};

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const stats = await dashboardService.getStats();
        setData(stats);
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center p-5 max-w-md bg-danger/5 rounded-xl border border-danger/15">
          <p className="text-danger font-semibold text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const kpisList = [
    {
      id: 1,
      title: 'Assets Available',
      value: data.kpis.available,
      change: '+12.5%',
      changeType: 'positive',
      icon: Box,
      color: 'primary',
    },
    {
      id: 2,
      title: 'Assets Allocated',
      value: data.kpis.allocated,
      change: '+8.2%',
      changeType: 'positive',
      icon: Users,
      color: 'secondary',
    },
    {
      id: 3,
      title: 'Under Maintenance',
      value: data.kpis.maintenance,
      change: '-3.1%',
      changeType: 'negative',
      icon: Wrench,
      color: 'warning',
    },
    {
      id: 4,
      title: 'Active Bookings',
      value: data.kpis.activeBookings,
      change: '+15.3%',
      changeType: 'positive',
      icon: Calendar,
      color: 'success',
    },
    {
      id: 5,
      title: 'Upcoming Returns',
      value: data.kpis.upcomingReturns,
      change: '+5.7%',
      changeType: 'positive',
      icon: CornerDownLeft,
      color: 'danger',
    },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-text">Dashboard</h1>
        </div>
      </div>

      {/* KPI Cards — rectangular style, responsive 2→3→5 cols */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {kpisList.map((kpi) => (
          <Card key={kpi.id} rounded="lg" padding="p-4" className="relative overflow-hidden">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold text-muted uppercase tracking-widest leading-none">
                  {kpi.title}
                </p>
                <p className="text-[22px] font-bold text-text mt-2 leading-none">
                  {kpi.value.toLocaleString()}
                </p>
                <div className="flex items-center gap-1 mt-2 flex-wrap">
                  {kpi.changeType === 'positive' ? (
                    <ArrowUpRight className="w-4 h-4 text-success flex-none" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-danger flex-none" />
                  )}
                  <span className={`text-[11px] font-semibold ${kpi.changeType === 'positive' ? 'text-success' : 'text-danger'}`}>
                    {kpi.change}
                  </span>
                  <span className="text-[11px] text-muted">vs last month</span>
                </div>
              </div>
              <div className={`p-2.5 rounded-xl flex-none flex items-center justify-center ${colorMap[kpi.color]}`}>
                <kpi.icon className="w-7 h-7" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card rounded="xl" padding="p-5" hover={false}>
          <div className="mb-3">
            <h3 className="text-sm font-semibold text-text">Assets by Category</h3>
            <p className="text-xs text-muted mt-0.5">Distribution across categories</p>
          </div>
          {data.assetsByCategory.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={data.assetsByCategory} cx="50%" cy="50%" innerRadius={65} outerRadius={105} paddingAngle={3} dataKey="value">
                  {data.assetsByCategory.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[260px] text-muted text-sm">
              No asset categories data available
            </div>
          )}
        </Card>

        <Card rounded="xl" padding="p-5" hover={false}>
          <div className="mb-3">
            <h3 className="text-sm font-semibold text-text">Assets by Status</h3>
            <p className="text-xs text-muted mt-0.5">Current asset status overview</p>
          </div>
          {data.assetsByStatus.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={data.assetsByStatus} cx="50%" cy="50%" innerRadius={65} outerRadius={105} paddingAngle={3} dataKey="value">
                  {data.assetsByStatus.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[260px] text-muted text-sm">
              No asset status data available
            </div>
          )}
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card rounded="xl" padding="p-5" hover={false}>
          <div className="mb-3">
            <h3 className="text-sm font-semibold text-text">Maintenance Overview</h3>
            <p className="text-xs text-muted mt-0.5">Monthly maintenance trends</p>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={data.maintenanceOverview}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" fontSize={11} tickLine={false} axisLine={false} stroke="#94a3b8" />
              <YAxis fontSize={11} tickLine={false} axisLine={false} stroke="#94a3b8" />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px' }} />
              <Area type="monotone" dataKey="resolved" stackId="1" stroke="#10B981" fill="#10B98115" strokeWidth={2} />
              <Area type="monotone" dataKey="inProgress" stackId="1" stroke="#F59E0B" fill="#F59E0B15" strokeWidth={2} />
              <Area type="monotone" dataKey="pending" stackId="1" stroke="#EF4444" fill="#EF444415" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card rounded="xl" padding="p-5" hover={false}>
          <div className="mb-3">
            <h3 className="text-sm font-semibold text-text">Department Asset Distribution</h3>
            <p className="text-xs text-muted mt-0.5">Assets per department</p>
          </div>
          {data.departmentAssets.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={data.departmentAssets} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" fontSize={11} tickLine={false} axisLine={false} stroke="#94a3b8" />
                <YAxis dataKey="department" type="category" fontSize={11} tickLine={false} axisLine={false} stroke="#94a3b8" width={80} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="assets" fill="#6366f1" radius={[0, 5, 5, 0]} barSize={14} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[260px] text-muted text-sm">
              No department allocation data available
            </div>
          )}
        </Card>
      </div>

      {/* Recent Activities & Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card rounded="xl" padding="p-5" hover={false}>
          <h3 className="text-sm font-semibold text-text mb-3">Recent Activities</h3>
          <div className="space-y-0.5">
            {data.recentActivities.length > 0 ? (
              data.recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-background transition-colors">
                  <span className="text-base mt-0.5">{activityIcons[activity.type] || '📝'}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text">{activity.action}</p>
                    <p className="text-xs text-muted mt-0.5 truncate">{activity.description}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-[11px] text-muted">{activity.user}</span>
                      <span className="text-[11px] text-gray-300">•</span>
                      <span className="text-[11px] text-muted">
                        {new Date(activity.time).toLocaleDateString()} {new Date(activity.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-[180px] text-muted text-sm">
                No recent activities
              </div>
            )}
          </div>
        </Card>

        <Card rounded="xl" padding="p-5" hover={false}>
          <h3 className="text-sm font-semibold text-text mb-3">Recent Notifications</h3>
          <div className="space-y-0.5">
            {data.recentNotifications.length > 0 ? (
              data.recentNotifications.slice(0, 5).map((notif) => (
                <NotificationCard key={notif.id} {...notif} />
              ))
            ) : (
              <div className="flex items-center justify-center h-[180px] text-muted text-sm">
                No recent notifications
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
