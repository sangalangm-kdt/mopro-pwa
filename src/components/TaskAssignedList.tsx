import { useMemo, useState } from "react";
import type { MyTask } from "@/utils/map-progress-to-tasks";
import { useLocalizedText } from "@/utils/localized-text";
import { HOME_TEXT_KEYS } from "@constants/index";
import {
  cx,
  groupKeyComposite as groupKey,
  getLnRaw,
  itemTs,
  toTime,
  extractProcessName,
  isApproved,
  makeProgressIndexRich,
} from "@/utils/home-helpers";

/* =====================================================================================
 * Types
 * ===================================================================================== */

type Props = {
  tasks: MyTask[];
  progressTasks?: MyTask[];
  assignedKeys?: Set<string>;
  loading?: boolean;
  emptyText?: string; // optional override
  onOpen?: (task: MyTask) => void;
};

type FilterKey =
  | "all"
  | "for_approval"
  | "in_progress"
  | "todo"
  | "done"
  | "assigned_only";

/* =====================================================================================
 * UI tokens
 * ===================================================================================== */

const STATUS_CHIP: Record<MyTask["status"] | "blocked", string> = {
  todo: "bg-gray-200 text-gray-800 dark:bg-zinc-700/70 dark:text-gray-100 border border-gray-300/60 dark:border-zinc-600/60",
  in_progress:
    "bg-lime-100 text-lime-800 dark:bg-lime-900/40 dark:text-lime-100 border border-primary-200/70 dark:border-primary-800/60",
  blocked:
    "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border border-amber-200/70 dark:border-amber-800/60",
  done: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border border-emerald-200/70 dark:border-emerald-800/60",
};

/* =====================================================================================
 * Component
 * ===================================================================================== */

