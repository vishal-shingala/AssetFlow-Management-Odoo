import { HiOutlineBell, HiOutlineExclamationTriangle, HiOutlineCheckCircle, HiOutlineInformationCircle } from 'react-icons/hi2';

const iconMap = {
  info: HiOutlineInformationCircle,
  success: HiOutlineCheckCircle,
  warning: HiOutlineExclamationTriangle,
  danger: HiOutlineBell,
};

const bgMap = {
  info: 'bg-blue-50 border-blue-100',
  success: 'bg-emerald-50 border-emerald-100',
  warning: 'bg-amber-50 border-amber-100',
  danger: 'bg-red-50 border-red-100',
};

const iconColorMap = {
  info: 'text-blue-500',
  success: 'text-success',
  warning: 'text-warning',
  danger: 'text-danger',
};

export default function NotificationCard({ title, message, time, type = 'info', read = false }) {
  const Icon = iconMap[type];

  return (
    <div
      className={`flex gap-3 p-3 rounded-xl border transition-colors ${
        read ? 'bg-white border-gray-100' : bgMap[type]
      }`}
    >
      <div className={`mt-0.5 ${iconColorMap[type]}`}>
        <Icon className="w-5 h-5" />
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
