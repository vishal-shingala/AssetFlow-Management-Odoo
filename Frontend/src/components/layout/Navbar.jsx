import { CURRENT_USER } from '../../constants';
import Avatar from '../ui/Avatar';

export default function Navbar() {
  const userStr = sessionStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : CURRENT_USER;

  return (
    <header className="h-16 bg-background-surface border-b border-gray-100 flex items-center justify-end px-4 sticky top-0 z-30">
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="flex items-center gap-3 cursor-pointer pl-3 pr-1 py-1 rounded-xl hover:bg-background transition-colors">
          <div className="leading-tight text-right flex flex-col items-end gap-1">
            <p className="text-sm font-semibold text-name-text whitespace-nowrap">{user.name}</p>
            <span className="text-[10px] font-bold tracking-wider text-tag-text bg-tag-bg px-2 py-0.5 rounded-full uppercase shadow-sm">
              {user.role}
            </span>
          </div>
          <Avatar 
            name={user.name} 
            size="md"
            className="ring-2 ring-primary/20 shadow-sm" 
          />
        </div>
      </div>
    </header>
  );
}
