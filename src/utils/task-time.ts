// src/utils/task-time.ts

// Safely parse anything into a timestamp (ms). Returns 0 if invalid.
function toTime(x: unknown): number {
  if (!x) return 0;
  const n = new Date(x as any).getTime();
  return Number.isFinite(n) ? n : 0;
}

/** Pick the “freshest” timestamp for a task-like object */
export function bestTimestamp(obj: {
  updatedAt?: unknown;
  progressUpdatedAt?: unknown; // optional, if you have it
  scheduledDate?: unknown;
  createdAt?: unknown;
}): number {
  return Math.max(
    toTime(obj.updatedAt),
    toTime(obj.progressUpdatedAt),
    toTime(obj.scheduledDate),
    toTime(obj.createdAt)
  );
}

/** “2h ago” style label. Falls back to locale date for older items. */
export function timeAgoFrom(ts: number, now = Date.now()): string {
  if (!ts) return "-";
  const diff = Math.max(0, now - ts);
  const s = Math.floor(diff / 1000);
  if (s < 45) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(ts).toLocaleDateString();
}

/** Convenience: returns a *new* array sorted by latest first */
export function sortByLatest<T>(
  arr: T[],
  selector: (x: T) => number = (x) => bestTimestamp(x as any)
) {
  return [...arr].sort((a, b) => selector(b) - selector(a));
}
