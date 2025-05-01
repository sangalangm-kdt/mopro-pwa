// src/constants/mockScanData.ts

export interface ProductDetails {
  lineNumber: number;
  productName: string;
  weight: string;
  lastModifiedBy: string;
  currentProcess: string; // stores only the value (no localization yet)
  progress: number;
}

export interface ScanSuccessData {
  orderNumber: string | number | undefined;
  serialNumber: string;
  projectName: string;
  lastUpdated: string;
  remarks: string;
  productDetails: ProductDetails;
}

export interface ScanErrorData {
  error: string;
}

export type ScanResult = ScanSuccessData | ScanErrorData;

// ✅ Optionally: full dropdown config (used in ProcessDropdown)
export const PROCESS_VALUES = [
  "procurement",
  "assembly",
  "inspection",
  "packaging",
  "shipping",
];

// ✅ Mock data using only the `value` for currentProcess
export const MOCK_SCAN_DATA: Record<string, ScanSuccessData> = {
  "632152001": {
    serialNumber: "632152001",
    orderNumber: "458R234",
    projectName: "Kobe Steel Kakogawa No.4 Reclaimer Renewal Work",
    lastUpdated: "2023-11-12T20:04:00+08:00",
    remarks: "Lorem ipsum djfgkdughh cljgfkbl hjljbvclbj jb ljglfjgb",
    productDetails: {
      lineNumber: 1,
      productName: "Gulong ng balde",
      weight: "47 kg",
      lastModifiedBy: "Jane Doe",
      currentProcess: "procurement",
      progress: 24,
    },
  },
  "632152002": {
    serialNumber: "632152002",
    orderNumber: "458R235",
    projectName: "Cement Plant Upgrade Phase II",
    lastUpdated: "2023-12-01T14:32:00+08:00",
    remarks: "Secondary unit undergoing QA verification.",
    productDetails: {
      lineNumber: 2,
      productName: "Axle Assembly",
      weight: "30 kg",
      lastModifiedBy: "John Smith",
      currentProcess: "inspection",
      progress: 65,
    },
  },
};
