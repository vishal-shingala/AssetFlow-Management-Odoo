import { useState, useRef, useEffect } from 'react';
import {
  HiOutlineBell,
  HiOutlineMagnifyingGlass,
  HiOutlineSun,
  HiOutlineMoon,
} from 'react-icons/hi2';
import { useApp } from '../../context/AppContext';
import { CURRENT_USER } from '../../constants';
import { notifications as notificationData } from '../../features/notifications/data/notifications';
import Avatar from '../ui/Avatar';
import NotificationCard from '../ui/NotificationCard';

export default function Navbar() {
  const { darkMode, toggleDarkMode, searchQuery, setSearchQuery } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef(null);
  const unreadCount = notificationData.filter((n) => !n.read).length;

  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-16 bg-surface border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-30">
      {/* Search */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <div className="relative w-full">
          <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search assets, employees, bookings..."
            className="w-full pl-10 pr-4 py-2 text-sm rounded-lg bg-gray-50 border border-transparent
              placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/20
              focus:border-primary focus:bg-white transition-all duration-200"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-lg hover:bg-gray-100 text-muted hover:text-text transition-colors"
          title={darkMode ? 'Light Mode' : 'Dark Mode'}
        >
          {darkMode ? (
            <HiOutlineSun className="w-5 h-5" />
          ) : (
            <HiOutlineMoon className="w-5 h-5" />
          )}
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg hover:bg-gray-100 text-muted hover:text-text transition-colors"
          >
            <HiOutlineBell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-danger text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-gray-100">
                <h3 className="text-sm font-semibold text-text">Notifications</h3>
                <p className="text-xs text-muted">{unreadCount} unread</p>
              </div>
              <div className="max-h-[400px] overflow-y-auto p-3 space-y-2">
                {notificationData.slice(0, 5).map((notif) => (
                  <NotificationCard key={notif.id} {...notif} />
                ))}
              </div>
              <div className="px-4 py-3 border-t border-gray-100 text-center">
                <button className="text-xs font-medium text-primary hover:text-indigo-700 transition-colors">
                  View All Notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-8 bg-gray-200" />

        {/* Profile */}
        <div className="flex items-center gap-3">
          <Avatar name={CURRENT_USER.name} size="sm" />
          <div className="hidden md:block">
            <p className="text-sm font-medium text-text leading-tight">{CURRENT_USER.name}</p>
            <span className="inline-block px-1.5 py-0.5 text-[10px] font-medium bg-primary/10 text-primary rounded">
              {CURRENT_USER.role}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
