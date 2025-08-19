// src/utils/map-progress-to-tasks.ts

export type MyTask = {
  id: number | string;
  assigneeId: number | string | "unknown";
  status: "todo" | "in_progress" | "blocked" | "done";
  scheduledDate: string; // ISO
  lineNumber?: string;
  title?: string;
  percent?: number;
  forApproval?: boolean;
  productId?: number | string;
  updatedAt?: string;
  createdAt?: string;
  product?: {
    id?: number | string;
    lineNumber?: string;
    productList?: { name?: string };
    project?: { name?: string };
    percent?: number;
    currentProcess?: string;
  };

  // approval + progress metadata
  approvedById?: number | string | null;
  approvedBy?: any | null;
  approvedAt?: string | null;
  approved?: boolean;
  progressUpdatedAt?: string | null;
};

type ProgressRow = {
  id?: number | string;

  userId?: number | string;
  user?: { id?: number | string };

  assignedToId?: number | string;
  assigneeId?: number | string;

  productId?: number | string;
  product_id?: number | string;
  product?: {
    id?: number | string;
    assigneeId?: number | string;
    lineNumber?: string;
    name?: string;
    productList?: { name?: string };
    project?: { name?: string };
    percent?: number;
    currentProcess?: string;
  };

  percent?: number;
  progress?: number;

  status?: "todo" | "in_progress" | "blocked" | "done";

  approvedById?: number | string | null;
  approved_by_id?: number | string | null;

  approvedBy?: {
    id?: number | string | null;
    firstName?: string;
    lastName?: string;
  } | null;

  // ✅ single key with union (object OR number/string OR null)
  approved_by?:
    | {
        id?: number | string | null;
        first_name?: string;
        last_name?: string;
      }
    | number
    | string
    | null;

  approvedAt?: string | number | Date | null;
  approved_at?: string | number | Date | null;
  approved?: boolean;

  scheduledDate?: string | number | Date;
  updatedAt?: string | number | Date;
  updated_at?: string | number | Date;
  createdAt?: string | number | Date;
  created_at?: string | number | Date;
  progressUpdatedAt?: string | number | Date | null;
  progress_updated_at?: string | number | Date | null;

  lineNumber?: string;
  line_number?: string;
  project?: { name?: string };
  process?: { processList?: { name?: string } };
};

const toIso = (x: any): string | undefined =>
  x != null ? new Date(x).toISOString() : undefined;

const numId = (x: unknown): number | null => {
  const n = Number(x);
  return Number.isFinite(n) && n > 0 ? n : null;
};

export function mapProgressToTasks(
  rows: ProgressRow[],
  currentUserId?: number | string
): MyTask[] {
  if (!Array.isArray(rows)) return [];

  const tasks = rows.map((r, i): MyTask => {
    // identity
    const productId =
      r?.product?.id ?? r?.productId ?? r?.product_id ?? undefined;

    const lineNumber =
      r?.product?.lineNumber ??
      r?.lineNumber ??
      (r as any)?.line_number ??
      undefined;

    // better title fallbacks
    const title =
      r?.product?.name ??
      r?.product?.productList?.name ??
      lineNumber ??
      r?.project?.name ??
      "Item";

    // percent
    const rawPercent =
      typeof r?.percent === "number"
        ? r.percent
        : typeof r?.progress === "number"
        ? r.progress
        : r?.product?.percent;
    const percent =
      typeof rawPercent === "number"
        ? Math.max(0, Math.min(100, rawPercent))
        : 0;

    // process
    const processName =
      r?.process?.processList?.name ?? r?.product?.currentProcess;

    // dates
    const updatedAt = r?.updatedAt ?? r?.updated_at ?? null;
    const createdAt = r?.createdAt ?? r?.created_at ?? null;
    const progressUpdatedAt =
      r?.progressUpdatedAt ?? r?.progress_updated_at ?? updatedAt ?? null;

    const scheduled = r?.scheduledDate ?? updatedAt ?? createdAt ?? Date.now();

    // assignee
    const assignee =
      r?.assignedToId ??
      r?.assigneeId ??
      r?.product?.assigneeId ??
      r?.userId ??
      r?.user?.id ??
      "unknown";

    const rawApprovedByObj =
      (r as any)?.approvedBy ?? (r as any)?.approved_by ?? null;

    // approvals (support camel, snake, and plain numeric approved_by)
    const rawApprovedById =
      (r as any)?.approvedById ??
      (r as any)?.approved_by_id ??
      // if object, take its id; if number/string, use it directly
      (typeof rawApprovedByObj === "object" && rawApprovedByObj
        ? rawApprovedByObj.id
        : rawApprovedByObj) ??
      null;

    const approvedById = numId(rawApprovedById);

    const approvedBy =
      r?.approvedBy ??
      r?.approved_by ??
      (approvedById != null ? { id: approvedById } : null);

    const approvedAtRaw =
      (r as any)?.approvedAt ?? (r as any)?.approved_at ?? null;
    const approvedAt =
      approvedAtRaw != null
        ? new Date(approvedAtRaw as any).toISOString()
        : null;

    const approved =
      r?.approved === true || approvedById != null || approvedAt != null;

    const forApproval = !approved;

    // status: if approved but server says "blocked", force "in_progress"
    let status: MyTask["status"];
    if (forApproval) {
      status = "blocked";
    } else if (r?.status === "done" || percent >= 100) {
      status = "done";
    } else if (r?.status === "blocked") {
      status = "in_progress";
    } else if (r?.status && ["todo", "in_progress"].includes(r.status)) {
      status = r.status;
    } else if (percent > 0) {
      status = "in_progress";
    } else {
      status = "todo";
    }

    return {
      id: r?.id ?? `row-${i}`,
      assigneeId: assignee,

      status,
      forApproval,

      scheduledDate: toIso(scheduled)!,
      updatedAt: toIso(updatedAt),
      createdAt: toIso(createdAt),
      progressUpdatedAt: toIso(progressUpdatedAt) ?? null,

      lineNumber,
      title,
      percent,

      productId,
      product: {
        id: productId,
        lineNumber,
        productList: { name: r?.product?.productList?.name },
        project: { name: r?.project?.name ?? r?.product?.project?.name },
        percent,
        currentProcess: processName,
      },

      approvedById,
      approvedBy,
      approvedAt,
      approved,
    };
  });

  return currentUserId == null
    ? tasks
    : tasks.filter((t) => String(t.assigneeId) === String(currentUserId));
}
