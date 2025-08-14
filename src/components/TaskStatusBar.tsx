// src/components/TaskStatusBar.tsx
type TaskTotals = {
  todo: number;
  in_progress: number;
  blocked: number;
  done: number;
  all: number;
};

type Props = {
  title?: string;
  rangeLabel: string;
  windowDays: 15 | 30;
  totals: TaskTotals;
  loading?: boolean;
};

export default function TaskStatusBar({
  title = "My Tasks",
  rangeLabel,
  windowDays,
  totals,
  loading,
}: Props) {
  const pct = (n: number) =>
    totals.all ? Math.round((n / totals.all) * 100) : 0;

  const segments = [
    {
      key: "todo",
      label: "To-do",
      value: totals.todo,
      pct: pct(totals.todo),
      cls: "bg-gray-300 dark:bg-zinc-600",
    },
    {
      key: "in_progress",
      label: "In-Progress",
      value: totals.in_progress,
      pct: pct(totals.in_progress),
      cls: "bg-primary-500/90 dark:bg-primary-400/90",
    },
    {
      key: "blocked",
      label: "Blocked",
      value: totals.blocked,
      pct: pct(totals.blocked),
      cls: "bg-amber-500/90 dark:bg-amber-400/90",
    },
    {
      key: "done",
      label: "Done",
      value: totals.done,
      pct: pct(totals.done),
      cls: "bg-emerald-500/90 dark:bg-emerald-400/90",
    },
  ];

  return (
    <div className="w-full max-w-md rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 p-4 sm:p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-baseline justify-between">
        <div className="min-w-0">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white truncate">
            {title} — {windowDays} Days
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            {rangeLabel}
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-2xl sm:text-3xl font-semibold text-primary-600 dark:text-primary-400">
            {loading ? "…" : totals.all}
          </p>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            Total tasks
          </p>
        </div>
      </div>

      {/* Stacked bar */}
      <div className="mt-4">
        <div className="w-full h-6 sm:h-7 rounded-full overflow-hidden bg-gray-200 dark:bg-zinc-800 ring-1 ring-gray-300/60 dark:ring-zinc-700/60">
          <div className="flex h-full w-full">
            {segments.map((s) =>
              s.value ? (
                <div
                  key={s.key}
                  className={`${s.cls} h-full`}
                  style={{ width: `${s.pct}%` }}
                  title={`${s.label}: ${s.value} (${s.pct}%)`}
                  aria-label={`${s.label}: ${s.value} (${s.pct}%)`}
                />
              ) : null
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-xs sm:text-sm">
          {segments.map((s) => (
            <div key={s.key} className="flex items-center gap-2">
              <span className={`inline-block w-3 h-3 rounded ${s.cls}`} />
              <span className="text-gray-700 dark:text-gray-300">
                {s.label}
              </span>
              <span className="ml-auto text-gray-500 dark:text-gray-400">
                {loading ? "…" : `${s.value} (${s.pct}%)`}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
