const variants = {
  primary: 'bg-primary hover:bg-primary-dark text-white shadow-glow-primary',
  secondary: 'bg-secondary hover:bg-secondary-dark text-white',
  success: 'bg-success hover:bg-success-dark text-white shadow-glow-success',
  warning: 'bg-warning hover:bg-warning-dark text-white',
  danger: 'bg-danger hover:bg-danger-dark text-white shadow-glow-danger',
  outline: 'border border-gray-200 hover:border-primary/40 hover:bg-primary/5 text-text',
  ghost: 'hover:bg-gray-100 text-text',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-5 py-2.5 text-sm gap-2',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconClassName = '',
  disabled = false,
  fullWidth = false,
  onClick,
  type = 'button',
  className = '',
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center font-semibold rounded-xl
        transition-all duration-150 cursor-pointer active:scale-[0.98]
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
    >
      {Icon && <Icon className={`w-6 h-6 flex-none ${iconClassName}`} />}
      {children}
    </button>
  );
}
