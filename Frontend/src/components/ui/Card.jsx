// Borderless card — white surface + soft shadow, no border
// rounded prop: 'lg' (default, slightly rounded), '2xl' (more rounded), 'none'
export default function Card({ children, className = '', hover = false, padding = 'p-5', rounded = 'xl' }) {
  const roundedMap = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
  };
  return (
    <div
      className={`bg-white ${roundedMap[rounded] ?? 'rounded-xl'} shadow-card ${padding} ${className}
        ${hover ? 'transition-shadow duration-200 hover:shadow-card-hover cursor-pointer' : ''}`}
    >
      {children}
    </div>
  );
}
