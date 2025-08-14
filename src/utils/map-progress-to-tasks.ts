// src/utils/map-progress-to-tasks.ts

export type MyTask = {
  id: number | string;
  assigneeId: number | string | "unknown";
  status: "todo" | "in_progress" | "blocked" | "done";
  scheduledDate: string; // ISO
  lineNumber?: string;
  title?: string;
  percent?: number;
  product?: {
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
  product?: {
    assigneeId?: number | string;
    lineNumber?: string;
    productList?: { name?: string };
    project?: { name?: string };
    percent?: number;
    currentProcess?: string;
  };

  percent?: number;
  status?: "todo" | "in_progress" | "blocked" | "done";

  // dates
  scheduledDate?: string | number | Date;
  updatedAt?: string | number | Date;
  createdAt?: string | number | Date;

  lineNumber?: string;
  project?: { name?: string };
  process?: { processList?: { name?: string } };
};

export function mapProgressToTasks(
  rows: ProgressRow[],
  currentUserId?: number | string
): MyTask[] {
  if (!Array.isArray(rows)) return [];

  const tasks = rows.map((r, i): MyTask => {
    const lineNumber = r?.product?.lineNumber ?? r?.lineNumber ?? undefined;

    const title =
      r?.product?.productList?.name ?? lineNumber ?? r?.project?.name ?? "Item";
    const percent =
      typeof r?.percent === "number" ? r.percent : r?.product?.percent ?? 0;

    const processName =
      r?.process?.processList?.name ?? r?.product?.currentProcess;

    // prefer explicit scheduledDate if provided, else updatedAt, else createdAt
    const rawDate =
      r?.scheduledDate ?? r?.updatedAt ?? r?.createdAt ?? Date.now();

    // 🔑 prefer true assignee over updater
    const assignee =
      r?.assignedToId ??
      r?.assigneeId ??
      r?.product?.assigneeId ??
      r?.userId ??
      r?.user?.id ??
      "unknown";

    const status: MyTask["status"] =
      r?.status && ["todo", "in_progress", "blocked", "done"].includes(r.status)
        ? r.status
        : percent >= 100
        ? "done"
        : percent > 0
        ? "in_progress"
        : "todo";

    return {
      id: r?.id ?? `row-${i}`,
      assigneeId: assignee,
      status,
      scheduledDate: new Date(rawDate as any).toISOString(),
      lineNumber,
      title,
      percent,
      product: {
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
