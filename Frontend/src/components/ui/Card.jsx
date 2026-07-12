export default function Card({ children, className = '', hover = true, padding = 'p-6' }) {
  return (
    <div
      className={`bg-surface rounded-xl border border-gray-100 shadow-sm ${padding} ${className} 
        ${hover ? 'transition-all duration-200 hover:-translate-y-1 hover:shadow-card' : ''}`}
    >
      {children}
    </div>
  );
}
