export interface Product {
  lineNumber: string;
  weight: number;
  remarks: string;
  lastModifiedBy: string;
  currentProcess: string;
  progress: number;
  productList: {
    name: string;
  };
}

export interface Project {
  name: string;
  orderNumber: string;
  updatedAt: string;
  remarks: string;
  products: Product[];
}

export interface ScanSuccessData {
  lineNumber: string;
  serialNumber: string;
  orderNumber: string;
  name: string;
  updatedAt: string;
  remarks: string;
  productDetails: Product;
}

export type ScanResult = ScanSuccessData | { error: string };
