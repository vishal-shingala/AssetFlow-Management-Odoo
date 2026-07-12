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
