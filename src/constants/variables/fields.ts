import type { ScanResult, Product } from "@/types/scan";

export interface FieldItem {
  label: string;
  value: string | number | undefined;
  icon: string;
}

export function getOverviewFields(parsed: ScanResult): FieldItem[] {
  if ("error" in parsed) return [];

  return [
    { label: "Project name", value: parsed.name, icon: "clipboard-list" },
    {
      label: "Order number",
      value: parsed.orderNumber,
      icon: "clipboard-list",
    },
    {
      label: "Last updated",
      value: new Date(parsed.updatedAt).toLocaleString(),
      icon: "clock",
    },
    {
      label: "Last modified by",
      value: parsed.productDetails.lastModifiedBy,
      icon: "last-modified-by",
    },
  ];
}

export function getProductDetailsFields(parsed: Product): FieldItem[] {
  return [
    // { label: "Line number", value: parsed.lineNumber, icon: "clipboard-list" },
    {
      label: "Product name",
      value: parsed.productList.name,
      icon: "clipboard-list",
    },
    { label: "Weight", value: parsed.weight, icon: "weight" },
    {
      label: "Current process",
      value: parsed.currentProcess,
      icon: "workflow",
    },
    { label: "Progress (%)", value: `${parsed.progress}%`, icon: "loader" },
    { label: "Remarks", value: parsed.remarks, icon: "sticky-note" },
  ];
}
