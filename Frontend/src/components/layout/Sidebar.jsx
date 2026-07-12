import { NavLink, useNavigate } from 'react-router-dom';
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
      className={`fixed left-0 top-0 h-screen bg-slate-900 border-r border-slate-800 flex flex-col z-40 shadow-2xl transition-all duration-300 ease-in-out ${
        sidebarCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Logo Area */}
      <div className="flex items-center h-16 px-5 border-b border-slate-800 bg-slate-900/50">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 min-w-[36px] rounded-xl bg-gradient-to-br from-primary to-indigo-500 flex items-center justify-center flex-none shadow-lg shadow-primary/20">
            <i className="pi pi-box text-white text-lg"></i>
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
                    ? 'bg-primary/20 text-primary-light font-semibold'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`
              }
              title={sidebarCollapsed ? item.label : undefined}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full" />
                  )}
                  <i
                    className={`pi ${item.icon} text-lg flex-none transition-transform duration-200 ${
                      isActive ? 'scale-110 text-primary-light' : 'group-hover:scale-110'
                    }`}
                  ></i>
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
      <div className="p-4 border-t border-slate-800 bg-slate-900/50">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 group"
          title={sidebarCollapsed ? 'Logout' : undefined}
        >
          <i className="pi pi-sign-out text-lg flex-none group-hover:-translate-x-1 transition-transform"></i>
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
          className="w-full flex items-center justify-center mt-2 p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all duration-200"
        >
          <i
            className={`pi ${
              sidebarCollapsed ? 'pi-angle-double-right' : 'pi-angle-double-left'
            } text-lg transition-transform duration-300 hover:scale-110`}
          ></i>
        </button>
      </div>
    </aside>
  );
}
