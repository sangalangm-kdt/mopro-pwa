import type { AssignedItem } from "@/utils/map-assigned-to-tasks";

export function mapProductUserAssignsToAssignedItems(
  rows: any[]
): AssignedItem[] {
  if (!Array.isArray(rows)) return [];
  return rows.map((r: any, i: number) => {
    const product = r.product ?? {};
    const project = product.project ?? r.project ?? {};
    return {
      id: r.id ?? product.id ?? `assign-${i}`,
      assigneeId: r.assigneeId ?? r.userId ?? r.user?.id ?? product.assigneeId,
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
}
