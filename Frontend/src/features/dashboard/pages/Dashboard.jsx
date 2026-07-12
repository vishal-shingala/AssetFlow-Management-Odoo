import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, AreaChart, Area,
} from 'recharts';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import {
  kpiCards, assetsByCategory, assetsByStatus,
  maintenanceOverview, departmentAssets,
  recentActivities, recentNotifications,
} from '../data/dashboard';
import Card from '../../../components/ui/Card';
import ChartCard from '../../../components/ui/ChartCard';
import NotificationCard from '../../../components/ui/NotificationCard';
import Breadcrumb from '../../../components/ui/Breadcrumb';

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
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-text">Dashboard</h1>
          <Breadcrumb items={[{ label: 'Dashboard' }]} />
        </div>
        <p className="text-sm text-muted">
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
          })}
        </p>
      </div>

      {/* KPI Cards — rectangular style, responsive 2→3→5 cols */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {kpiCards.map((kpi) => (
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
              <div className={`p-2 rounded-lg flex-none ${colorMap[kpi.color]}`}>
                <kpi.icon className="w-5 h-5" />
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
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={assetsByCategory} cx="50%" cy="50%" innerRadius={65} outerRadius={105} paddingAngle={3} dataKey="value">
                {assetsByCategory.map((entry, index) => (
                  <Cell key={index} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card rounded="xl" padding="p-5" hover={false}>
          <div className="mb-3">
            <h3 className="text-sm font-semibold text-text">Assets by Status</h3>
            <p className="text-xs text-muted mt-0.5">Current asset status overview</p>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={assetsByStatus} cx="50%" cy="50%" innerRadius={65} outerRadius={105} paddingAngle={3} dataKey="value">
                {assetsByStatus.map((entry, index) => (
                  <Cell key={index} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
            </PieChart>
          </ResponsiveContainer>
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
            <AreaChart data={maintenanceOverview}>
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
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={departmentAssets} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" fontSize={11} tickLine={false} axisLine={false} stroke="#94a3b8" />
              <YAxis dataKey="department" type="category" fontSize={11} tickLine={false} axisLine={false} stroke="#94a3b8" width={80} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="assets" fill="#6366f1" radius={[0, 5, 5, 0]} barSize={14} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Recent Activities & Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card rounded="xl" padding="p-5" hover={false}>
          <h3 className="text-sm font-semibold text-text mb-3">Recent Activities</h3>
          <div className="space-y-0.5">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-background transition-colors">
                <span className="text-base mt-0.5">{activityIcons[activity.type]}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text">{activity.action}</p>
                  <p className="text-xs text-muted mt-0.5 truncate">{activity.description}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-[11px] text-muted">{activity.user}</span>
                    <span className="text-[11px] text-gray-300">•</span>
                    <span className="text-[11px] text-muted">{activity.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card rounded="xl" padding="p-5" hover={false}>
          <h3 className="text-sm font-semibold text-text mb-3">Recent Notifications</h3>
          <div className="space-y-0.5">
            {recentNotifications.slice(0, 5).map((notif) => (
              <NotificationCard key={notif.id} {...notif} />
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
