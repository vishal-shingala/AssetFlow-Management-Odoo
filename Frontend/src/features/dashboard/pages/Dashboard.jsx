

import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, AreaChart, Area,
} from 'recharts';
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

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
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

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {kpiCards.map((kpi, index) => {
          return (
            <div
              key={kpi.id}
              className="fadeinup animation-duration-500"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <Card className="relative overflow-hidden">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted uppercase tracking-wide">{kpi.title}</p>
                    <p className="text-2xl font-bold text-text mt-1">{kpi.value.toLocaleString()}</p>
                    <div className="flex items-center gap-1 mt-2">
                      {kpi.changeType === 'positive' ? (
                        <i className="pi pi-arrow-up-right w-3.5 h-3.5 text-success"></i>
                      ) : (
                        <i className="pi pi-arrow-down-right w-3.5 h-3.5 text-danger"></i>
                      )}
                      <span className={`text-xs font-medium ${kpi.changeType === 'positive' ? 'text-success' : 'text-danger'}`}>
                        {kpi.change}
                      </span>
                      <span className="text-xs text-muted">vs last month</span>
                    </div>
                  </div>
                  <div className={`p-2.5 rounded-xl ${colorMap[kpi.color]}`}>
                    <i className={`pi ${kpi.icon} w-5 h-5`}></i>
                  </div>
                </div>
              </Card>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Assets by Category" subtitle="Distribution across categories">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={assetsByCategory}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={110}
                paddingAngle={3}
                dataKey="value"
              >
                {assetsByCategory.map((entry, index) => (
                  <Cell key={index} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  fontSize: '13px',
                }}
              />
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Assets by Status" subtitle="Current asset status overview">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={assetsByStatus}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={110}
                paddingAngle={3}
                dataKey="value"
              >
                {assetsByStatus.map((entry, index) => (
                  <Cell key={index} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  fontSize: '13px',
                }}
              />
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Second Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Maintenance Overview" subtitle="Monthly maintenance trends">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={maintenanceOverview}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" fontSize={12} stroke="#6B7280" />
              <YAxis fontSize={12} stroke="#6B7280" />
              <Tooltip
                contentStyle={{
                  borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  fontSize: '13px',
                }}
              />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px' }} />
              <Area type="monotone" dataKey="resolved" stackId="1" stroke="#10B981" fill="#10B98120" />
              <Area type="monotone" dataKey="inProgress" stackId="1" stroke="#F59E0B" fill="#F59E0B20" />
              <Area type="monotone" dataKey="pending" stackId="1" stroke="#DC2626" fill="#DC262620" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Department Asset Distribution" subtitle="Assets per department">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={departmentAssets} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis type="number" fontSize={12} stroke="#6B7280" />
              <YAxis dataKey="department" type="category" fontSize={11} stroke="#6B7280" width={80} />
              <Tooltip
                contentStyle={{
                  borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  fontSize: '13px',
                }}
              />
              <Bar dataKey="assets" fill="#4F46E5" radius={[0, 6, 6, 0]} barSize={18} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Recent Activities & Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card hover={false}>
          <h3 className="text-sm font-semibold text-text mb-4">Recent Activities</h3>
          <div className="space-y-3">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                <span className="text-lg mt-0.5">{activityIcons[activity.type]}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text">{activity.action}</p>
                  <p className="text-xs text-muted mt-0.5">{activity.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-muted">{activity.user}</span>
                    <span className="text-[10px] text-gray-300">•</span>
                    <span className="text-[10px] text-muted">{activity.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card hover={false}>
          <h3 className="text-sm font-semibold text-text mb-4">Recent Notifications</h3>
          <div className="space-y-2">
            {recentNotifications.slice(0, 5).map((notif) => (
              <NotificationCard key={notif.id} {...notif} />
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
