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
      label: "Project name",
      value: parsed.projectName,
      icon: "clipboard-list",
    },
    {
      label: "Order number",
      value: parsed.orderNumber,
      icon: "clipboard-list",
    },
    {
      label: "Last updated",
      value: new Date(parsed.lastUpdated).toLocaleString(),
      icon: "clock",
    },
    {
      label: "Last modified by",
      value: parsed.productDetails.lastModifiedBy,
      icon: "last-modified-by",
    },
  ];
}

//sa scanResult to for viewing the details
export function getProductDetailsFields(parsed: ScanResult): FieldItem[] {
  if ("error" in parsed || !parsed.productDetails) return [];

  return [
    // {
    //   label: "Line number",
    //   value: parsed.productDetails.lineNumber,
    //   icon: "clipboard-list",
    // },
    {
      label: "Product name",
      value: parsed.productDetails.productName,
      icon: "clipboard-list",
    },
    {
      label: "Weight",
      value: parsed.productDetails.weight,
      icon: "weight",
    },
    {
      label: "Current process",
      value: parsed.productDetails.currentProcess,
      icon: "workflow",
    },
    {
      label: "Progress (%)",
      value: `${parsed.productDetails.progress}%`,
      icon: "loader",
    },
    { label: "Remarks", value: parsed.remarks, icon: "sticky-note" },
  ];
}

export type { FieldItem };
