import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown } from 'lucide-react';

export default function Dropdown({ options, value, onChange, placeholder = 'Select...', label, disabled = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (buttonRef.current && !buttonRef.current.contains(e.target) && 
          menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const dropdownHeight = Math.min(options.length * 40, 240);
      const spaceBelow = window.innerHeight - rect.bottom;
      const shouldDropUp = spaceBelow < dropdownHeight + 10 && rect.top > spaceBelow;
      
      setDropdownPosition({
        top: shouldDropUp ? rect.top - dropdownHeight - 4 : rect.bottom + 4,
        left: rect.left,
        width: rect.width
      });
    }
  }, [isOpen, options.length]);

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
          ref={buttonRef}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className="w-full flex items-center justify-between px-4 py-2.5 text-sm rounded-xl
            border-0 bg-background text-left shadow-soft
            focus:outline-none focus:ring-2 focus:ring-primary/25 focus:bg-white
            transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className={displayValue ? 'text-text' : 'text-muted'}>
            {displayValue || placeholder}
          </span>
          <ChevronDown className={`w-6 h-6 text-muted transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        {isOpen && createPortal(
          <div 
            ref={menuRef}
            className="fixed z-[9999] bg-white rounded-2xl shadow-dropdown py-1.5 max-h-60 overflow-y-auto"
            style={{
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`,
              width: `${dropdownPosition.width}px`
            }}
          >
            {options.map((option, i) => {
              const optValue = typeof option === 'string' ? option : option.value;
              const rawLabel = typeof option === 'string' ? option : option.label;
              const optLabel = rawLabel || (
                placeholder && placeholder !== 'Select...'
                  ? (placeholder.toLowerCase() === 'status' ? 'All Statuses' : (placeholder.toLowerCase() === 'category' ? 'All Categories' : `All ${placeholder}s`))
                  : 'All'
              );
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
          </div>,
          document.body
        )}
      </div>
    </div>
  );
}
