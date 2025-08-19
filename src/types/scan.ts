export interface Product {
  lineNumber: string;
  weight: number;
  remarks: string;
  lastModifiedBy: string;
  currentProcess: string;
  percent: number;
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
  updatedAt: string | Date;
  remarks: string;
  productDetails: Product;
  percent: number;
}

export type ScanResult = ScanSuccessData | { error: string };

export interface RawProgressEntry {
  createdAt: string | Date;
  id: number;
  lineNumber: string;
  percent: number;
  updatedAt: string | Date;
  product: {
    lineNumber: string;
    weight: number;
    remarks: string;
    productList: {
      name: string;
    };
  };
  user: {
    firstName: string;
    lastName: string;
  };
  process: {
    processList: {
      name: string;
    };
  };
}
