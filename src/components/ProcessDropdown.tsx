import { useEffect, useRef, useState } from "react";
import { ChevronDown, X } from "lucide-react";
import { useLocalizedText } from "@/utils/localized-text";
import { PROCESS_DROPDOWN_TEXT_KEYS } from "@/constants";

export default function ProcessDropdown({
  value,
  onChange,
  placeholder,
  options = [],
}: {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  options: { label: string; value: string }[];
}) {
  const TEXT = useLocalizedText("common", PROCESS_DROPDOWN_TEXT_KEYS);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const selected = options.find((p) => p.value === value);
    setSearch(selected?.label || "");
  }, [options, value]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setHighlightedIndex(0);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredProcesses = options.filter((proc) =>
    proc.label.toLowerCase().includes(search.toLowerCase())
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < filteredProcesses.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : filteredProcesses.length - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      const selected = filteredProcesses[highlightedIndex];
      if (selected) {
        onChange(selected.value);
        setSearch(selected.label);
        setOpen(false);
        setHighlightedIndex(0);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
    }
  };

  return (
    <div className="space-y-1 relative" ref={dropdownRef}>
      <div
        className="flex items-center w-full px-3 py-2 text-sm rounded-md border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-800 dark:text-white shadow-sm focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-primary-500"
        onClick={() => {
          setOpen(true);
          inputRef.current?.focus();
        }}
      >
        <input
          ref={inputRef}
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setOpen(true);
            setHighlightedIndex(0);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || TEXT.PLACEHOLDER}
          className="flex-1 text-sm bg-transparent border-none outline-none truncate overflow-hidden whitespace-nowrap"
        />

        {value && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onChange("");
              setSearch("");
              setOpen(true);
            }}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-white"
            aria-label={TEXT.CLEAR_SELECTION}
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <ChevronDown
          onClick={(e) => {
            e.stopPropagation();
            setOpen((prev) => !prev);
            inputRef.current?.focus();
          }}
          className={`ml-2 w-4 h-4 text-gray-500 dark:text-gray-400 cursor-pointer transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </div>

      {open && (
        <div className="absolute z-50 mt-1 w-full max-h-60 overflow-y-auto overflow-x-hidden rounded-md shadow-lg bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 transition transform duration-200 ease-out scale-100 opacity-100">
          <ul className="py-1 text-sm text-gray-700 dark:text-gray-200">
            {filteredProcesses.length > 0 ? (
              filteredProcesses.map((proc, idx) => (
                <li
                  key={proc.value}
                  onClick={() => {
                    onChange(proc.value);
                    setSearch(proc.label);
                    setOpen(false);
                    setHighlightedIndex(
                      options.findIndex((p) => p.value === proc.value)
                    );
                  }}
                  className={`px-4 py-2 cursor-pointer transition-transform duration-100 ${
                    value === proc.value
                      ? "bg-primary-100 dark:bg-primary-600 text-primary-800 dark:text-white font-medium"
                      : idx === highlightedIndex
                      ? "bg-gray-100 dark:bg-zinc-700"
                      : "hover:bg-gray-100 dark:hover:bg-zinc-700 hover:scale-[1.01]"
                  }`}
                >
                  {proc.label}
                </li>
              ))
            ) : (
              <li className="px-4 py-2 text-gray-400 dark:text-gray-500 italic">
                {TEXT.NO_MATCHES}
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
