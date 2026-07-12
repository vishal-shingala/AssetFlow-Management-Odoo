const colorMap = {
  primary: 'bg-primary/10 text-primary',
  secondary: 'bg-secondary/10 text-secondary',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  danger: 'bg-danger/10 text-danger',
  muted: 'bg-gray-100 text-muted',
  info: 'bg-info/10 text-info',
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
