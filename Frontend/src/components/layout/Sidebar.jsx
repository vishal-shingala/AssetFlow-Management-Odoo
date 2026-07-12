import { NavLink, useNavigate } from 'react-router-dom';
import { Box, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NAV_ITEMS, APP_NAME } from '../../constants';

export default function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useApp();
  const navigate = useNavigate();

  return (
    <aside
      style={{ backgroundColor: '#1e2139' }}
      className={`fixed left-0 top-0 h-screen flex flex-col z-40 transition-all duration-300 ease-in-out ${
        sidebarCollapsed ? 'w-[72px]' : 'w-[240px]'
      }`}
    >
     {/* Logo */}
<div className="h-16 flex items-center justify-start flex-none">
  <div className="flex items-center gap-2 w-full">
    <div className="w-9 h-9 flex-shrink-0 rounded-xl bg-primary flex items-center justify-center shadow-glow-primary">
      <Box className="w-5 h-5 text-white" />
    </div>
    {!sidebarCollapsed && (
      <span className="text-xl font-bold tracking-tight text-white leading-none">
        {APP_NAME}
      </span>
    )}
  </div>
</div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto overflow-x-hidden">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            end={item.path === '/'}
            title={sidebarCollapsed ? item.label : undefined}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors duration-150 group ${
                isActive
                  ? 'bg-primary text-white font-semibold'
                  : 'text-slate-400 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  className={`w-[18px] h-[18px] flex-shrink-0 ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'
                  }`}
                />
                {!sidebarCollapsed && (
                  <span className="text-sm whitespace-nowrap">
                    {item.label}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-4 flex-none space-y-1 border-t border-white/5 pt-3">
        <button
          onClick={() => navigate('/login')}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:bg-white/10 hover:text-white transition-colors duration-150"
          title={sidebarCollapsed ? 'Logout' : undefined}
        >
          <LogOut className="w-[18px] h-[18px] flex-shrink-0" />
          {!sidebarCollapsed && (
            <span className="text-sm whitespace-nowrap">Logout</span>
          )}
        </button>

        <button
          onClick={toggleSidebar}
          className="w-full flex items-center justify-center py-2 rounded-xl text-slate-500 hover:bg-white/10 hover:text-slate-300 transition-colors duration-150"
        >
          {sidebarCollapsed
            ? <ChevronRight className="w-4 h-4" />
            : <ChevronLeft className="w-4 h-4" />
          }
        </button>
      </div>
    </aside>
  );
}
