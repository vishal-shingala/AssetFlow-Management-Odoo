export default function Avatar({ name, src, size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?';

  // Generate a consistent color from the name using only our robust theme palette
  const colors = [
    'bg-primary', 'bg-secondary', 'bg-success', 'bg-warning',
    'bg-danger', 'bg-info', 'bg-primary-light', 'bg-secondary-light',
  ];
  const colorIndex = name ? name.charCodeAt(0) % colors.length : 0;

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${sizeClasses[size]} rounded-full object-cover ring-2 ring-white ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} ${colors[colorIndex]} rounded-full flex items-center justify-center text-white font-semibold ring-2 ring-white ${className}`}
    >
      {initials}
    </div>
  );
}
