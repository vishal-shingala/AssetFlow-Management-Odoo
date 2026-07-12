import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export default function Dropdown({ options, value, onChange, placeholder = 'Select...', label }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selected = options.find((o) => (typeof o === 'string' ? o === value : o.value === value));
  const displayValue = typeof selected === 'string' ? selected : selected?.label;

  return (
    <div className="w-full" ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-text mb-1.5">{label}</label>
      )}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-4 py-2.5 text-sm rounded-xl
            border-0 bg-background text-left shadow-soft
            focus:outline-none focus:ring-2 focus:ring-primary/25 focus:bg-white
            transition-all duration-200"
        >
          <span className={displayValue ? 'text-text' : 'text-muted'}>
            {displayValue || placeholder}
          </span>
          <ChevronDown className={`w-4 h-4 text-muted transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        {isOpen && (
          <div className="absolute z-20 w-full mt-1 bg-white rounded-2xl shadow-dropdown py-1.5 max-h-60 overflow-y-auto">
            {options.map((option, i) => {
              const optValue = typeof option === 'string' ? option : option.value;
              const optLabel = typeof option === 'string' ? option : option.label;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => { onChange(optValue); setIsOpen(false); }}
                  className={`w-full px-4 py-2 text-sm text-left hover:bg-primary/5 transition-colors
                    ${optValue === value ? 'text-primary font-semibold bg-primary/5' : 'text-text'}`}
                >
                  {optLabel}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
