

const iconMap = {
  info: 'pi-info-circle',
  success: 'pi-check-circle',
  warning: 'pi-exclamation-triangle',
  danger: 'pi-bell',
};

const bgMap = {
  info: 'bg-info/10 border-info/20',
  success: 'bg-success/10 border-success/20',
  warning: 'bg-warning/10 border-warning/20',
  danger: 'bg-danger/10 border-danger/20',
};

const iconColorMap = {
  info: 'text-info',
  success: 'text-success',
  warning: 'text-warning',
  danger: 'text-danger',
};

export default function NotificationCard({ title, message, time, type = 'info', read = false }) {
  const iconClass = iconMap[type];

  return (
    <div
      className={`flex gap-3 p-3 rounded-xl border transition-colors ${
        read ? 'bg-surface border-gray-100' : bgMap[type]
      }`}
    >
      <div className={`mt-0.5 ${iconColorMap[type]}`}>
        <i className={`pi ${iconClass} w-6 h-6`}></i>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-text truncate">{title}</p>
          {!read && (
            <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
          )}
        </div>
        <p className="text-xs text-muted mt-0.5 line-clamp-2">{message}</p>
        <p className="text-[10px] text-muted mt-1">{time}</p>
      </div>
    </div>
  );
}
