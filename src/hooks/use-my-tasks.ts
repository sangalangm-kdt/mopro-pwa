import { useMemo } from "react";
import { bucketTasksByDay } from "@/utils/task-buckets";
import { mapAssignedToTasks } from "@/utils/map-assigned-to-tasks";
import { mapProgressToTasks, type MyTask } from "@/utils/map-progress-to-tasks";

type UseMyTasksInput = {
  userId?: number | string;
  progressUpdates: any[] | undefined;
  productUserAssigns: any[] | undefined;
  dayKeys: string[];
  isLoadingProgress?: boolean;
  isLoadingAssign?: boolean;
};

const keyFor = (t: MyTask) => t.lineNumber ?? String(t.id);

const mergePreferNewest = (a: MyTask[], b: MyTask[]) => {
  const map = new Map<string, MyTask>();
  for (const t of a) map.set(keyFor(t), t);
  for (const t of b) {
    const k = keyFor(t);
    const prev = map.get(k);
    if (!prev) {
      map.set(k, t);
      continue;
    }
    const newer =
      new Date(t.scheduledDate).getTime() >=
      new Date(prev.scheduledDate).getTime();
    map.set(k, newer ? t : prev);
  }
  return [...map.values()];
};

export function useMyTasks({
  userId,
  progressUpdates,
  productUserAssigns,
  dayKeys,
  isLoadingProgress,
  isLoadingAssign,
}: UseMyTasksInput) {
  // 1) Map progress -> MyTask[]
  const tasksFromProgress = useMemo(
    () => mapProgressToTasks((progressUpdates ?? []) as any[], userId),
    [progressUpdates, userId]
  );

  // 2) Map /api/product-user-assignment rows -> AssignedItem[]
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

  // 3) Assigned -> MyTask[]
  const baseAssignedTasks = useMemo(
    () => mapAssignedToTasks(assignedItems as any[], userId),
    [assignedItems, userId]
  );

  // 4) Ensure todos land inside the current window (so they show)
  const normalizedAssignedTasks = useMemo(() => {
    const daySet = new Set(dayKeys); // YYYY-MM-DD keys
    return baseAssignedTasks.map((t) => {
      const key = new Date(t.scheduledDate).toLocaleDateString("en-CA");
      if (t.status === "todo" && !daySet.has(key)) {
        return { ...t, scheduledDate: new Date().toISOString() };
      }
      return t;
    });
  }, [baseAssignedTasks, dayKeys]);

  // 5) Merge preferring newest record
  const myTasks = useMemo(
    () => mergePreferNewest(normalizedAssignedTasks, tasksFromProgress),
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
