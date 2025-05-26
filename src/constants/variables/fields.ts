import type { ScanResult, Product } from "@/types/scan";

export interface FieldItem {
  label: string;
  value: string | number | undefined;
  icon: string;
}

export function getOverviewFields(
  parsed: ScanResult,
  labels: Record<string, string>
): FieldItem[] {
  if ("error" in parsed) return [];

  return [
    { label: labels.PROJECT_NAME, value: parsed.name, icon: "clipboard-list" },
    {
      label: labels.ORDER_NUMBER,
      value: parsed.orderNumber,
      icon: "clipboard-list",
    },
    {
      label: labels.LAST_UPDATED,
      value: new Date(parsed.updatedAt).toLocaleString(),
      icon: "clock",
    },
    {
      label: labels.LAST_MODIFIED_BY,
      value: parsed.productDetails.lastModifiedBy,
      icon: "last-modified-by",
    },
  ];
}

export function getProductDetailsFields(
  parsed: Product,
  labels: Record<string, string>
): FieldItem[] {
  return [
    {
      label: labels.DRAWING_NAME,
      value: parsed.productList.name,
      icon: "clipboard-list",
    },
    { label: labels.WEIGHT, value: parsed.weight, icon: "weight" },
    {
      label: labels.CURRENT_PROCESS,
      value: parsed.currentProcess,
      icon: "workflow",
    },
    { label: labels.PROGRESS, value: parsed.percent, icon: "loader" },
    { label: labels.REMARKS, value: parsed.remarks, icon: "sticky-note" },
  ];
}
