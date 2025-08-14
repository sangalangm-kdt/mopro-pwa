import type { MyTask } from "@/utils/map-progress-to-tasks";

type Props = {
  tasks: MyTask[];
  loading?: boolean;
  emptyText?: string;
  onOpen?: (task: MyTask) => void;
};

// status → chip styles (light + dark)
const STATUS_CHIP: Record<MyTask["status"], string> = {
  todo: "bg-gray-200 text-gray-800 dark:bg-zinc-700/70 dark:text-gray-100 border border-gray-300/60 dark:border-zinc-600/60",
  in_progress:
    "bg-primary-100 text-primary-800 dark:bg-primary-900/40 dark:text-primary-300 border border-primary-200/70 dark:border-primary-800/60",
  blocked:
    "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border border-amber-200/70 dark:border-amber-800/60",
  done: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border border-emerald-200/70 dark:border-emerald-800/60",
};

function percentLabel(task: MyTask): string | null {
  const p =
    (task as any).percent ??
    (task as any).product?.percent ??
    (task as any).progress ??
    null;
  return typeof p === "number"
    ? `${Math.round(Math.max(0, Math.min(100, p)))}%`
    : null;
}

function displayFields(t: MyTask) {
  const product = (t as any).product ?? {};
  const project = product.project ?? {};
  const productList = product.productList ?? {};

  const title =
    (t as any).title ??
    product.name ??
    productList.name ??
    (t as any).name ??
    (t as any).lineNumber ??
    "Assigned item";

  const lineNumber =
    (t as any).lineNumber ?? product.lineNumber ?? (t as any).drawingNumber;

  const projectName =
    (t as any).projectName ?? project.name ?? (t as any).project?.name;

  const processName =
    (t as any).processName ??
    product.currentProcess ??
    (t as any).currentProcess ??
    (t as any).process?.name ??
    (t as any).process?.processList?.name;

  const scheduledDate = (t as any).scheduledDate ?? (t as any).dueDate;
  const dateStr = scheduledDate
    ? new Date(scheduledDate).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        weekday: "short",
      })
    : null;

  return { title, lineNumber, projectName, processName, dateStr };
}

export default function MyTasksAssignedList({
  tasks,
  loading,
  emptyText = "No assigned tasks in this period.",
  onOpen,
}: Props) {
  if (loading) {
    return (
      <div className="w-full max-w-md space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-20 rounded-xl bg-gray-100 dark:bg-zinc-800 overflow-hidden relative"
          >
            <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-white/40 to-transparent dark:via-white/10" />
          </div>
        ))}
      </div>
    );
  }

  if (!tasks?.length) {
    return (
      <div className="w-full max-w-md text-sm text-gray-600 dark:text-gray-300">
        {emptyText}
      </div>
    );
  }

  return (
    <ul className="w-full max-w-md space-y-2">
      {tasks.map((t) => {
        const id =
          (t as any).id ??
          `${t.assigneeId}-${(t as any).scheduledDate ?? ""}-${
            (t as any).lineNumber ?? ""
          }`;
        const pct = percentLabel(t);
        const { title, lineNumber, projectName, processName, dateStr } =
          displayFields(t);

        return (
          <li key={String(id)}>
            <button
              type="button"
              onClick={() => onOpen?.(t)}
              className={[
                "w-full text-left rounded-xl border",
                "border-gray-200 dark:border-zinc-700",
                "bg-white dark:bg-zinc-900",
                "px-3.5 py-3",
                "transition-colors",
                "hover:bg-gray-50 dark:hover:bg-zinc-800/60",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
                "active:opacity-95",
              ].join(" ")}
            >
              <div className="flex items-start justify-between gap-3">
                {/* Left: text block */}
                <div className="min-w-0">
                  <div className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
                    {title}
                  </div>

                  {/* meta row */}
                  <div className="mt-1 text-[12px] text-gray-600 dark:text-gray-300 flex flex-wrap gap-x-2 gap-y-0.5">
                    {lineNumber && (
                      <span className="font-mono">
                        Drawing:{" "}
                        <span className="font-semibold">{lineNumber}</span>
                      </span>
                    )}
                    {projectName && (
                      <span className="truncate">
                        • Project:{" "}
                        <span className="font-medium">{projectName}</span>
                      </span>
                    )}
                  </div>

                  {/* process / date */}
                  {(processName || dateStr) && (
                    <div className="mt-1 text-[12px] text-gray-600 dark:text-gray-300 flex flex-wrap gap-x-2 gap-y-0.5">
                      {processName && (
                        <span>
                          Process:{" "}
                          <span className="font-medium">{processName}</span>
                        </span>
                      )}
                      {dateStr && <span>• Scheduled: {dateStr}</span>}
                    </div>
                  )}
                </div>

                {/* Right: chips */}
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span
                    className={[
                      "px-2 py-0.5 rounded-full text-[11px] leading-5",
                      STATUS_CHIP[t.status],
                    ].join(" ")}
                  >
                    {t.status.replace("_", " ")}
                  </span>
                  {pct && (
                    <span className="px-2 py-0.5 rounded-full text-[11px] leading-5 bg-gray-100 dark:bg-zinc-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-zinc-700">
                      {pct}
                    </span>
                  )}
                </div>
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
