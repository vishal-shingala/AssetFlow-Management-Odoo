export default function Card({ children, className = '', hover = true, padding = 'p-6' }) {
  return (
    <div
      className={`bg-surface rounded-2xl border border-slate-100 shadow-sm ${padding} ${className} 
        ${hover ? 'transition-all duration-300 hover:-translate-y-1 hover:shadow-md' : ''}`}
    >
      {children}
    </div>
  );
}
