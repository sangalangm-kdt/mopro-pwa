import { useMemo } from "react";
import { bucketTasksByDay } from "@/utils/task-buckets";
import { mapAssignedToTasks } from "@/utils/map-assigned-to-tasks";
import { mapProgressToTasks, type MyTask } from "@/utils/map-progress-to-tasks";

type UseMyTasksInput = {
  userId?: number | string;
  progressRows: any[] | undefined; // ← from useProgress().progress
  productUserAssigns: any[] | undefined;
  dayKeys: string[];
  isLoadingProgress?: boolean;
  isLoadingAssign?: boolean;
};

// ---------- helpers ----------
const norm = (x: any) => String(x ?? "").trim();

// Robust key: productId → product.id → lineNumber → product.lineNumber → id
const keyFor = (t: MyTask) => {
  const pid = (t as any).productId ?? (t as any).product?.id ?? null;
  if (pid != null) return `pid:${norm(pid)}`;
  const ln = (t as any).lineNumber ?? (t as any).product?.lineNumber ?? null;
  if (ln != null) return `ln:${norm(ln)}`;
  return `id:${norm((t as any).id)}`;
};

const toTime = (x: any) => {
  const n = new Date(x ?? 0).getTime();
  return Number.isFinite(n) ? n : 0;
};

// Only for progress recency (do NOT include scheduledDate)
const progressTs = (o: any) =>
  Math.max(
    toTime(o?.progressUpdatedAt),
    toTime(o?.updatedAt),
    toTime(o?.createdAt)
  );

// Merge: progress wins except when pending approval
const mergePreferProgressRespectApproval = (
  assigned: MyTask[],
  progress: MyTask[]
) => {
  const byKey = new Map<string, MyTask>();
  const appliedTs = new Map<string, number>(); // latest applied progress ts per key

  for (const a of assigned) {
    const k = keyFor(a);
    byKey.set(k, a);
    appliedTs.set(k, -Infinity);
  }

  // order doesn't matter due to ts guard, but keep desc for readability
  const sortedProgress = [...progress].sort(
    (a, b) => progressTs(b) - progressTs(a)
  );

  for (const p of sortedProgress) {
    const k = keyFor(p);
    const prev = byKey.get(k);
    const ts = progressTs(p);
    const prevTs = appliedTs.get(k) ?? -Infinity;

    if (!prev) {
      // no assigned baseline, still accept but guard by ts
      if (ts >= prevTs) {
        byKey.set(k, p);
        appliedTs.set(k, ts);
      }
      continue;
    }

    // apply only if this progress is newer than what's already applied
    if (ts < prevTs) continue;

    const isPending = (p as any).forApproval === true;

    const isNum = (x: any): x is number =>
      typeof x === "number" && Number.isFinite(x);
    const pPercent = (p as any).percent;
    const prevPercent = isNum(prev.percent)
      ? prev.percent
      : isNum(prev.product?.percent)
      ? (prev.product as any).percent
      : null;

    const nextPercent = isPending
      ? prevPercent ?? (isNum(pPercent) ? pPercent : null)
      : isNum(pPercent)
      ? pPercent
      : prevPercent ?? null;

    const nextStatus = isPending ? prev.status : p.status ?? prev.status;

    byKey.set(k, {
      ...prev, // keep assigned baseline (dates, etc.)
      ...p, // overlay progress fields
      percent: nextPercent ?? undefined,
      status: nextStatus,
      product: {
        ...(prev.product ?? {}),
        ...(p as any).product,
        percent: nextPercent ?? undefined,
      },
      // keep schedule stable if prev has it
      scheduledDate: prev.scheduledDate || (p as any).scheduledDate,
    });

    appliedTs.set(k, ts);
  }

  return [...byKey.values()];
};

export function useMyTasks({
  userId,
  progressRows,
  productUserAssigns,
  dayKeys,
  isLoadingProgress,
  isLoadingAssign,
}: UseMyTasksInput) {
  // 1) Progress → MyTask[]
  const tasksFromProgress = useMemo(
    () => mapProgressToTasks((progressRows ?? []) as any[], userId),
    [progressRows, userId]
  );

  // 2) Map /api/product-user-assignment rows → AssignedItem[]
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

  // 3) Assigned → MyTask[]
  const baseAssignedTasks = useMemo(
    () => mapAssignedToTasks(assignedItems as any[], userId),
    [assignedItems, userId]
  );

  // 4) Ensure todos land inside the window so they show up
  const normalizedAssignedTasks = useMemo(() => {
    const daySet = new Set(dayKeys); // YYYY-MM-DD
    return baseAssignedTasks.map((t) => {
      const key = new Date(t.scheduledDate).toLocaleDateString("en-CA");
      if (t.status === "todo" && !daySet.has(key)) {
        return { ...t, scheduledDate: new Date().toISOString() };
      }
      return t;
    });
  }, [baseAssignedTasks, dayKeys]);

  // 5) Merge with approval-aware rules
  const myTasks = useMemo(
    () =>
      mergePreferProgressRespectApproval(
        normalizedAssignedTasks,
        tasksFromProgress
      ),
    [normalizedAssignedTasks, tasksFromProgress]
  );

  // 6) Bucket + aggregates + flat list
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

  const loading = !!(isLoadingProgress || isLoadingAssign);

  return { tasksFromProgress, myTasks, buckets, totals, list, loading };
}
