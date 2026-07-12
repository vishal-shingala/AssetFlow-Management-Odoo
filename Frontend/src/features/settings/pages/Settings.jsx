import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  HiOutlineUser, HiOutlinePaintBrush, HiOutlineBell,
  HiOutlineCog6Tooth, HiOutlineShieldCheck,
} from 'react-icons/hi2';
import { CURRENT_USER } from '../../../constants';
import Breadcrumb from '../../../components/ui/Breadcrumb';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Avatar from '../../../components/ui/Avatar';
import toast from 'react-hot-toast';

const tabs = [
  { id: 'profile', label: 'Profile', icon: HiOutlineUser },
  { id: 'theme', label: 'Theme', icon: HiOutlinePaintBrush },
  { id: 'notifications', label: 'Notifications', icon: HiOutlineBell },
  { id: 'preferences', label: 'Preferences', icon: HiOutlineCog6Tooth },
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text">Settings</h1>
        <Breadcrumb items={[{ label: 'Settings' }]} />
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:w-64 flex-shrink-0">
          <Card hover={false} padding="p-2">
            <nav className="space-y-0.5">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all
                      ${activeTab === tab.id
                        ? 'bg-primary text-white shadow-sm'
                        : 'text-muted hover:text-text hover:bg-gray-50'
                      }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </Card>
        </div>

        {/* Content */}
        <div className="flex-1">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'profile' && <ProfileSettings />}
            {activeTab === 'theme' && <ThemeSettings />}
            {activeTab === 'notifications' && <NotificationSettings />}
            {activeTab === 'preferences' && <PreferenceSettings />}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function ProfileSettings() {
  return (
    <Card hover={false}>
      <h3 className="text-lg font-semibold text-text mb-6">Profile Settings</h3>
      <div className="flex items-center gap-6 mb-8 pb-6 border-b border-gray-100">
        <Avatar name={CURRENT_USER.name} size="xl" />
        <div>
          <h4 className="font-semibold text-text">{CURRENT_USER.name}</h4>
          <p className="text-sm text-muted">{CURRENT_USER.role}</p>
          <button className="text-sm text-primary font-medium mt-2 hover:text-indigo-700 transition-colors">
            Change avatar
          </button>
        </div>
      </div>
      <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); toast.success('Profile updated'); }}>
        <div className="grid grid-cols-2 gap-4">
          <Input label="Full Name" defaultValue={CURRENT_USER.name} />
          <Input label="Email" type="email" defaultValue={CURRENT_USER.email} />
          <Input label="Phone" placeholder="+1 (555) 000-0000" />
          <Input label="Role" defaultValue={CURRENT_USER.role} disabled />
        </div>
        <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
          <HiOutlineShieldCheck className="w-5 h-5 text-muted" />
          <div>
            <p className="text-sm font-medium text-text">Password</p>
            <p className="text-xs text-muted">Last changed 30 days ago</p>
          </div>
          <button type="button" className="ml-auto text-sm text-primary font-medium hover:text-indigo-700 transition-colors">
            Change password
          </button>
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline">Cancel</Button>
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </Card>
  );
}

function ThemeSettings() {
  const [selectedTheme, setSelectedTheme] = useState('light');
  const themes = [
    { id: 'light', label: 'Light', preview: 'bg-white border-gray-200' },
    { id: 'dark', label: 'Dark', preview: 'bg-gray-900 border-gray-700' },
    { id: 'system', label: 'System', preview: 'bg-gradient-to-r from-white to-gray-900 border-gray-300' },
  ];

  return (
    <Card hover={false}>
      <h3 className="text-lg font-semibold text-text mb-6">Theme Settings</h3>
      <div className="grid grid-cols-3 gap-4 mb-6">
        {themes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => { setSelectedTheme(theme.id); toast.success(`${theme.label} theme selected`); }}
            className={`p-4 rounded-xl border-2 transition-all ${
              selectedTheme === theme.id ? 'border-primary ring-4 ring-primary/10' : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className={`w-full h-20 rounded-lg ${theme.preview} border mb-3`} />
            <p className="text-sm font-medium text-text">{theme.label}</p>
          </button>
        ))}
      </div>
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-text">Accent Color</h4>
        <div className="flex gap-3">
          {['#4F46E5', '#059669', '#DC2626', '#D97706', '#7C3AED', '#0891B2'].map((color) => (
            <button
              key={color}
              className="w-10 h-10 rounded-full ring-2 ring-offset-2 ring-transparent hover:ring-gray-300 transition-all"
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
      <h3 className="text-lg font-semibold text-text mb-6">Notification Preferences</h3>
      <div className="space-y-4">
        {notifSettings.map((setting, i) => (
          <div key={i} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
            <div>
              <p className="text-sm font-medium text-text">{setting.label}</p>
              <p className="text-xs text-muted">{setting.description}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked={setting.default} className="sr-only peer" />
              <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary" />
            </label>
          </div>
        ))}
      </div>
      <div className="flex justify-end gap-3 pt-4">
        <Button onClick={() => toast.success('Notification settings saved')}>Save Preferences</Button>
      </div>
    </Card>
  );
}

function PreferenceSettings() {
  return (
    <Card hover={false}>
      <h3 className="text-lg font-semibold text-text mb-6">Application Preferences</h3>
      <div className="space-y-6">
        <div>
          <h4 className="text-sm font-semibold text-text mb-3">Language & Region</h4>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Language" defaultValue="English" />
            <Input label="Timezone" defaultValue="UTC+05:30 (IST)" />
            <Input label="Date Format" defaultValue="DD/MM/YYYY" />
            <Input label="Currency" defaultValue="USD ($)" />
          </div>
        </div>
        <div className="border-t border-gray-100 pt-6">
          <h4 className="text-sm font-semibold text-text mb-3">Display</h4>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Items per page" type="number" defaultValue="10" />
            <Input label="Default Dashboard View" defaultValue="Overview" />
          </div>
        </div>
        <div className="border-t border-gray-100 pt-6">
          <h4 className="text-sm font-semibold text-danger mb-3">Danger Zone</h4>
          <div className="flex items-center justify-between p-4 border border-red-200 rounded-xl bg-red-50/50">
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
        <Button variant="outline">Reset to Default</Button>
        <Button onClick={() => toast.success('Preferences saved')}>Save Preferences</Button>
      </div>
    </Card>
  );
}
