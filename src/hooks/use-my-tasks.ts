import { useMemo } from "react";
import { bucketTasksByDay } from "@/utils/task-buckets";
import { mapAssignedToTasks } from "@/utils/map-assigned-to-tasks";
import { mapProgressToTasks, type MyTask } from "@/utils/map-progress-to-tasks";

type UseMyTasksInput = {
  userId?: number | string;
  progressRows: any[] | undefined; // from useProgress().progress
  productUserAssigns: any[] | undefined;
  dayKeys: string[]; // list of YYYY-MM-DD strings in the current window
  isLoadingProgress?: boolean;
  isLoadingAssign?: boolean;
};

/* ---------------- helpers (kept simple) ---------------- */

const str = (x: any) => String(x ?? "").trim();

const keyFor = (t: any) => {
  // Prefer drawing/line number. Fall back to productId, then id.
  const ln =
    t?.lineNumber ?? t?.product?.lineNumber ?? t?.drawingNumber ?? null;
  if (ln != null) return `ln:${str(ln)}`;
  const pid = t?.productId ?? t?.product?.id ?? null;
  if (pid != null) return `pid:${str(pid)}`;
  return `id:${str(t?.id)}`;
};

const time = (x: any) => {
  const n = new Date(x ?? 0).getTime();
  return Number.isFinite(n) ? n : 0;
};

const progressTime = (o: any) =>
  Math.max(time(o?.progressUpdatedAt), time(o?.updatedAt), time(o?.createdAt));

/** Robust approval detector (camelCase + snake_case + numeric approved_by) */
const isApproved = (o: any): boolean => {
  if (!o) return false;
  const rawApprovedBy = o.approvedBy ?? o.approved_by ?? null; // may be object or number
  const rawApprovedById =
    o.approvedById ??
    o.approved_by_id ??
    (typeof rawApprovedBy === "object" && rawApprovedBy
      ? rawApprovedBy.id
      : rawApprovedBy);

  const approvedById =
    Number.isFinite(+rawApprovedById) && +rawApprovedById > 0
      ? +rawApprovedById
      : null;

  const approvedAt = o.approvedAt ?? o.approved_at ?? null;
  const approvedFlag = o.approved === true;

  return approvedFlag || approvedById != null || approvedAt != null;
};

/** Merge progress over assigned using approval fields.
 *  - forApproval = !approved
 *  - status: pending → "blocked"; approved → "in_progress" (unless done)
 *  - always take latest progress.percent and keep assigned scheduledDate
 */
function mergeAssignedWithProgress(assigned: MyTask[], progress: MyTask[]) {
  const byKey: Record<string, MyTask> = {};
  const latestAt: Record<string, number> = {};

  // seed with assigned baseline
  for (const a of assigned) {
    const k = keyFor(a as any);
    byKey[k] = a;
    latestAt[k] = -Infinity;
  }

  // apply progress rows
  for (const p of progress) {
    const k = keyFor(p as any);
    const ts = progressTime(p as any);
    const prev = byKey[k];

    const pct =
      typeof (p as any).percent === "number" ? (p as any).percent : undefined;

    const approved = isApproved(p);
    const pending = !approved;

    // compute next status
    let nextStatus: MyTask["status"];
    if (pending) {
      nextStatus = "blocked";
    } else if (
      (p as any).status === "done" ||
      (typeof pct === "number" && pct >= 100)
    ) {
      nextStatus = "done";
    } else {
      // approved but not done → show in_progress
      nextStatus = "in_progress";
    }

    if (!prev) {
      // standalone progress (no assigned row)
      byKey[k] = {
        ...(p as MyTask),
        percent: pct,
        product: { ...(p as any).product, percent: pct },
        status: nextStatus,
        forApproval: pending,
      };
      latestAt[k] = ts;
      continue;
    }

    // only apply if this progress is newer than what we've applied before
    if (ts < (latestAt[k] ?? -Infinity)) continue;

    byKey[k] = {
      ...prev, // keep assigned baseline (e.g., scheduledDate)
      ...(p as any), // overlay progress fields (title, product info, etc.)
      percent: pct, // latest percent wins
      status: nextStatus,
      product: {
        ...(prev.product ?? {}),
        ...(p as any).product,
        percent: pct,
      },
      // keep assigned schedule stable if available
      scheduledDate: prev.scheduledDate || (p as any).scheduledDate,
      forApproval: pending,
    };

    latestAt[k] = ts;
  }

  return Object.values(byKey);
}

