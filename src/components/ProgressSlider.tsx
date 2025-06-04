import { PROGRESS_SLIDER_TEXT_KEYS } from "@/constants";
import { useLocalizedText } from "@/utils/localized-text";
import { Minus, Plus } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import IntervalDropdown from "./IntervalDropdown";
import { useTranslation } from "react-i18next";

interface ProgressSliderProps {
  percentage: number;
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  highlight?: boolean;
}

export default function ProgressSlider({
  percentage,
  value = 20,
  onChange,
  min = 0,
  max = 100,
  highlight = false,
}: ProgressSliderProps) {
  const [interval, setInterval] = useState(5);
  const [localValue, setLocalValue] = useState(String(value));
  const TEXT = useLocalizedText("common", PROGRESS_SLIDER_TEXT_KEYS);
  const { t } = useTranslation("common");
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    setLocalValue(String(value));
  }, [value]);
  useEffect(() => {
    if (showError) {
      const timeout = setTimeout(() => setShowError(false), 3000); // 3 seconds
      return () => clearTimeout(timeout); // cleanup
    }
  }, [showError]);

  const sliderPercentage = useMemo(
    () => ((value - min) / (max - min)) * 100,
    [value, min, max]
  );

  const handleInterval = (direction: "up" | "down") => {
    const delta = direction === "up" ? interval : -interval;
    const next = value + delta >= percentage ? value + delta : value;
    if (next >= min && next <= max) {
      onChange(next);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^\d]/g, "");
    setLocalValue(raw);
  };

  const handleInputBlur = () => {
    const parsed = Number(localValue);

    const isValid =
      !isNaN(parsed) &&
      parsed >= percentage &&
      parsed <= max &&
      parsed % interval === 0;

    if (isValid) {
      onChange(parsed);
      setShowError(false);
    } else {
      setShowError(true);
      setLocalValue(String(value)); // reset to last valid value
    }
  };

  return (
    <div className="space-y-2 w-full">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {TEXT.LABEL} <span className="text-red-500">*</span>
        </label>
      </div>

      <div className="relative w-full mt-8">
        <div className="absolute inset-0 h-2 rounded-lg bg-gray-200 dark:bg-zinc-700 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary-400 to-primary-600 transition-all"
            style={{ width: `${sliderPercentage}%` }}
          />
        </div>

        <input
          type="range"
          value={value}
          onChange={(e) =>
            onChange(
              Number(e.target.value) >= percentage
                ? Number(e.target.value)
                : percentage
            )
          }
          min={min}
          max={max}
          step={interval}
          aria-label={TEXT.INPUT}
          className="progress-slider w-full h-2 appearance-none bg-transparent z-10 relative cursor-pointer"
        />
      </div>

      <div className="flex justify-between">
        <div className="flex items-center gap-2">
          <label
            htmlFor="interval-select"
            className="text-base font-medium text-gray-700 dark:text-gray-300"
          >
            {TEXT.INTERVAL}
          </label>
          <IntervalDropdown value={interval} onChange={setInterval} />
        </div>

        <div className="flex items-center gap-1">
          {/* Decrease button */}
          <button
            type="button"
            onClick={() => handleInterval("down")}
            aria-label={TEXT.DECREASE}
            disabled={value - interval < percentage}
            className={`p-2 rounded-md border text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-700
              border-gray-300 dark:border-zinc-600
              ${
                value - interval < percentage
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
          >
            <Minus className="w-4 h-4" />
          </button>

          {/* Percentage input */}
          <div className="relative w-20">
            <input
              type="text"
              inputMode="numeric"
              value={localValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              className={`w-full pr-7 pl-2 py-1.5 border rounded-md text-base text-center bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 appearance-none focus:outline-none transition-all duration-300 ${
                highlight
                  ? "ring-2 ring-primary-500"
                  : showError
                  ? "ring-2 ring-red-500"
                  : "focus:ring-1 focus:ring-primary-500"
              }`}
              onWheel={(e) => e.currentTarget.blur()}
              aria-label={TEXT.INPUT}
            />
            <span className="absolute inset-y-0 right-0 flex items-center px-2 bg-gray-100 dark:bg-zinc-700 border-l border-gray-300 dark:border-zinc-600 text-xs text-gray-600 dark:text-gray-300 rounded-r-md pointer-events-none">
              %
            </span>
          </div>

          {/* Increase button */}
          <button
            type="button"
            onClick={() => handleInterval("up")}
            aria-label={TEXT.INCREASE}
            className="p-2 rounded-md border border-gray-300 dark:border-zinc-600 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-700"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
      {showError && (
        <div className="text-xs text-right text-red-600 mt-1">
          {t("progress_slider.error.invalid", {
            min: percentage,
            interval: interval,
          })}
        </div>
      )}
    </div>
  );
}
