export default function Avatar({
  name = '',
  src,
  size = 'md',
  className = '',
}) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  const initials = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase() || '?';

  const colors = [
    'bg-primary',
    'bg-secondary',
    'bg-success',
    'bg-warning',
    'bg-danger',
    'bg-info',
    'bg-primary-light',
    'bg-secondary-light',
  ];

  const colorIndex =
    [...name].reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % colors.length;

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${sizeClasses[size]} rounded-full object-cover ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} ${colors[colorIndex]} rounded-full flex items-center justify-center font-semibold text-white ${className}`}
    >
      {initials}
    </div>
  );
}