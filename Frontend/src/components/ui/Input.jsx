import { forwardRef } from 'react';

const Input = forwardRef(function Input(
  { label, error, icon: Icon, type = 'text', className = '', ...props },
  ref
) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-text mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="w-6 h-6 text-muted" />
          </div>
        )}
        <input
          ref={ref}
          type={type}
          className={`
            w-full rounded-xl border border-gray-200 bg-white
            pr-4 py-2.5 text-sm text-text shadow-sm
            placeholder:text-muted
            focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
            transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
            ${Icon ? 'pl-14' : 'pl-4'}
            ${error ? 'ring-2 ring-danger/30 bg-red-50/50' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-danger font-medium">{error}</p>
      )}
    </div>
  );
});

export default Input;
