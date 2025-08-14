// src/utils/progress-summary.ts

export type ProgressUpdate = {
  percent?: number;
  createdAt?: string | number | Date;
  updatedAt?: string | number | Date;
  timestamp?: string | number | Date;
};

export type TwoWeekBar = {
  key: string; // YYYY-MM-DD
  date: Date;
  labelTop: string; // "Aug"
  labelBottom: string; // "12"
  pct: number; // 0–100
};

export type TwoWeekSummary = {
  bars: TwoWeekBar[];
  avgPercent: number;
  rangeStart: Date;
  rangeEnd: Date;
};

const dateKey = (d: Date) => d.toLocaleDateString("en-CA");

const parseDate = (u: ProgressUpdate) => {
  const raw = u.updatedAt ?? u.createdAt ?? u.timestamp;
  if (!raw) return null;
  const d = new Date(raw);
  return isNaN(d.getTime()) ? null : d;
};

/** Generic builder for any N-day window (e.g., 15 or 30). */
export function buildPeriodSummary(
  updates: ProgressUpdate[] = [],
  daysWindow: 15 | 30
): TwoWeekSummary {
  const today = new Date();

  const days: { key: string; date: Date }[] = [];
  for (let i = daysWindow - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    days.push({ key: dateKey(d), date: d });
  }

  const map = new Map<string, { sum: number; count: number }>();
  for (const u of updates) {
    const d = parseDate(u);
    if (!d || typeof u.percent !== "number") continue;
    const k = dateKey(d);
    const v = map.get(k) ?? { sum: 0, count: 0 };
    v.sum += Math.min(100, Math.max(0, u.percent));
    v.count += 1;
    map.set(k, v);
  }

  const bars: TwoWeekBar[] = days.map(({ key, date }) => {
    const agg = map.get(key);
    const pct = agg && agg.count ? Math.round(agg.sum / agg.count) : 0;
    return {
      key,
      date,
      labelTop: date.toLocaleDateString(undefined, { month: "short" }),
      labelBottom: date.toLocaleDateString(undefined, { day: "2-digit" }),
      pct,
    };
  });

  const avgPercent = bars.reduce((s, b) => s + b.pct, 0) / (bars.length || 1);

  return {
    bars,
    avgPercent,
    rangeStart: days[0].date,
    rangeEnd: days[days.length - 1].date,
  };
}

/** Convenience wrappers */
export const buildFifteenDaySummary = (u: ProgressUpdate[]) =>
  buildPeriodSummary(u, 15);

export const buildThirtyDaySummary = (u: ProgressUpdate[]) =>
  buildPeriodSummary(u, 30);

/** Keep your existing filter util */
export function filterUpdatesByDateKey(
  updates: ProgressUpdate[] | undefined,
  dayKey: string | null
): ProgressUpdate[] {
  if (!updates || !dayKey) return updates ?? [];
  return updates.filter((u) => {
    const d = parseDate(u);
    return d && dateKey(d) === dayKey;
  });
}

/** Back-compat if you still import this name */
export const buildTwoWeekSummary = (u: ProgressUpdate[]) =>
  buildPeriodSummary(u, 14 as any); // not used, but safe alias
