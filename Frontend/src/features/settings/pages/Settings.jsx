import { useState } from 'react';
import { User, Palette, Bell, Settings as SettingsIcon, Shield } from 'lucide-react';
import { CURRENT_USER } from '../../../constants';
import Breadcrumb from '../../../components/ui/Breadcrumb';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Avatar from '../../../components/ui/Avatar';
import toast from 'react-hot-toast';

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'theme', label: 'Theme', icon: Palette },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'preferences', label: 'Preferences', icon: SettingsIcon },
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');
  const userStr = sessionStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : CURRENT_USER;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text">Settings</h1>
        <Breadcrumb items={[{ label: 'Settings' }]} />
      </div>

      <div className="flex flex-col lg:flex-row gap-5">
        {/* Sidebar Tabs */}
        <div className="w-full lg:w-1/4 lg:max-w-[14rem] flex-shrink-0">
          <Card hover={false} padding="p-2">
            <nav className="space-y-0.5">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-150
                      ${activeTab === tab.id
                        ? 'bg-primary text-white font-semibold'
                        : 'text-muted hover:text-text hover:bg-background'
                      }`}
                  >
                    <Icon className="w-5 h-5 flex-none" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </Card>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div key={activeTab}>
            {activeTab === 'profile' && <ProfileSettings user={user} />}
            {activeTab === 'theme' && <ThemeSettings />}
            {activeTab === 'notifications' && <NotificationSettings />}
            {activeTab === 'preferences' && <PreferenceSettings />}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileSettings({ user }) {
  return (
    <Card hover={false}>
      <h3 className="text-base font-semibold text-text mb-6">Profile Settings</h3>
      <div className="flex items-center gap-5 mb-6 pb-6 border-b border-gray-100">
        <Avatar name={user.name} size="xl" />
        <div>
          <h4 className="font-semibold text-name-text">{user.name}</h4>
          <p className="text-sm text-muted">{user.role}</p>
          <button className="text-sm text-primary font-medium mt-2 hover:text-primary-dark transition-colors">
            Change avatar
          </button>
        </div>
      </div>
      <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); toast.success('Profile updated'); }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Full Name" defaultValue={user.name} />
          <Input label="Email" type="email" defaultValue={user.email} />
          <Input label="Phone" placeholder="+1 (555) 000-0000" />
          <Input label="Role" defaultValue={user.role} disabled />
        </div>
        <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
          <Shield className="w-6 h-6 text-muted flex-none" />
          <div>
            <p className="text-sm font-medium text-text">Password</p>
            <p className="text-xs text-muted">Last changed 30 days ago</p>
          </div>
          <button type="button" className="ml-auto text-sm text-primary font-medium hover:text-primary-dark transition-colors">
            Change password
          </button>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="ghost">Cancel</Button>
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </Card>
  );
}

function ThemeSettings() {
  const [selectedTheme, setSelectedTheme] = useState('light');
  const themes = [
    { id: 'light', label: 'Light', preview: 'bg-white border-gray-100' },
    { id: 'dark', label: 'Dark', preview: 'bg-gray-900 border-gray-700' },
    { id: 'system', label: 'System', preview: 'bg-gradient-to-r from-white to-gray-900 border-gray-300' },
  ];

  return (
    <Card hover={false}>
      <h3 className="text-base font-semibold text-text mb-6">Theme Settings</h3>
      <div className="grid grid-cols-3 gap-4 mb-6">
        {themes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => { setSelectedTheme(theme.id); toast.success(`${theme.label} theme selected`); }}
            className={`p-4 rounded-2xl border-2 transition-all duration-150 ${
              selectedTheme === theme.id ? 'border-primary' : 'border-transparent bg-background'
            }`}
          >
            <div className={`w-full h-16 rounded-xl ${theme.preview} border mb-3`} />
            <p className="text-sm font-medium text-text">{theme.label}</p>
          </button>
        ))}
      </div>
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-text">Accent Color</h4>
        <div className="flex gap-3">
          {['#6366f1', '#059669', '#dc2626', '#d97706', '#7c3aed', '#0891b2'].map((color) => (
            <button
              key={color}
              className="w-9 h-9 rounded-full ring-2 ring-offset-2 ring-transparent hover:ring-gray-200 transition-all"
              style={{ backgroundColor: color }}
              onClick={() => toast.success('Accent color updated')}
            />
          ))}
        </div>
      </div>
    </Card>
  );
}

function NotificationSettings() {
  const notifSettings = [
    { label: 'Email Notifications', description: 'Receive email for important updates', default: true },
    { label: 'Asset Alerts', description: 'Notify when assets are allocated or returned', default: true },
    { label: 'Maintenance Updates', description: 'Get notified about maintenance status changes', default: true },
    { label: 'Booking Confirmations', description: 'Receive booking confirmation notifications', default: false },
    { label: 'System Updates', description: 'Be notified about system updates and changes', default: false },
    { label: 'Weekly Reports', description: 'Receive weekly summary reports via email', default: true },
  ];

  return (
    <Card hover={false}>
      <h3 className="text-base font-semibold text-text mb-6">Notification Preferences</h3>
      <div className="space-y-1">
        {notifSettings.map((setting, i) => (
          <div key={i} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
            <div>
              <p className="text-sm font-medium text-text">{setting.label}</p>
              <p className="text-xs text-muted">{setting.description}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer ml-4">
              <input type="checkbox" defaultChecked={setting.default} className="sr-only peer" />
              <div className="w-9 h-5 bg-gray-200 peer-focus:ring-2 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary" />
            </label>
          </div>
        ))}
      </div>
      <div className="flex justify-end pt-4">
        <Button onClick={() => toast.success('Notification settings saved')}>Save Preferences</Button>
      </div>
    </Card>
  );
}

function PreferenceSettings() {
  return (
    <Card hover={false}>
      <h3 className="text-base font-semibold text-text mb-6">Application Preferences</h3>
      <div className="space-y-6">
        <div>
          <h4 className="text-sm font-semibold text-text mb-3">Language & Region</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Language" defaultValue="English" />
            <Input label="Timezone" defaultValue="UTC+05:30 (IST)" />
            <Input label="Date Format" defaultValue="DD/MM/YYYY" />
            <Input label="Currency" defaultValue="USD ($)" />
          </div>
        </div>
        <div className="border-t border-gray-100 pt-6">
          <h4 className="text-sm font-semibold text-text mb-3">Display</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Items per page" type="number" defaultValue="10" />
            <Input label="Default Dashboard View" defaultValue="Overview" />
          </div>
        </div>
        <div className="border-t border-gray-100 pt-6">
          <h4 className="text-sm font-semibold text-danger mb-3">Danger Zone</h4>
          <div className="flex items-center justify-between p-4 rounded-2xl bg-red-50">
            <div>
              <p className="text-sm font-medium text-text">Delete Account</p>
              <p className="text-xs text-muted">Permanently delete your account and all data</p>
            </div>
            <Button variant="danger" size="sm" onClick={() => toast.error('This action is irreversible!')}>
              Delete Account
            </Button>
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-6">
        <Button variant="ghost">Reset to Default</Button>
        <Button onClick={() => toast.success('Preferences saved')}>Save Preferences</Button>
      </div>
    </Card>
  );
}
