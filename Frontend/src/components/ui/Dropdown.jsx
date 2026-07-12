import { useState, useRef, useEffect } from 'react';
import { HiChevronDown } from 'react-icons/hi2';

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
          className="w-full flex items-center justify-between px-3.5 py-2.5 text-sm rounded-lg
            border border-gray-300 bg-white text-left
            hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
            transition-all duration-200"
        >
          <span className={displayValue ? 'text-text' : 'text-muted'}>
            {displayValue || placeholder}
          </span>
          <HiChevronDown className={`w-4 h-4 text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        {isOpen && (
          <div className="absolute z-20 w-full mt-1.5 bg-white rounded-lg border border-gray-200 shadow-lg py-1 max-h-60 overflow-y-auto">
            {options.map((option, i) => {
              const optValue = typeof option === 'string' ? option : option.value;
              const optLabel = typeof option === 'string' ? option : option.label;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => { onChange(optValue); setIsOpen(false); }}
                  className={`w-full px-3.5 py-2 text-sm text-left hover:bg-gray-50 transition-colors
                    ${optValue === value ? 'text-primary font-medium bg-primary/5' : 'text-text'}`}
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
