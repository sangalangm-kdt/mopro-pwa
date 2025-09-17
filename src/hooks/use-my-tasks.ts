import { useMemo } from "react";
import { bucketTasksByDay } from "@/utils/task-buckets";
import { mapAssignedToTasks } from "@/utils/map-assigned-to-tasks";
import { mapProgressToTasks, type MyTask } from "@/utils/map-progress-to-tasks";

type UseMyTasksInput = {
  userId?: number | string;
  /** legacy prop name (still supported) */
  progressUpdates?: any[] | undefined;
  /** preferred: from useProgress().progress */
  progressRows?: any[] | undefined;
  productUserAssigns?: any[] | undefined;
  dayKeys: string[];
  isLoadingProgress?: boolean;
  isLoadingAssign?: boolean;
};

/* ---------------- helpers (kept simple) ---------------- */

const str = (x: any) => String(x ?? "").trim();

const keyFor = (t: any) => {
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
  const rawApprovedBy = o.approvedBy ?? o.approved_by ?? null;
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

/** Merge progress over assigned using approval fields. */
function mergeAssignedWithProgress(assigned: MyTask[], progress: MyTask[]) {
  const byKey: Record<string, MyTask> = {};
  const latestAt: Record<string, number> = {};

  for (const a of assigned) {
    const k = keyFor(a as any);
    byKey[k] = a;
    latestAt[k] = -Infinity;
  }

  for (const p of progress) {
    const k = keyFor(p as any);
    const ts = progressTime(p as any);
    const prev = byKey[k];

    const pct =
      typeof (p as any).percent === "number" ? (p as any).percent : undefined;

    const approved = isApproved(p);
    const pending = !approved;

    let nextStatus: MyTask["status"];
    if (pending) {
      nextStatus = "blocked";
    } else if (
      (p as any).status === "done" ||
      (typeof pct === "number" && pct >= 100)
    ) {
      nextStatus = "done";
    } else {
      nextStatus = "in_progress";
    }

    if (!prev) {
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

    if (ts < (latestAt[k] ?? -Infinity)) continue;

    byKey[k] = {
      ...prev,
      ...(p as any),
      percent: pct,
      status: nextStatus,
      product: {
        ...(prev.product ?? {}),
        ...(p as any).product,
        percent: pct,
      },
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
  progressUpdates, // legacy
  productUserAssigns,
  dayKeys,
  isLoadingProgress,
  isLoadingAssign,
}: UseMyTasksInput) {
  /** Support both legacy (progressUpdates) and new (progressRows) */
  const progressInput = progressRows ?? progressUpdates ?? [];

  /** 1) progress rows → tasks */
  const tasksFromProgress = useMemo(
    () => mapProgressToTasks(progressInput as any[], userId),
    [progressInput, userId]
  );

  /** 2) assignment rows → AssignedItem[] */
  const assignedItems = useMemo(() => {
    const rows = Array.isArray(productUserAssigns) ? productUserAssigns : [];
    return rows.map((r: any, i: number) => {
      const product = r.product ?? {};
      const project = product.project ?? r.project ?? {};
      return {
        id: r.id ?? product.id ?? `assign-${i}`,
        // include snake_case fallback
        assigneeId:
          r.assigneeId ??
          r.userId ??
          r.user_id ??
          r.user?.id ??
          product.assigneeId,
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
    const daySet = new Set(dayKeys);
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

  const assignedKeys = useMemo(
    () => new Set(assignedTasks.map((t) => keyFor(t))),
    [assignedTasks]
  );

  const loading = !!(isLoadingProgress || isLoadingAssign);

  return {
    tasksFromProgress,
    assignedKeys,
    myTasks,
    buckets,
    totals,
    list,
    loading,
  };
}
