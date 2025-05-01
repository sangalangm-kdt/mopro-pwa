import { Minus, Plus } from "lucide-react";

export default function ProgressSlider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label = "Progress",
}: {
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
}) {
  const percentage = ((value - min) / (max - min)) * 100;

  const handleStep = (direction: "up" | "down") => {
    const next = direction === "up" ? value + step : value - step;
    if (next >= min && next <= max) onChange(next);
  };

  return (
    <div className="space-y-2 w-full">
      {/* Label + Value Controls */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => handleStep("down")}
            className="p-1 rounded-full border border-gray-300 dark:border-zinc-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-700"
          >
            <Minus className="w-4 h-4" />
          </button>

          <input
            type="number"
            inputMode="numeric"
            value={String(Number(value))}
            min={min}
            max={max}
            onChange={(e) => {
              const val = Number(e.target.value);
              if (!isNaN(val) && val >= min && val <= max) onChange(val);
            }}
            className="w-14 px-2 py-1 border rounded text-sm text-center bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 appearance-none"
            onWheel={(e) => e.currentTarget.blur()} // prevent accidental scroll change
          />

          <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">
            %
          </span>

          <button
            type="button"
            onClick={() => handleStep("up")}
            className="p-1 rounded-full border border-gray-300 dark:border-zinc-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-700"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Gradient track behind the slider */}
      <div className="relative w-full">
        <div className="absolute inset-0 h-2 rounded-lg bg-gray-200 dark:bg-zinc-700 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary-400 to-primary-600"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Transparent input overlay */}
        <input
          type="range"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          min={min}
          max={max}
          step={step}
          className="progress-slider w-full h-2 appearance-none bg-transparent z-10 relative cursor-pointer"
        />
      </div>
    </div>
  );
}
