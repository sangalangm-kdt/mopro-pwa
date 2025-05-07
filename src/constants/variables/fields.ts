// fields.ts
import type { ScanResult } from "@/constants";

interface FieldItem {
  label: string;
  value: string | number | undefined;
  icon: string;
}

//sa scanResult to for viewing the details
export function getOverviewFields(parsed: ScanResult): FieldItem[] {
  if ("error" in parsed) return [];

  return [
    {
      label: "project_name",
      value: parsed.projectName,
      icon: "clipboard-list",
    },
    {
      label: "order_number",
      value: parsed.orderNumber,
      icon: "clipboard-list",
    },
    {
      label: "last_updated",
      value: new Date(parsed.lastUpdated).toLocaleString(),
      icon: "clock",
    },
    {
      label: "last_modified_by",
      value: parsed.productDetails.lastModifiedBy,
      icon: "last-modified-by",
    },
  ];
}

//sa scanResult to for viewing the details
export function getProductDetailsFields(parsed: ScanResult): FieldItem[] {
  if ("error" in parsed || !parsed.productDetails) return [];

  return [
    {
      label: "product_name",
      value: parsed.productDetails.productName,
      icon: "clipboard-list",
    },
    {
      label: "weight",
      value: parsed.productDetails.weight,
      icon: "weight",
    },
    {
      label: "current_process",
      value: parsed.productDetails.currentProcess,
      icon: "workflow",
    },
    {
      label: "progress",
      value: `${parsed.productDetails.progress}%`,
      icon: "loader",
    },
    {
      label: "remarks",
      value: parsed.remarks,
      icon: "sticky-note",
    },
  ];
}

export type { FieldItem };
