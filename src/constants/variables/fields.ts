// fields.ts
import type { Products, ScanResult } from "@/constants";

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
            value: parsed.name,
            icon: "clipboard-list",
        },
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
            // value: parsed.productDetails.lastModifiedBy,
            value: "Di ko pa nagagawa, gomen",
            icon: "last-modified-by",
        },
    ];
}

//sa scanResult to for viewing the details
export function getProductDetailsFields(parsed: Products): FieldItem[] {
    if ("error" in parsed || !parsed) return [];
    console.log(parsed);
    return [
        {
            label: "Line number",
            value: parsed.lineNumber,
            icon: "clipboard-list",
        },
        {
            label: "Product name",
            value: parsed.productList.name,
            icon: "clipboard-list",
        },
        {
            label: "Weight",
            value: parsed.weight,
            icon: "weight",
        },
        {
            label: "Current process",
            // value: parsed.products.currentProcess,
            value: "Di ko pa alam current process",
            icon: "workflow",
        },
        {
            label: "Progress (%)",
            // value: `${parsed.products.progress}%`,
            value: `same here, di ko alam huhuhu help please`,
            icon: "loader",
        },
        { label: "Remarks", value: parsed.remarks, icon: "sticky-note" },
    ];
}

export type { FieldItem };
