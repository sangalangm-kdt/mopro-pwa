import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const INTERVAL_OPTIONS = [5, 10, 20, 25];

export default function IntervalDropdown({
    value,
    onChange,
}: {
    value: number;
    onChange: (val: number) => void;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(0);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;

            if (e.key === "ArrowDown") {
                e.preventDefault();
                setHighlightedIndex((prev) =>
                    prev < INTERVAL_OPTIONS.length - 1 ? prev + 1 : prev
                );
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
            } else if (e.key === "Enter") {
                e.preventDefault();
                const selected = INTERVAL_OPTIONS[highlightedIndex];
                onChange(selected);
                setIsOpen(false);
            } else if (e.key === "Escape") {
                setIsOpen(false);
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, highlightedIndex, onChange]);

    return (
        <div ref={dropdownRef} className="relative w-20">
            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                className="w-full h-9 pl-3 pr-8 rounded-md text-sm bg-white dark:bg-zinc-800 text-gray-800 dark:text-white border border-gray-300 dark:border-zinc-600 text-left relative focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
                {value}
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            </button>

            {isOpen && (
                <ul className="absolute z-20 mt-1 w-full bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-600 rounded-md shadow-md text-sm text-gray-800 dark:text-white">
                    {INTERVAL_OPTIONS.map((option, index) => (
                        <li
                            key={option}
                            onClick={() => {
                                onChange(option);
                                setIsOpen(false);
                            }}
                            onMouseEnter={() => setHighlightedIndex(index)}
                            className={`px-3 py-2 cursor-pointer ${
                                index === highlightedIndex
                                    ? "bg-primary-100 dark:bg-primary-700 text-primary-700 dark:text-white"
                                    : "hover:bg-gray-100 dark:hover:bg-zinc-700"
                            } ${option === value ? "font-semibold" : ""}`}
                        >
                            {option}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
