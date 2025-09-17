// src/components/TaskStatusBar.tsx (refactored with i18n + utils)
import type { MyTask } from "@/utils/map-progress-to-tasks";
import { useLocalizedText } from "@/utils/localized-text";
import { HOME_TEXT_KEYS } from "@constants/index";
import { makeProgressIndex } from "@/utils/home-helpers";

type TaskTotals = {
  todo: number;
  in_progress: number;
  blocked: number; // For Approval
  done: number;
  all: number; // kept for compat if you don’t pass tasks
};

type Props = {
  title?: string;
  rangeLabel: string;
  windowDays: string | number;
  loading?: boolean;

  // NEW: recount from these (preferred)
  tasks?: MyTask[];
  progressTasks?: MyTask[];

  // Fallback (kept for backward compatibility)
  totals?: TaskTotals;
};

export default function TaskStatusBar({
  title,
  rangeLabel,
  windowDays,
  loading,
  tasks,
  progressTasks,
  totals,
}: Props) {
  // i18n
  const TEXT = useLocalizedText("common", HOME_TEXT_KEYS);

  // If tasks are provided, recount from them to mirror the list
  let todo = 0,
    in_progress = 0,
    blocked = 0,
    done = 0;

  if (tasks && tasks.length) {
    const idx = makeProgressIndex(progressTasks as any);
    for (const t of tasks) {
      if ((idx as any).forApproval(t as any)) blocked++;
      else if ((t as any).status === "in_progress") in_progress++;
      else if ((t as any).status === "done") done++;
      else todo++;
    }
  } else if (totals) {
    // fallback to provided totals
    todo = totals.todo;
    in_progress = totals.in_progress;
    blocked = totals.blocked;
    done = totals.done;
  }

  const totalCount = todo + in_progress + blocked + done;
  const pctExact = (n: number) => (totalCount ? (n / totalCount) * 100 : 0);
  const pctDisplay = (n: number) =>
    totalCount ? Math.round((n / totalCount) * 100) : 0;

  const segments = [
    {
      key: "todo",
      label: TEXT.STATUS_TODO, // was "To-do"
      value: todo,
      cls: "bg-gray-300 dark:bg-zinc-600",
    },
    {
      key: "in_progress",
      label: TEXT.STATUS_IN_PROGRESS, // was "In-Progress"
      value: in_progress,
      cls: "bg-primary-500/90 dark:bg-primary-400/90",
    },
    {
      key: "blocked",
      label: TEXT.STATUS_FOR_APPROVAL, // was "For Approval"
      value: blocked,
      cls: "bg-amber-500/90 dark:bg-amber-400/90",
    },
    {
      key: "done",
      label: TEXT.STATUS_DONE, // was "Done"
      value: done,
      cls: "bg-emerald-500/90 dark:bg-emerald-400/90",
    },
  ].map((s) => ({
    ...s,
    pctWidth: pctExact(s.value),
    pctText: pctDisplay(s.value),
  }));

  return (
    <div className="w-full max-w-md rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 p-4 sm:p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-baseline justify-between">
        <div className="min-w-0">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white truncate">
            {title ?? TEXT.MY_TASKS} — {windowDays}
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            {rangeLabel}
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-2xl sm:text-3xl font-semibold text-primary-600 dark:text-primary-400">
            {loading ? "…" : totalCount}
          </p>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            {TEXT.TOTAL_TASKS}
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
                  style={{
                    width: `${s.pctWidth}%`,
                    minWidth: s.pctWidth ? 6 : 0,
                  }}
                  title={`${s.label}: ${s.value} (${s.pctText}%)`}
                  aria-label={`${s.label}: ${s.value} (${s.pctText}%)`}
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
                {loading ? "…" : `${s.value} (${s.pctText}%)`}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
