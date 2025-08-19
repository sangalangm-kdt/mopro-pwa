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
  updatedAt?: string; // ← helps sorting
  createdAt?: string; // ← helps sorting
  product?: {
    id?: number | string;
    lineNumber?: string;
    productList?: { name?: string };
    project?: { name?: string };
    percent?: number;
    currentProcess?: string;
  };
};

type ProgressRow = {
  id?: number | string;

  // who did the scan / updated the progress
  userId?: number | string;
  user?: { id?: number | string };

  // who *owns* the task (preferred for assignee)
  assignedToId?: number | string;
  assigneeId?: number | string;

  productId?: number | string; // possible shapes from API
  product_id?: number | string;
  product?: {
    id?: number | string;
    assigneeId?: number | string;
    lineNumber?: string;
    productList?: { name?: string };
    project?: { name?: string };
    percent?: number;
    currentProcess?: string;
  };

  percent?: number;
  status?: "todo" | "in_progress" | "blocked" | "done"; // optional server status

  // approval fields (support snake_case too)
  approvedById?: number | string | null;
  approved_by_id?: number | string | null;
  approvedBy?: {
    id?: number | string | null;
    firstName?: string;
    lastName?: string;
  } | null;

  // dates
  scheduledDate?: string | number | Date;
  updatedAt?: string | number | Date;
  createdAt?: string | number | Date;

  lineNumber?: string;
  project?: { name?: string };
  process?: { processList?: { name?: string } };
};

function numId(x: unknown): number | null {
  const n = Number(x);
  return Number.isFinite(n) && n > 0 ? n : null; // treat 0/NaN/"" as not approved
}

export function mapProgressToTasks(
  rows: ProgressRow[],
  currentUserId?: number | string
): MyTask[] {
  if (!Array.isArray(rows)) return [];

  const tasks = rows.map((r, i): MyTask => {
    const productId =
      r?.product?.id ?? r?.productId ?? r?.product_id ?? undefined;

    const lineNumber = r?.product?.lineNumber ?? r?.lineNumber ?? undefined;

    const title =
      r?.product?.productList?.name ?? lineNumber ?? r?.project?.name ?? "Item";

    const rawPercent =
      typeof r?.percent === "number" ? r.percent : r?.product?.percent;
    const percent =
      typeof rawPercent === "number"
        ? Math.max(0, Math.min(100, rawPercent))
        : 0;

    const processName =
      r?.process?.processList?.name ?? r?.product?.currentProcess;

    // prefer explicit scheduledDate if provided, else updatedAt, else createdAt
    const rawDate =
      r?.scheduledDate ?? r?.updatedAt ?? r?.createdAt ?? Date.now();

    // prefer true assignee over updater
    const assignee =
      r?.assignedToId ??
      r?.assigneeId ??
      r?.product?.assigneeId ??
      r?.userId ??
      r?.user?.id ??
      "unknown";

    // ✅ Approval check: null/absent => pending; number => approved
    const approvedId =
      numId(r?.approvedById) ??
      numId(r?.approved_by_id) ??
      numId(r?.approvedBy?.id);
    const forApproval = approvedId == null;

    // If pending, always blocked; else prefer server status if valid; else derive from percent
    let status: MyTask["status"];
    if (forApproval) {
      status = "blocked";
    } else if (
      r?.status &&
      ["todo", "in_progress", "blocked", "done"].includes(r.status)
    ) {
      status = r.status;
    } else if (percent >= 100) {
      status = "done";
    } else if (percent > 0) {
      status = "in_progress";
    } else {
      status = "todo";
    }

    const updatedAtIso = r?.updatedAt
      ? new Date(r.updatedAt as any).toISOString()
      : undefined;
    const createdAtIso = r?.createdAt
      ? new Date(r.createdAt as any).toISOString()
      : undefined;

    return {
      id: r?.id ?? `row-${i}`,
      assigneeId: assignee,

      status,
      forApproval,
      scheduledDate: new Date(rawDate as any).toISOString(),
      updatedAt: updatedAtIso,
      createdAt: createdAtIso,
      lineNumber,
      title,
      percent,
      productId:
        (r as any).product?.id ?? (r as any).productId ?? (r as any).product_id,
      product: {
        id: productId,
        lineNumber,
        productList: { name: r?.product?.productList?.name },
        project: { name: r?.project?.name ?? r?.product?.project?.name },
        percent,
        currentProcess: processName,
      },
    };
  });

  return currentUserId == null
    ? tasks
    : tasks.filter((t) => String(t.assigneeId) === String(currentUserId));
}
