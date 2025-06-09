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
}

const KNOWN_MANUFACTURERS: Manufacturer[] = [
  { id: "1", label: "Toyota" },
  { id: "2", label: "Kawasaki" },
  { id: "3", label: "Honda" },
  { id: "4", label: "Yamaha" },
];

export default function ManufacturerInput({
  label,
  name = "manufacturerId",
  value,
  onChange,
  placeholder = "Select or type a company",
  icon,
  error,
}: ManufacturerInputProps) {
  const [focused, setFocused] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [displayValue, setDisplayValue] = useState("");

  // Sync display value when ID (value) changes
  useEffect(() => {
    const matched = KNOWN_MANUFACTURERS.find((m) => m.id === value);
    setDisplayValue(matched?.label || value);
  }, [value]);

  const filtered = KNOWN_MANUFACTURERS.filter((m) =>
    m.label.toLowerCase().includes(displayValue.toLowerCase())
  );

  const exactMatch = KNOWN_MANUFACTURERS.some(
    (m) => m.label.toLowerCase() === displayValue.toLowerCase()
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
          onFocus={() => {
            setFocused(true);
            setShowDropdown(true);
          }}
          onBlur={() => {
            setFocused(false);
            setTimeout(() => setShowDropdown(false), 100);
          }}
          onChange={(e) => setDisplayValue(e.target.value)}
          className={`w-full text-base sm:text-base px-3 py-2 sm:py-3 border ${
            error
              ? "border-red-500 dark:border-red-400"
              : "border-gray-300 dark:border-gray-600"
          } bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-md shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-600/30 focus:border-primary-700 ${
            icon ? "pl-10" : ""
          }`}
        />

        {showDropdown && (
          <ul className="absolute z-10 mt-1 w-full max-h-48 overflow-auto bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-md shadow-md">
            {filtered.map((item) => (
              <li
                key={item.id}
                onMouseDown={() => {
                  onChange(item.id);
                  setDisplayValue(item.label);
                }}
                className="px-4 py-2 text-sm hover:bg-primary-50 dark:hover:bg-zinc-700 cursor-pointer transition-colors"
              >
                {item.label}
              </li>
            ))}

            {displayValue.trim() && !exactMatch && (
              <li
                onMouseDown={() => {
                  onChange(displayValue);
                }}
                className="px-4 py-2 text-sm text-yellow-700 dark:text-yellow-400 bg-yellow-50 dark:bg-zinc-800 border-t border-gray-200 dark:border-zinc-700 cursor-pointer hover:bg-yellow-100 dark:hover:bg-zinc-700 transition"
              >
                <span className="font-medium">Not found:</span> "
                <span className="italic">{displayValue}</span>". Click to add
                company.
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