export default function MyTasksAssignedList({
  tasks,
  progressTasks,
  assignedKeys,
  loading,
  emptyText,
  onOpen,
}: Props) {
  const TEXT = useLocalizedText("common", HOME_TEXT_KEYS);
  const [filter] = useState<FilterKey>("all");

  const progressIdx = useMemo(
    () => makeProgressIndexRich(progressTasks as any),
    [progressTasks]
  );

  // 1) Merge redundants by composite identity
  type Row = { task: MyTask; processes: string[] };
  const mergedRows: Row[] = useMemo(() => {
    const groups = new Map<string, MyTask[]>();
    for (const t of tasks ?? []) {
      const k = groupKey(t);
      const arr = groups.get(k);
      if (arr) arr.push(t);
      else groups.set(k, [t]);
    }

    const score = (t: MyTask) => {
      const hasProg = (progressIdx as any).has(t) ? 1 : 0;
      const ts = Math.max(
        itemTs(t as any),
        toTime((progressIdx as any).updatedAt(t))
      );
      return hasProg * 1e12 + ts;
    };

    const out: Row[] = [];
    for (const [, arr] of groups) {
      let best = arr[0];
      for (const x of arr) if (score(x) >= score(best)) best = x;

      const set = new Set<string>();
      for (const x of arr) {
        const a = extractProcessName(x as any);
        if (a) set.add(a);
        const pr: any = (progressIdx as any).get(x);
        const b = extractProcessName(pr);
        if (b) set.add(b);
      }

      out.push({ task: best, processes: Array.from(set) });
    }

    return out;
  }, [tasks, progressIdx]);

  // 2) Filter
  const filteredRows = useMemo(() => {
    let base = mergedRows;
    switch (filter) {
      case "for_approval":
        base = base.filter((r) => (progressIdx as any).forApproval(r.task));
        break;
      case "in_progress":
      case "todo":
      case "done":
        base = base.filter((r) => r.task.status === filter);
        break;
      case "assigned_only":
        base = base.filter((r) => assignedKeys?.has(groupKey(r.task)));
        break;
      case "all":
      default:
        break;
    }
    return base;
  }, [mergedRows, filter, assignedKeys, progressIdx]);

  // 3) Strict dedupe: if two rows would render identical, keep one
  const rows = useMemo(() => {
    const seen = new Set<string>();
    const out: Row[] = [];
    for (const r of filteredRows) {
      const t = r.task as any;
      const title =
        (progressIdx as any).productName(t) ??
        t?.title ??
        t?.product?.name ??
        t?.product?.productList?.name ??
        t?.name ??
        getLnRaw(t) ??
        TEXT.ASSIGNED_ITEM_FALLBACK;

      const ln = String(getLnRaw(t) ?? "").trim();
      const proj = String(
        t?.projectName ?? t?.product?.project?.name ?? t?.project?.name ?? ""
      ).trim();
      const procs = [...r.processes].sort().join("|");
      const pending = (progressIdx as any).forApproval(t) ? "1" : "0";
      const p = (progressIdx as any).percent(t);
      const pct =
        typeof p === "number"
          ? String(Math.round(Math.max(0, Math.min(100, p))))
          : "";
      const updated = String((progressIdx as any).updatedAt(t) ?? "");

      const sig = [
        title.trim().toLowerCase(),
        ln.toLowerCase(),
        proj.toLowerCase(),
        procs.toLowerCase(),
        pending,
        pct,
        updated,
      ].join("~");

      if (!seen.has(sig)) {
        seen.add(sig);
        out.push(r);
      }
    }
    return out;
  }, [filteredRows, progressIdx, TEXT.ASSIGNED_ITEM_FALLBACK]);

  /* =====================================================================================
   * Render
   * ===================================================================================== */

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
        {emptyText ?? TEXT.TASKS_EMPTY}
      </div>
    );
  }

  return (
    <div className="w-full max-w-md space-y-2">
      <ul className="space-y-2">
        {rows.length === 0 ? (
          <li className="text-sm text-gray-600 dark:text-gray-300 px-1 py-2">
            {TEXT.NO_TASKS_MATCH_FILTER}
          </li>
        ) : null}

        {rows.map(({ task: t, processes }) => {
          const id =
            (t as any).id ??
            `${(t as any).assigneeId}-${(t as any).scheduledDate ?? ""}-${
              (t as any).lineNumber ?? ""
            }`;

          const titleFromProgress = (progressIdx as any).productName(t);
          const fallbackTitle =
            (t as any).title ??
            (t as any).product?.name ??
            (t as any).product?.productList?.name ??
            (t as any).name ??
            getLnRaw(t) ??
            TEXT.ASSIGNED_ITEM_FALLBACK;
          const title = titleFromProgress ?? fallbackTitle;

          const lineNumber = getLnRaw(t);
          const projectName =
            (t as any).projectName ??
            (t as any).product?.project?.name ??
            (t as any).project?.name;

          const updatedAt = (progressIdx as any).updatedAt(t);
          const updatedStr = updatedAt
            ? new Date(updatedAt).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                weekday: "short",
              })
            : null;

          // percent (always visible)
          const p = (progressIdx as any).percent(t);
          const pct =
            typeof p === "number"
              ? `${Math.round(Math.max(0, Math.min(100, p)))}%`
              : null;

          // approval-driven chip
          const pr = (progressIdx as any).get(t);
          const approved = isApproved(pr) || isApproved(t);
          const pending =
            !approved &&
            ((pr as any)?.forApproval === true ||
              (t as any).forApproval === true);

          const effectiveStatus: MyTask["status"] = pending
            ? "blocked"
            : t.status === "blocked"
            ? "in_progress"
            : t.status;

          const chipStatus = effectiveStatus as MyTask["status"] | "blocked";
          const label = pending
            ? TEXT.STATUS_FOR_APPROVAL
            : (t.status === "todo" && TEXT.STATUS_TODO) ||
              (t.status === "in_progress" && TEXT.STATUS_IN_PROGRESS) ||
              (t.status === "done" && TEXT.STATUS_DONE) ||
              TEXT.STATUS_UNKNOWN;

          return (
            <li key={String(id)}>
              <button
                type="button"
                onClick={() => onOpen?.(t)}
                className={cx(
                  "w-full text-left rounded-xl border",
                  "border-gray-200 dark:border-zinc-700",
                  "bg-white dark:bg-zinc-900",
                  "px-3.5 py-3",
                  "transition-colors",
                  "hover:bg-gray-50 dark:hover:bg-zinc-800/60",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
                  "active:opacity-95"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  {/* Left */}
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
                      {title}
                    </div>

                    <div className="mt-1 text-[12px] text-gray-600 dark:text-gray-300 flex flex-wrap gap-x-2 gap-y-0.5">
                      {lineNumber && (
                        <span className="font-mono">
                          {TEXT.LABEL_DRAWING}:{" "}
                          <span className="font-semibold">{lineNumber}</span>
                        </span>
                      )}
                      {projectName && (
                        <span className="truncate">
                          • {TEXT.LABEL_PROJECT}:{" "}
                          <span className="font-medium">{projectName}</span>
                        </span>
                      )}
                    </div>

                    {(processes.length || updatedStr) && (
                      <div className="mt-1 text-[12px] text-gray-600 dark:text-gray-300 flex flex-wrap gap-x-2 gap-y-0.5">
                        {processes.length ? (
                          <span>
                            {TEXT.LABEL_PROCESSES}:{" "}
                            <span className="font-medium">
                              {processes.join(", ")}
                            </span>
                          </span>
                        ) : null}
                        {updatedStr && (
                          <span>
                            • {TEXT.LABEL_UPDATED}: {updatedStr}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Right */}
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span
                      className={cx(
                        "px-2 py-0.5 rounded-full text-[11px] leading-5",
                        STATUS_CHIP[chipStatus]
                      )}
                      title={label}
                      aria-label={label}
                    >
                      {label}
                    </span>

                    {pct ? (
                      <span className="px-2 py-0.5 rounded-full text-[11px] leading-5 bg-gray-100 dark:bg-zinc-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-zinc-700">
                        {pct}
                      </span>
                    ) : null}
                  </div>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
