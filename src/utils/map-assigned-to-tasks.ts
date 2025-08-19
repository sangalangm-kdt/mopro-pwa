import type { MyTask } from "./map-progress-to-tasks";

export type AssignedItem = {
  id: number | string;
  assigneeId?: number | string;
  productId?: number | string;
  lineNumber?: string;
  percent?: number;
  forApproval?: boolean;
  updatedAt?: string | number | Date;
  createdAt?: string | number | Date;
  productList?: { name?: string };
  project?: { name?: string };
  currentProcess?: string;
};

export function mapAssignedToTasks(
  items: AssignedItem[] = [],
  currentUserId?: number | string
): MyTask[] {
  const rows = items.filter((it) =>
    currentUserId == null
      ? true
      : String(it.assigneeId) === String(currentUserId)
  );

  return rows.map((r, i) => {
    const percent = typeof r.percent === "number" ? r.percent : 0;

    // base status from percent
    let status: MyTask["status"] =
      percent >= 100 ? "done" : percent > 0 ? "in_progress" : "todo";

    // if forApproval, override status
    // (this is used for tasks that are assigned but not yet started)
    const forApproval = r.forApproval === true;
    if (forApproval) status = "blocked";

    const rawDate = r.updatedAt ?? r.createdAt ?? Date.now();

    return {
      id: r.id ?? `assigned-${i}`,
      assigneeId: r.assigneeId ?? "unknown",
      productId:
        (r as any).product?.id ?? (r as any).productId ?? (r as any).product_id,
      status,
      scheduledDate: new Date(rawDate as any).toISOString(),
      lineNumber: r.lineNumber,
      title:
        r.productList?.name ??
        r.project?.name ??
        r.lineNumber ??
        "Assigned item",
      percent,
      forApproval, // ← pass through so the chip can show “For Approval”
      product: {
        lineNumber: r.lineNumber,
        productList: { name: r.productList?.name },
        project: { name: r.project?.name },
        percent,
        currentProcess: r.currentProcess,
      },
    };
  });
}