/* ---------------- main hook ---------------- */

export function useMyTasks({
  userId,
  progressRows,
  productUserAssigns,
  dayKeys,
  isLoadingProgress,
  isLoadingAssign,
}: UseMyTasksInput) {
  /** 1) progress rows → tasks */
  const tasksFromProgress = useMemo(
    () => mapProgressToTasks((progressRows ?? []) as any[], userId),
    [progressRows, userId]
  );

  /** 2) assignment rows → AssignedItem[] (flatten minimal fields we need) */
  const assignedItems = useMemo(() => {
    const rows = Array.isArray(productUserAssigns) ? productUserAssigns : [];
    return rows.map((r: any, i: number) => {
      const product = r.product ?? {};
      const project = product.project ?? r.project ?? {};
      return {
        id: r.id ?? product.id ?? `assign-${i}`,
        assigneeId:
          r.assigneeId ?? r.userId ?? r.user?.id ?? product.assigneeId,
        lineNumber: product.lineNumber ?? r.lineNumber,
        percent:
          typeof product.percent === "number"
            ? product.percent
            : typeof r.percent === "number"
            ? r.percent
            : 0,
        updatedAt: r.updatedAt ?? product.updatedAt ?? r.assignedAt,
        createdAt: r.createdAt ?? product.createdAt ?? r.assignedAt,
        productList: { name: product.productList?.name ?? r.productList?.name },
        project: { name: project.name },
        currentProcess:
          product.currentProcess ??
          r.process?.processList?.name ??
          r.process?.name,
      };
    });
  }, [productUserAssigns]);

  /** 3) AssignedItem[] → MyTask[] */
  const assignedTasks = useMemo(
    () => mapAssignedToTasks(assignedItems as any[], userId),
    [assignedItems, userId]
  );

  /** 4) Keep todos inside the current window so they show */
  const windowedAssignedTasks = useMemo(() => {
    const daySet = new Set(dayKeys); // YYYY-MM-DD
    return assignedTasks.map((t) => {
      const key = new Date(t.scheduledDate).toLocaleDateString("en-CA");
      if (t.status === "todo" && !daySet.has(key)) {
        return { ...t, scheduledDate: new Date().toISOString() };
      }
      return t;
    });
  }, [assignedTasks, dayKeys]);

  /** 5) Merge progress onto assignments (respect approval) */
  const myTasks = useMemo(
    () => mergeAssignedWithProgress(windowedAssignedTasks, tasksFromProgress),
    [windowedAssignedTasks, tasksFromProgress]
  );

  /** 6) Buckets, totals, flat list */
  const buckets = useMemo(
    () => bucketTasksByDay(myTasks, dayKeys, userId),
    [myTasks, dayKeys, userId]
  );

  const totals = useMemo(() => {
    let todo = 0,
      in_progress = 0,
      blocked = 0,
      done = 0,
      all = 0;
    for (const [, b] of buckets) {
      todo += b.counts.todo;
      in_progress += b.counts.in_progress;
      blocked += b.counts.blocked;
      done += b.counts.done;
      all += b.tasks.length;
    }
    return { todo, in_progress, blocked, done, all };
  }, [buckets]);

  const list = useMemo(() => {
    const out: MyTask[] = [];
    for (const [, b] of buckets) out.push(...b.tasks);
    return out.sort(
      (a, b) =>
        new Date(b.scheduledDate).getTime() -
        new Date(a.scheduledDate).getTime()
    );
  }, [buckets]);

  /** Useful for “Assigned” filter/badge */
  const assignedKeys = useMemo(
    () => new Set(assignedTasks.map((t) => keyFor(t))),
    [assignedTasks]
  );

  const loading = !!(isLoadingProgress || isLoadingAssign);

  return {
    tasksFromProgress, // latest progress-as-tasks
    assignedKeys, // keys for items that were explicitly assigned
    myTasks, // merged result (before any UI dedupe/grouping)
    buckets,
    totals,
    list,
    loading,
  };
}
