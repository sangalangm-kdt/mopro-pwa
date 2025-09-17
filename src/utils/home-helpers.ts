// utils/home-helpers.ts (expanded shared helpers)

/* =====================================================================================
 * Types
 * ===================================================================================== */
export interface BaseRow {
  id?: string | number | null;
  productId?: string | number | null;
  product?: {
    id?: string | number | null;
    lineNumber?: string | null;
    project?: { name?: string | null } | null;
    name?: string | null;
  } | null;
  lineNumber?: string | null;
  drawingNumber?: string | null;
  title?: string | null;
  name?: string | null;
  status?: "todo" | "in_progress" | "done" | string;
  forApproval?: boolean;
  percent?: number | null;
  createdAt?: string | number | Date | null;
  updatedAt?: string | number | Date | null;
  scheduledDate?: string | number | Date | null;
  progressUpdatedAt?: string | number | Date | null;
  processName?: string | null;
  process?: {
    name?: string | null;
    processList?: { name?: string | null } | null;
  } | null;
  approvedById?: string | number | null;
  approvedBy?: { id?: string | number | null } | null;
  approvedAt?: string | number | Date | null;
  approved?: boolean | null;
  projectName?: string | null;
}

/* =====================================================================================
 * Small helpers (shared)
 * ===================================================================================== */

export function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export const norm = (x: unknown) => String(x ?? "").trim();
export const normLower = (x: unknown) => norm(x).toLowerCase();
export const normLn = (x: unknown) => normLower(x).replace(/[^a-z0-9]/g, "");

export const getPid = (t: BaseRow | any) =>
  t?.productId ?? t?.product?.id ?? null;
export const getLnRaw = (t: BaseRow | any) =>
  t?.lineNumber ?? t?.product?.lineNumber ?? t?.drawingNumber ?? null;
export const getLn = (t: BaseRow | any) => {
  const raw = getLnRaw(t);
  return raw ? normLn(raw) : null;
};

/** Simple grouping key: prefer LN, else PID, else id */
export const groupKey = (t: BaseRow | any) => {
  const ln = getLn(t);
  if (ln) return `ln:${ln}`;
  const pid = getPid(t);
  if (pid != null) return `pid:${String(pid).toLowerCase()}`;
  return `id:${norm(t?.id)}`;
};

/** Composite grouping: combine PID and LN when available */
export const groupKeyComposite = (t: BaseRow | any) => {
  const pid = getPid(t);
  const ln = getLn(t);
  const pidPart = pid != null ? `pid:${norm(pid)}` : "";
  const lnPart = ln ? `ln:${ln}` : "";
  const composite = [pidPart, lnPart].filter(Boolean).join("|");
  return composite || `id:${norm(t?.id)}`;
};

export const toTime = (x: unknown) => {
  const n = new Date((x as any) ?? 0).getTime();
  return Number.isFinite(n) ? n : 0;
};

export const itemTs = (t: BaseRow | any) =>
  Math.max(
    toTime(t?.progressUpdatedAt),
    toTime(t?.updatedAt),
    toTime(t?.scheduledDate),
    toTime(t?.createdAt)
  );

export const extractProcessName = (t: BaseRow | any): string | null =>
  t?.processName ??
  t?.product?.currentProcess ??
  t?.currentProcess ??
  t?.process?.name ??
  t?.process?.processList?.name ??
  null;

export const isApproved = (o: BaseRow | any) =>
  o?.approvedById != null ||
  (o?.approvedBy && o.approvedBy.id != null) ||
  o?.approvedAt != null ||
  o?.approved === true;

/* =====================================================================================
 * Progress index
 * ===================================================================================== */

export function makeProgressIndex(progressTasks?: BaseRow[]) {
  const byPid = new Map<string, BaseRow>();
  const byLn = new Map<string, BaseRow>();

  const nz = (v: unknown) => (v == null ? "" : String(v).trim().toLowerCase());

  const upsert = (
    map: Map<string, BaseRow>,
    key: unknown,
    row: BaseRow,
    normer: (v: unknown) => string
  ) => {
    const k = normer(key);
    if (!k) return;
    const prev = map.get(k);
    if (!prev || itemTs(row) >= itemTs(prev)) map.set(k, row);
  };

  for (const p of progressTasks ?? []) {
    upsert(byPid, getPid(p), p, nz);
    upsert(byLn, getLnRaw(p), p, normLn);
  }

  const get = (t: BaseRow) => {
    const pid = getPid(t);
    const ln = getLn(t);
    return (
      (pid != null && byPid.get(nz(pid))) || (ln ? byLn.get(ln) : undefined)
    );
  };

  return {
    get,
    has: (t: BaseRow) => !!get(t),
    forApproval: (t: BaseRow) => !!(get(t) as BaseRow | undefined)?.forApproval,
    percent: (t: BaseRow): number | null => {
      const row = get(t);
      return typeof row?.percent === "number" ? row.percent! : null;
    },
    updatedAt: (t: BaseRow) => {
      const row = get(t);
      return row?.progressUpdatedAt ?? row?.updatedAt ?? row?.createdAt ?? null;
    },
  } as const;
}

/** A richer index that also considers generic approval flags and product name */
export function makeProgressIndexRich(progressTasks?: BaseRow[]) {
  const base = makeProgressIndex(progressTasks);
  return {
    ...base,
    forApproval: (t: BaseRow) => {
      const row: any = base.get(t);
      if (!row) return false;
      return !isApproved(row) && row?.forApproval === true;
    },
    productName: (t: BaseRow) => {
      const row: any = base.get(t);
      return row?.product?.name ?? row?.title ?? null;
    },
  } as const;
}

/* =====================================================================================
 * View shaping
 * ===================================================================================== */

export function dedupeForDisplay(
  tasks: BaseRow[],
  progressIdx: ReturnType<typeof makeProgressIndex>
) {
  const groups = new Map<string, BaseRow[]>();
  for (const t of tasks ?? []) {
    const k = groupKey(t);
    const arr = groups.get(k);
    if (arr) arr.push(t);
    else groups.set(k, [t]);
  }

  const score = (t: BaseRow) => {
    const hasProg = progressIdx.has(t) ? 1 : 0;
    const ts = Math.max(itemTs(t), toTime(progressIdx.updatedAt(t)));
    return hasProg * 1e12 + ts;
  };

  const out: BaseRow[] = [];
  for (const [, arr] of groups) {
    let best = arr[0];
    for (const x of arr) if (score(x) >= score(best)) best = x;
    out.push(best);
  }
  return out;
}

export function totalsFromDisplay(
  tasks: BaseRow[],
  progressIdx: ReturnType<typeof makeProgressIndex>
) {
  let todo = 0,
    in_progress = 0,
    blocked = 0,
    done = 0;
  for (const t of tasks) {
    if (progressIdx.forApproval(t)) blocked++;
    else if ((t as any).status === "in_progress") in_progress++;
    else if ((t as any).status === "done") done++;
    else todo++;
  }
  const all = todo + in_progress + blocked + done;
  return { todo, in_progress, blocked, done, all } as const;
}
