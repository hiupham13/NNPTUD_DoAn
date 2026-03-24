import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import './SearchBar.css';

interface SearchBarProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
}

export default function SearchBar({
  value: externalValue = '',
  onChange,
  placeholder = 'Tìm kiếm sản phẩm...',
  debounceMs = 300,
}: SearchBarProps) {
  const [internalValue, setInternalValue] = useState(externalValue);

  // Sync with external value
  useEffect(() => {
    setInternalValue(externalValue);
  }, [externalValue]);

  // Debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (internalValue !== externalValue) {
        onChange(internalValue);
      }
    }, debounceMs);
    return () => clearTimeout(timer);
  }, [internalValue, debounceMs]);

  return (
    <div className="search-bar">
      <Search size={18} strokeWidth={1.5} className="search-bar__icon" />
      <input
        type="text"
        className="search-bar__input"
        placeholder={placeholder}
        value={internalValue}
        onChange={(e) => setInternalValue(e.target.value)}
      />
      {internalValue && (
        <button
          className="search-bar__clear"
          onClick={() => {
            setInternalValue('');
            onChange('');
          }}
          aria-label="Xoá tìm kiếm"
        >
          ✕
        </button>
      )}
    </div>
  );
}
