const colorMap = {
  primary: 'bg-primary/10 text-primary',
  secondary: 'bg-secondary/10 text-secondary',
  success: 'bg-emerald-50 text-success',
  warning: 'bg-amber-50 text-amber-700',
  danger: 'bg-red-50 text-danger',
  muted: 'bg-gray-100 text-muted',
  info: 'bg-blue-50 text-blue-600',
};

export default function StatusBadge({ status, colorKey, size = 'sm' }) {
  const color = colorMap[colorKey] || colorMap.muted;
  const sizeClasses = size === 'xs' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full whitespace-nowrap ${color} ${sizeClasses}`}
    >
      {status}
    </span>
  );
}
