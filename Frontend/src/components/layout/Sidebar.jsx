import { NavLink, useNavigate } from 'react-router-dom';
import { Box, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NAV_ITEMS, APP_NAME } from '../../constants';

export default function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <aside
      className={`bg-sidebar-bg fixed left-0 top-0 h-screen flex flex-col z-40 transition-all duration-300 ease-in-out ${
        sidebarCollapsed ? 'w-20' : 'w-64'
      }`}
    >
     {/* Logo */}
    {/* <div className="h-16 flex items-center justify-start flex-none">
      <div className="flex items-center gap-1.5 w-full">
        <div className="ml-3 w-7 h-10 flex-shrink-0 rounded-xl bg-primary flex items-center justify-center shadow-glow-primary">
          <Box className="w-5 h-5 text-white" />
        </div>
        {!sidebarCollapsed && (
          <span className="text-xl font-bold tracking-tight text-white leading-none">
            {APP_NAME}
          </span>
        )}
      </div>
    </div> */}

    <div className="h-16 flex items-center">
  <div
    className={`flex items-center ${
      sidebarCollapsed ? "justify-center w-full" : "justify-start gap-2"
    }`}
  >
    <div className="ml-2 w-7 h-10 rounded-xl bg-primary flex items-center justify-center shadow-glow-primary flex-shrink-0">
      <Box className="w-6 h-6 text-white" />
    </div>

    {!sidebarCollapsed && (
      <span className="text-xl font-bold tracking-tight text-white">
        {APP_NAME}
      </span>
    )}
  </div>
</div>
    
      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 border-t border-white/5 overflow-y-auto overflow-x-hidden">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            end={item.path === '/'}
            title={sidebarCollapsed ? item.label : undefined}
            className={({ isActive }) =>
              `flex items-center px-3 py-2.5 rounded-xl transition-all duration-150 group ${
                sidebarCollapsed ? 'justify-center' : 'gap-1'
              } ${
                isActive
                  ? 'bg-sidebar-active text-white font-semibold shadow-glow-primary'
                  : 'text-sidebar-text hover:bg-sidebar-hover hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  className={`w-2 h-5 min-w-[20px] min-h-[20px] flex-shrink-0 ${
                    isActive ? 'text-white' : 'text-sidebar-text group-hover:text-white'
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
          onClick={handleLogout}
          className={`w-full flex items-center px-3 py-2.5 rounded-xl text-sidebar-text hover:bg-sidebar-hover hover:text-white transition-colors duration-150 ${
            sidebarCollapsed ? 'justify-center' : 'gap-2'
          }`}
          title={sidebarCollapsed ? 'Logout' : undefined}
        >
          <LogOut className="w-5 h-5 min-w-[20px] min-h-[20px] flex-shrink-0" />
          {!sidebarCollapsed && (
            <span className="text-sm whitespace-nowrap">Logout</span>
          )}
        </button>

        <button
          onClick={toggleSidebar}
          className="w-full flex items-center justify-center py-2 rounded-xl text-sidebar-text hover:bg-sidebar-hover hover:text-sidebar-text transition-colors duration-150"
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
