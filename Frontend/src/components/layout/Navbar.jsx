import { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Bell } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CURRENT_USER } from '../../constants';
import { notifications as notificationData } from '../../features/notifications/data/notifications';
import Avatar from '../ui/Avatar';
import NotificationCard from '../ui/NotificationCard';

export default function Navbar() {
  const { darkMode, toggleDarkMode } = useApp();
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
    <header className="h-16 bg-background-surface border-b border-gray-100 flex items-center justify-end px-4 sticky top-0 z-30">
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={toggleDarkMode}
          title={darkMode ? 'Switch to Light' : 'Switch to Dark'}
          className="flex-shrink-0 p-2.5 flex items-center justify-center rounded-xl bg-background hover:bg-gray-200 text-gray-600 hover:text-text transition-colors"
        >
          {darkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
        </button>

        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notifications"
            className="relative flex-shrink-0 p-2.5 flex items-center justify-center rounded-xl bg-background hover:bg-gray-200 text-gray-600 hover:text-text transition-colors"
          >
            <Bell className="w-6 h-6" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-6 h-6 bg-danger text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] max-w-xs sm:max-w-sm bg-background-surface rounded-2xl shadow-dropdown overflow-hidden z-50">
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

        <div className="w-px h-8 bg-gray-200 mx-1" />

        <div className="flex items-center gap-3 cursor-pointer pl-3 pr-1 py-1 rounded-xl hover:bg-background transition-colors">
          <div className="leading-tight text-right flex flex-col items-end gap-1">
            <p className="text-sm font-semibold text-name-text whitespace-nowrap">{CURRENT_USER.name}</p>
            <span className="text-[10px] font-bold tracking-wider text-tag-text bg-tag-bg px-2 py-0.5 rounded-full uppercase shadow-sm">
              {CURRENT_USER.role}
            </span>
          </div>
          <Avatar 
            name={CURRENT_USER.name} 
            size="md"
            className="ring-2 ring-primary/20 shadow-sm" 
          />
        </div>
      </div>
    </header>
  );
}
