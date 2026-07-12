import { NavLink, useNavigate } from 'react-router-dom';
import { Box, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NAV_ITEMS, APP_NAME } from '../../constants';

export default function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-sidebar flex flex-col z-40 transition-all duration-300 ease-in-out ${
        sidebarCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Logo Area */}
      <div className="flex items-center h-16 px-5">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 min-w-[36px] rounded-xl bg-gradient-to-br from-primary to-indigo-500 flex items-center justify-center flex-none shadow-lg shadow-primary/20">
            <Box className="w-5 h-5 text-white" />
          </div>
          <span
            className={`font-bold text-lg text-white tracking-tight whitespace-nowrap transition-all duration-300 ${
              sidebarCollapsed ? 'opacity-0 translate-x-4 hidden' : 'opacity-100 translate-x-0'
            }`}
          >
            {APP_NAME}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto overflow-x-hidden custom-scrollbar">
        {NAV_ITEMS.map((item) => {
          return (
            <NavLink
              key={item.id}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${
                  isActive
                    ? 'bg-gradient-to-r from-primary to-indigo-600 text-white font-semibold'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`
              }
              title={sidebarCollapsed ? item.label : undefined}
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    className={`w-5 h-5 flex-none transition-transform duration-200 ${
                      isActive ? 'text-white' : 'group-hover:scale-110'
                    }`}
                  />
                  <span
                    className={`text-sm whitespace-nowrap transition-all duration-300 ${
                      sidebarCollapsed ? 'opacity-0 translate-x-4 w-0 hidden' : 'opacity-100 translate-x-0 w-auto'
                    }`}
                  >
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="p-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-200 group"
          title={sidebarCollapsed ? 'Logout' : undefined}
        >
          <LogOut className="w-5 h-5 flex-none group-hover:-translate-x-1 transition-transform" />
          <span
            className={`text-sm font-medium whitespace-nowrap transition-all duration-300 ${
              sidebarCollapsed ? 'opacity-0 w-0 hidden' : 'opacity-100 w-auto'
            }`}
          >
            Logout
          </span>
        </button>

        <button
          onClick={toggleSidebar}
          className="w-full flex items-center justify-center mt-2 p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-200"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-5 h-5 transition-transform duration-300 hover:scale-110" />
          ) : (
            <ChevronLeft className="w-5 h-5 transition-transform duration-300 hover:scale-110" />
          )}
        </button>
      </div>
    </aside>
  );
}
