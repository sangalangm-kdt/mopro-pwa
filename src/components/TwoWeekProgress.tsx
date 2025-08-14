// TwoWeekProgress.tsx (replace the component with this upgraded version)
import { TwoWeekBar } from "@/utils/progress-summary";

type Props = {
  title?: string;
  bars: TwoWeekBar[];
  avgPercent: number;
  rangeLabel: string;
  selectedDayKey: string | null;
  onSelectDay: (key: string | null) => void;
  loading?: boolean;
  // NEW meta (optional)
  daysActive?: number; // count of days with progress > 0
  latestLabel?: string; // e.g., "Bucket Wheel • 10%"
};

export default function TwoWeekProgress({
  title = "Last 14 Days",
  bars,
  avgPercent,
  rangeLabel,
  selectedDayKey,
  onSelectDay,
  loading,
  daysActive,
  latestLabel,
}: Props) {
  const dense = bars.length >= 24;
  const barWidth = dense ? "w-4" : "w-6";
  const gapClass = dense ? "gap-2" : "gap-4";
  const chartHeight = dense ? "h-28 sm:h-32" : "h-36 sm:h-44";
  const dayFont = dense ? "text-[10px]" : "text-[12px]";
  const todayKey = new Date().toLocaleDateString("en-CA");
  const isEmpty = !bars.some((b) => b.pct > 0);

  return (
    <div className="w-full max-w-md rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 p-4 sm:p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white truncate">
            {title}
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            {rangeLabel}
          </p>
          {/* Small meta row */}
          <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[11px] sm:text-xs text-gray-500 dark:text-gray-400">
            {typeof daysActive === "number" && (
              <span>
                {daysActive}/{bars.length} days active
              </span>
            )}
            {latestLabel && <span>• Latest: {latestLabel}</span>}
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-2xl sm:text-3xl font-semibold text-primary-600 dark:text-primary-400">
            {loading ? "…" : `${Math.round(avgPercent)}%`}
          </p>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            Avg completion
          </p>
        </div>
      </div>

      {/* Empty state */}
      {!loading && isEmpty ? (
        <div className="mt-4 flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-200 dark:border-zinc-700 p-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            No progress recorded in this period.
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Scan a QR to start tracking.
          </p>
        </div>
      ) : (
        // Bars with baseline tracks
        <div className="mt-4 -mx-1 sm:mx-0 overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-px-3 overscroll-x-contain touch-pan-x">
          <div
            className={`flex ${gapClass} ${chartHeight} items-end pr-2`}
            role="list"
            aria-label="Daily completion chart"
          >
            {bars.map((b) => {
              const isSelected = selectedDayKey === b.key;
              const isToday = b.key === todayKey;
              const height = Math.max(6, b.pct);
              const topLabelText = isToday ? "Today" : b.labelTop;
              const topLabelVisibility =
                dense && !isToday ? "hidden sm:inline" : "";

              return (
                <button
                  key={b.key}
                  onClick={() => onSelectDay(isSelected ? null : b.key)}
                  className="group flex flex-col items-center gap-1 min-w-[22px] sm:min-w-[34px] snap-start focus:outline-none"
                  role="listitem"
                  title={`${b.labelTop} ${b.labelBottom}: ${b.pct}%${
                    isToday ? " (Today)" : ""
                  }`}
                  aria-label={`${b.labelTop} ${b.labelBottom}: ${b.pct}%${
                    isToday ? " (Today)" : ""
                  }`}
                >
                  {/* Track + fill */}
                  <div
                    className={[
                      barWidth,
                      "h-full rounded-xl bg-gray-200/70 dark:bg-zinc-800/70",
                      "flex flex-col justify-end",
                      isSelected
                        ? "ring-2 ring-primary-500"
                        : isToday
                        ? "ring-2 ring-primary-300"
                        : "",
                    ].join(" ")}
                  >
                    <div
                      className={[
                        "rounded-xl mx-[1px]",
                        "bg-gradient-to-t from-primary-700 to-primary-400",
                        "dark:from-primary-800 dark:to-primary-500",
                      ].join(" ")}
                      style={{ height: `${height}%` }}
                    />
                  </div>

                  <span
                    className={`leading-none ${dayFont} ${topLabelVisibility} ${
                      isToday
                        ? "text-primary-700 dark:text-primary-300 font-medium"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {topLabelText}
                  </span>
                  <span
                    className={`leading-none ${dayFont} ${
                      isToday
                        ? "text-primary-700 dark:text-primary-300"
                        : "text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {b.labelBottom}
                  </span>
                  {isSelected && (
                    <span
                      className={`leading-none ${dayFont} text-primary-600 dark:text-primary-400`}
                    >
                      {b.pct}%
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Helper row */}
      <div className="mt-3 flex items-center justify-between">
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          Tap a day to filter history
        </p>
        {selectedDayKey && (
          <button
            className="text-xs sm:text-sm text-primary-600 dark:text-primary-400"
            onClick={() => onSelectDay(null)}
          >
            Clear filter
          </button>
        )}
      </div>
    </div>
  );
}
