import { HiOutlineMagnifyingGlass } from 'react-icons/hi2';

export default function SearchBar({ value, onChange, placeholder = 'Search...' }) {
  return (
    <div className="relative">
      <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border border-gray-200 bg-gray-50
          placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/20
          focus:border-primary focus:bg-white transition-all duration-200"
      />
    </div>
  );
}
