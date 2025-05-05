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

export const MOCK_SCAN_HISTORY = [
  {
    id: 1,
    drawingNumber: "632152001",
    productName: "Gulong ng balde",
    date: "2024-05-02T14:32:00+08:00",
    progress: 24,
    process: "procurement",
  },
  {
    id: 2,
    drawingNumber: "632152002",
    productName: "Portal Frame",
    date: "2024-05-01T09:15:00+08:00",
    progress: 65,
    process: "inspection",
  },
  {
    id: 3,
    drawingNumber: "632152003",
    productName: "Winch Housing",
    date: "2024-01-10T10:20:00+08:00",
    progress: 40,
    process: "assembly",
  },
  {
    id: 4,
    drawingNumber: "632152004",
    productName: "Control Cabinet",
    date: "2024-02-05T08:45:00+08:00",
    progress: 88,
    process: "packaging",
  },
  {
    id: 5,
    drawingNumber: "632152005",
    productName: "Power Skid",
    date: "2024-04-18T15:10:00+08:00",
    progress: 100,
    process: "shipping",
  },
  {
    id: 6,
    drawingNumber: "632152006",
    productName: "Gear Reducer",
    date: "2024-03-25T11:40:00+08:00",
    progress: 30,
    process: "assembly",
  },
  {
    id: 7,
    drawingNumber: "632152007",
    productName: "Conveyor Trough",
    date: "2024-03-10T13:25:00+08:00",
    progress: 72,
    process: "inspection",
  },
  {
    id: 8,
    drawingNumber: "632152008",
    productName: "Hopper Feeder",
    date: "2024-01-22T10:50:00+08:00",
    progress: 55,
    process: "packaging",
  },
  {
    id: 9,
    drawingNumber: "632152009",
    productName: "Motor Base Plate",
    date: "2024-02-18T09:05:00+08:00",
    progress: 20,
    process: "procurement",
  },
  {
    id: 10,
    drawingNumber: "632152010",
    productName: "Steel Frame Structure",
    date: "2024-04-29T14:00:00+08:00",
    progress: 95,
    process: "shipping",
  },
];
