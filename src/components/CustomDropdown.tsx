import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

export const CustomDropdown = ({
  value,
  onChange,
  options,
}: {
  value: number;
  onChange: (val: number) => void;
  options: { label: string; value: number }[];
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative w-full">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        type="button"
        className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-900 text-sm text-left text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-600 flex justify-between items-center"
      >
        {selectedOption?.label || "Select"}
        <ChevronDown
          className={`w-4 h-4 ml-2 transition-transform duration-200 text-gray-400 dark:text-gray-500 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <ul className="absolute z-10 mt-2 w-full bg-white dark:bg-zinc-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {options.map((opt) => (
            <li
              key={opt.value}
              onClick={(e) => {
                e.stopPropagation();
                onChange(opt.value);
                setIsOpen(false);
              }}
              className={`px-4 py-2 cursor-pointer text-sm hover:bg-gray-100 dark:hover:bg-zinc-700 ${
                opt.value === value
                  ? "bg-gray-100 dark:bg-zinc-700 font-medium"
                  : ""
              }`}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
