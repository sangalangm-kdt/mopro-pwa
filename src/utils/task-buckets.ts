import type { MyTask } from "./map-progress-to-tasks";

export type TaskDot = {
  status: "todo" | "in_progress" | "blocked" | "done";
  count: number;
};

type Counts = {
  todo: number;
  in_progress: number;
  blocked: number;
  done: number;
};
type Bucket = { counts: Counts; tasks: MyTask[] };

const init = (): Counts => ({ todo: 0, in_progress: 0, blocked: 0, done: 0 });
const toKey = (d: string | Date) => new Date(d).toLocaleDateString("en-CA"); // "YYYY-MM-DD"

/**
 * Buckets tasks by provided dayKeys (YYYY-MM-DD).
 * - If currentUserId is provided, filters to that assignee only. If omitted, includes all.
 * - Normalizes each task.scheduledDate to "YYYY-MM-DD" so keys match reliably.
 */
export function bucketTasksByDay(
  tasks: MyTask[],
  dayKeys: string[],
  currentUserId?: number | string
) {
  const buckets = new Map<string, Bucket>(
    dayKeys.map((k) => [k, { counts: init(), tasks: [] }])
  );

  for (const t of tasks) {
    if (currentUserId != null && String(t.assigneeId) !== String(currentUserId))
      continue;

    const k = toKey(t.scheduledDate);
    const b = buckets.get(k);
    if (!b) continue; // task not in the requested window

    // guard unknown statuses just in case
    if (b.counts.hasOwnProperty(t.status as keyof Counts)) {
      b.counts[t.status] += 1;
    }
    b.tasks.push(t);
  }
  return buckets;
}

/** Optional: stricter typing for countsToDots (clearer than Record<string, number>) */
export const countsToDots = (c: Counts): TaskDot[] => {
  const order: TaskDot["status"][] = ["in_progress", "todo", "blocked", "done"];
  const out: TaskDot[] = [];
  for (const s of order) if (c[s] > 0) out.push({ status: s, count: c[s] });
  return out.slice(0, 3);
};

/** Helper: aggregate totals across all buckets — perfect for a single status bar */
export type TaskTotals = Counts & { all: number };

export function sumBuckets(buckets: Map<string, Bucket>): TaskTotals {
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
}

/** Helper: produce per-day numbers for a dots chart (if you ever want it) */
export function bucketsToDotCounts(
  buckets: Map<string, Bucket>,
  mode: "total" | "done" = "total"
): Record<string, number> {
  const obj: Record<string, number> = {};
  for (const [k, b] of buckets) {
    obj[k] = mode === "done" ? b.counts.done : b.tasks.length;
  }
  return obj;
}
