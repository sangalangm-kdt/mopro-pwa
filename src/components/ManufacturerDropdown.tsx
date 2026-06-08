import { useEffect, useState } from "react";

interface Manufacturer {
  id: string;
  label: string;
}

interface ManufacturerInputProps {
  label?: string;
  name?: string;
  value: string; // ID
  onChange: (value: string) => void; // Pass back ID
  placeholder?: string;
  icon?: React.ReactNode;
  error?: string;
  manufacturers?: Manufacturer[];
  disabled?: boolean;
  loading?: boolean;
  emptyMessage?: string;
}

export default function ManufacturerInput({
  label,
  name = "manufacturerId",
  value,
  onChange,
  placeholder,
  icon,
  error,
  manufacturers = [],
  disabled = false,
  loading = false,
  emptyMessage,
}: ManufacturerInputProps) {
  const [focused, setFocused] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [displayValue, setDisplayValue] = useState("");

  // Sync display value when ID (value) changes
  useEffect(() => {
    if (!value) return;
    const matched = manufacturers.find((m) => m.id === value);
    setDisplayValue(matched?.label || value);
  }, [manufacturers, value]);

  const filtered = manufacturers.filter((m) =>
    m.label.toLowerCase().includes(displayValue.toLowerCase())
  );

  return (
    <div className="w-full animate-fade-in transition-opacity duration-500 relative">
      {label && (
        <label
          htmlFor={name}
          className="block text-base sm:text-base font-medium text-gray-700 dark:text-gray-200 mb-1"
        >
          {label}
        </label>
      )}

      <div className="relative group">
        {icon && (
          <div
            className={`absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-200 group-focus-within:text-primary-700 ${
              focused || displayValue
                ? "text-primary-700 dark:text-primary-400"
                : "text-gray-300 dark:text-gray-500"
            }`}
          >
            {icon}
          </div>
        )}

        <input
          id={name}
          name={name}
          type="text"
          value={displayValue}
          placeholder={placeholder}
          disabled={disabled || loading}
          onFocus={() => {
            if (disabled || loading) return;
            setFocused(true);
            setShowDropdown(true);
          }}
          onBlur={() => {
            setFocused(false);
            setTimeout(() => setShowDropdown(false), 100);
          }}
          onChange={(e) => {
            setDisplayValue(e.target.value);
            onChange("");
          }}
          className={`w-full text-base sm:text-base px-3 py-2 sm:py-3 border ${
            error
              ? "border-red-500 dark:border-red-400"
              : "border-gray-300 dark:border-gray-600"
          } bg-white dark:bg-zinc-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-zinc-400 rounded-md shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-600/30 focus:border-primary-700 disabled:cursor-not-allowed disabled:opacity-60 ${
            icon ? "pl-10" : ""
          }`}
        />

        {showDropdown && !disabled && !loading && (
          <ul className="absolute z-10 mt-1 w-full max-h-48 overflow-auto bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-md shadow-md">
            {filtered.map((item) => (
              <li
                key={item.id}
                onMouseDown={() => {
                  onChange(item.id);
                  setDisplayValue(item.label);
                }}
                className="px-4 py-2 text-sm text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 cursor-pointer transition-colors"
              >
                {item.label}
              </li>
            ))}

            {filtered.length === 0 && emptyMessage && (
              <li className="px-4 py-2 text-sm text-gray-500 dark:text-zinc-400">
                {emptyMessage}
              </li>
            )}
          </ul>
        )}
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-500 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}
