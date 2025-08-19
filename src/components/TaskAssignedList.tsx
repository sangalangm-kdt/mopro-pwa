import { useMemo, useState } from "react";
import type { MyTask } from "@/utils/map-progress-to-tasks";

type Props = {
  tasks: MyTask[];
  progressTasks?: MyTask[];
  assignedKeys?: Set<string>;
  loading?: boolean;
  emptyText?: string;
  onOpen?: (task: MyTask) => void;
};

/* ---------------- helpers ---------------- */

const norm = (x: any) => String(x ?? "").trim();
const normLn = (x: any) =>
  norm(x)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

const getPid = (t: any) => t?.productId ?? t?.product?.id ?? null;
const getLnRaw = (t: any) =>
  t?.lineNumber ?? t?.product?.lineNumber ?? t?.drawingNumber ?? null;
const getLn = (t: any) => {
  const raw = getLnRaw(t);
  return raw ? normLn(raw) : null;
};

// Composite grouping key: pid + normalized lineNumber (pid-only and ln-only collapse)
const groupKey = (t: MyTask) => {
  const pid = getPid(t as any);
  const ln = getLn(t as any);
  const pidPart = pid != null ? `pid:${norm(pid)}` : "";
  const lnPart = ln ? `ln:${ln}` : "";
  const composite = [pidPart, lnPart].filter(Boolean).join("|");
  return composite || `id:${norm((t as any).id)}`;
};

const toTime = (x: any) => {
  const n = new Date(x ?? 0).getTime();
  return Number.isFinite(n) ? n : 0;
};
const itemTs = (t: any) =>
  Math.max(
    toTime(t?.progressUpdatedAt),
    toTime(t?.updatedAt),
    toTime(t?.scheduledDate),
    toTime(t?.createdAt)
  );

function extractProcessName(t: any): string | null {
  return (
    t?.processName ??
    t?.product?.currentProcess ??
    t?.currentProcess ??
    t?.process?.name ??
    t?.process?.processList?.name ??
    null
  );
}

const isApproved = (o: any) =>
  o?.approvedById != null ||
  (o?.approvedBy && o.approvedBy.id != null) ||
  o?.approvedAt != null ||
  o?.approved === true;

/** Progress index: match by pid OR normalized ln; latest row per key */
function createProgressIndex(progressTasks?: MyTask[]) {
  const byPid = new Map<string, MyTask>();
  const byLn = new Map<string, MyTask>();

  const upsert = (
    map: Map<string, MyTask>,
    key: any,
    row: MyTask,
    normalizer: (v: any) => string
  ) => {
    const k = normalizer(key);
    if (!k) return;
    const prev = map.get(k);
    if (!prev || itemTs(row as any) >= itemTs(prev as any)) map.set(k, row);
  };

  const nz = (v: any) => (v == null ? "" : String(v).trim().toLowerCase());
  for (const p of progressTasks ?? []) {
    upsert(byPid, getPid(p as any), p, nz);
    upsert(byLn, getLnRaw(p as any), p, normLn);
  }

  const get = (t: MyTask): MyTask | undefined => {
    const pid = getPid(t as any);
    const ln = getLn(t as any);
    return (
      (pid != null && byPid.get(nz(pid))) || (ln ? byLn.get(ln) : undefined)
    );
  };

  return {
    get,
    has: (t: MyTask) => !!get(t),
    forApproval: (t: MyTask) => {
      const row = get(t) as any;
      if (!row) return false;
      return !isApproved(row) && row?.forApproval === true;
    },
    percent: (t: MyTask): number | null => {
      const row = get(t) as any;
      return typeof row?.percent === "number" ? row.percent : null;
    },
    updatedAt: (t: MyTask) => {
      const row = get(t) as any;
      return row?.progressUpdatedAt ?? row?.updatedAt ?? row?.createdAt ?? null;
    },
    productName: (t: MyTask) => {
      const row = get(t) as any;
      return row?.product?.name ?? row?.title ?? null;
    },
  };
}

/* ---------------- UI styles ---------------- */

const STATUS_CHIP: Record<MyTask["status"] | "blocked", string> = {
  todo: "bg-gray-200 text-gray-800 dark:bg-zinc-700/70 dark:text-gray-100 border border-gray-300/60 dark:border-zinc-600/60",
  in_progress:
    "bg-lime-100 text-lime-800 dark:bg-lime-900/40 dark:text-lime-100 border border-primary-200/70 dark:border-primary-800/60",
  blocked:
    "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border border-amber-200/70 dark:border-amber-800/60",
  done: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border border-emerald-200/70 dark:border-emerald-800/60",
};

