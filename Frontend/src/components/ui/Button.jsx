import { motion } from 'framer-motion';

const variants = {
  primary: 'bg-primary hover:bg-indigo-700 text-white',
  secondary: 'bg-secondary hover:bg-indigo-500 text-white',
  success: 'bg-success hover:bg-emerald-600 text-white',
  warning: 'bg-warning hover:bg-amber-600 text-white',
  danger: 'bg-danger hover:bg-red-700 text-white',
  outline: 'border border-gray-300 hover:bg-gray-50 text-text',
  ghost: 'hover:bg-gray-100 text-text',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-2.5 text-base',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  disabled = false,
  fullWidth = false,
  onClick,
  type = 'button',
  className = '',
}) {
  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center gap-2 font-medium rounded-lg
        transition-colors duration-200 cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </motion.button>
  );
}
