import { ChevronDown, Minus, Plus } from "lucide-react";
import { useState, useMemo } from "react";

export default function ProgressSlider({
  value,
  onChange,
  min = 0,
  max = 100,
}: {
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  label?: string;
}) {
  const [step, setStep] = useState(5);

  const percentage = useMemo(
    () => ((value - min) / (max - min)) * 100,
    [value, min, max]
  );

  const handleStep = (direction: "up" | "down") => {
    const next = direction === "up" ? value + step : value - step;
    if (next >= min && next <= max) onChange(next);
  };

  return (
    <div className="space-y-2 w-full">
      {/* Label + Step Toggle */}
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Progress <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center justify-between gap-2">
          <label
            htmlFor="step-select"
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Step:
          </label>
          <div className="relative w-16">
            <select
              id="step-select"
              value={step}
              onChange={(e) => setStep(Number(e.target.value))}
              className="w-full h-9 pl-3 pr-8 rounded-md text-sm bg-white dark:bg-zinc-800 text-gray-800 dark:text-white border border-gray-300 dark:border-zinc-600 appearance-none focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {[1, 2, 5, 10, 20, 25].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-gray-400 dark:text-gray-500">
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Slider with Gradient Track (no tooltip) */}
      <div className="relative w-full mt-8">
        <div className="absolute inset-0 h-2 rounded-lg bg-gray-200 dark:bg-zinc-700 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary-400 to-primary-600 transition-all"
            style={{ width: `${percentage}%` }}
          />
        </div>

        <div className="relative">
          <input
            type="range"
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            min={min}
            max={max}
            step={step}
            aria-label="Progress slider"
            className="progress-slider w-full h-2 appearance-none bg-transparent z-10 relative cursor-pointer"
          />
        </div>
      </div>

      {/* Input and Buttons aligned right */}
      <div className="flex justify-end">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => handleStep("down")}
            aria-label="Decrease progress"
            className="p-1 rounded-full border border-gray-300 dark:border-zinc-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-700"
          >
            <Minus className="w-4 h-4" />
          </button>

          {/* Input with % addon */}
          <div className="relative w-24">
            <input
              type="text"
              inputMode="numeric"
              value={value}
              onChange={(e) => {
                const raw = e.target.value.replace(/[^\d]/g, "");
                const val = Number(raw);
                if (!isNaN(val) && val >= min && val <= max) {
                  onChange(Math.round(val / step) * step);
                }
              }}
              className="w-full pr-8 pl-2 py-1 border rounded-md text-sm text-center bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 appearance-none focus:outline-none focus:ring-1 focus:ring-primary-500"
              onWheel={(e) => e.currentTarget.blur()}
              aria-label="Progress input"
            />
            <span className="absolute inset-y-0 right-0 flex items-center px-2 border bg-gray-100 dark:bg-zinc-700 border-l border-gray-300 dark:border-zinc-600 text-sm text-gray-600 dark:text-gray-300 rounded-r-md pointer-events-none">
              %
            </span>
          </div>

          <button
            type="button"
            onClick={() => handleStep("up")}
            aria-label="Increase progress"
            className="p-1 rounded-full border border-gray-300 dark:border-zinc-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-700"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
