
import { Link } from 'react-router-dom';

export default function Breadcrumb({ items }) {
  return (
    <nav className="flex items-center gap-1.5 text-sm">
      <Link to="/" className="text-muted hover:text-primary transition-colors">
        <i className="pi pi-home w-4 h-4"></i>
      </Link>
      {items.map((item, idx) => (
        <div key={idx} className="flex items-center gap-1.5">
          <i className="pi pi-chevron-right w-3.5 h-3.5 text-gray-300"></i>
          {idx === items.length - 1 ? (
            <span className="font-medium text-text">{item.label}</span>
          ) : (
            <Link to={item.path} className="text-muted hover:text-primary transition-colors">
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}