const STATUS_LABEL: Record<MyTask["status"], string> = {
  todo: "To-do",
  in_progress: "In Progress",
  blocked: "Blocked",
  done: "Done",
};

type FilterKey =
  | "all"
  | "for_approval"
  | "in_progress"
  | "todo"
  | "done"
  | "assigned_only";

/* ---------------- component ---------------- */

export default function MyTasksAssignedList({
  tasks,
  progressTasks,
  assignedKeys,
  loading,
  emptyText = "No assigned tasks in this period.",
  onOpen,
}: Props) {
  const [filter] = useState<FilterKey>("all");

  const progressIdx = useMemo(
    () => createProgressIndex(progressTasks),
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
      const hasProg = progressIdx.has(t) ? 1 : 0;
      const ts = Math.max(itemTs(t as any), toTime(progressIdx.updatedAt(t)));
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
        const pr: any = progressIdx.get(x);
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
        base = base.filter((r) => progressIdx.forApproval(r.task));
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
        progressIdx.productName(t) ??
        t?.title ??
        t?.product?.name ??
        t?.product?.productList?.name ??
        t?.name ??
        getLnRaw(t) ??
        "Assigned item";

      const ln = norm(getLnRaw(t) ?? "");
      const proj = norm(
        t?.projectName ?? t?.product?.project?.name ?? t?.project?.name ?? ""
      );
      const procs = [...r.processes].sort().join("|");
      const pending = progressIdx.forApproval(t) ? "1" : "0";
      const p = progressIdx.percent(t);
      const pct =
        typeof p === "number"
          ? String(Math.round(Math.max(0, Math.min(100, p))))
          : "";
      const updated = String(progressIdx.updatedAt(t) ?? "");

      const sig = [
        norm(title).toLowerCase(),
        ln,
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
  }, [filteredRows, progressIdx]);

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

  /* ---- render ---- */

  return (
    <div className="w-full max-w-md space-y-2">
      <ul className="space-y-2">
        {rows.length === 0 ? (
          <li className="text-sm text-gray-600 dark:text-gray-300 px-1 py-2">
            No tasks match this filter.
          </li>
        ) : null}

        {rows.map(({ task: t, processes }) => {
          const id =
            (t as any).id ??
            `${(t as any).assigneeId}-${(t as any).scheduledDate ?? ""}-${
              (t as any).lineNumber ?? ""
            }`;

          const titleFromProgress = progressIdx.productName(t);
          const fallbackTitle =
            (t as any).title ??
            (t as any).product?.name ??
            (t as any).product?.productList?.name ??
            (t as any).name ??
            getLnRaw(t) ??
            "Assigned item";
          const title = titleFromProgress ?? fallbackTitle;

          const lineNumber = getLnRaw(t);
          const projectName =
            (t as any).projectName ??
            (t as any).product?.project?.name ??
            (t as any).project?.name;

          const updatedAt = progressIdx.updatedAt(t);
          const updatedStr = updatedAt
            ? new Date(updatedAt).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                weekday: "short",
              })
            : null;

          // percent (always visible)
          const p = progressIdx.percent(t);
          const pct =
            typeof p === "number"
              ? `${Math.round(Math.max(0, Math.min(100, p)))}%`
              : null;

          // approval-driven chip
          const pr = progressIdx.get(t);
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
            ? "For Approval"
            : STATUS_LABEL[effectiveStatus] ?? "Unknown";

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
                  {/* Left */}
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
                      {title}
                    </div>

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

                    {(processes.length || updatedStr) && (
                      <div className="mt-1 text-[12px] text-gray-600 dark:text-gray-300 flex flex-wrap gap-x-2 gap-y-0.5">
                        {processes.length ? (
                          <span>
                            Processes:{" "}
                            <span className="font-medium">
                              {processes.join(", ")}
                            </span>
                          </span>
                        ) : null}
                        {updatedStr && <span>• Updated: {updatedStr}</span>}
                      </div>
                    )}
                  </div>

                  {/* Right */}
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span
                      className={[
                        "px-2 py-0.5 rounded-full text-[11px] leading-5",
                        STATUS_CHIP[chipStatus],
                      ].join(" ")}
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
