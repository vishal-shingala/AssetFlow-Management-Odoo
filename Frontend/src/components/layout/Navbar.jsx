import { useState, useRef, useEffect } from 'react';
import { Search, Sun, Moon, Bell } from 'lucide-react';
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
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-30">

      {/* Search bar */}
      <div className="relative flex-1 max-w-sm min-w-[120px] mr-4">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gray-400 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search assets, employees, bookings..."
          className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-background border-0
            text-text placeholder:text-gray-400
            focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white
            transition-all duration-200"
        />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2 flex-shrink-0">

        {/* Dark / Light mode toggle */}
        <button
          onClick={toggleDarkMode}
          title={darkMode ? 'Switch to Light' : 'Switch to Dark'}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-background hover:bg-gray-200 text-gray-600 hover:text-text transition-colors"
        >
          {darkMode
            ? <Sun className="w-[22px] h-[22px]" />
            : <Moon className="w-[22px] h-[22px]" />
          }
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notifications"
            className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-background hover:bg-gray-200 text-gray-600 hover:text-text transition-colors"
          >
            <Bell className="w-[22px] h-[22px]" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-danger text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 border-2 border-white">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-dropdown overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-text">Notifications</h3>
                <span className="bg-primary/10 text-primary text-xs font-semibold px-2 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              </div>
              <div className="max-h-80 overflow-y-auto p-2 space-y-1">
                {notificationData.slice(0, 5).map((notif) => (
                  <NotificationCard key={notif.id} {...notif} />
                ))}
              </div>
              <div className="px-4 py-3 border-t border-gray-100 text-center">
                <button className="text-xs font-semibold text-primary hover:text-primary-dark transition-colors">
                  View All Notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-8 bg-gray-200 mx-1" />

        {/* User profile */}
        <div className="flex items-center gap-2.5 cursor-pointer pl-1 pr-2 py-1 rounded-xl hover:bg-background transition-colors">
          <div className="w-11 h-11 rounded-full overflow-hidden ring-2 ring-primary/15 flex-shrink-0 shadow-sm">
            <Avatar name={CURRENT_USER.name} size="lg" className="!w-11 !h-11 !text-sm" />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-text whitespace-nowrap">{CURRENT_USER.name}</p>
            <p className="text-xs text-primary font-medium whitespace-nowrap">{CURRENT_USER.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
