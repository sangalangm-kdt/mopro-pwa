export interface Product {
  id: number;
  lineNumber: string;
  currentProcess?: {
    id: string;
    name: string;
  };
  progress?: number;
  updatedAt?: string;
}

export interface Process {
  id: number;
  processList: {
    [x: string]: unknown;
    name: string;
  };
}

export interface Project {
  id: number;
  products: Product[];
  process: Process[];
}

export interface ProgressEntry {
  id: number;
  lineNumber: string;
  projectId: number;
  productId: number;
  processId: number;
  percent: number;
  updatedAt?: string;
  createdAt?: string;

  user?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    roleId: number;
    projectId: number;
    role: {
      name: string;
    };
  };

  project?: {
    id: number;
    name: string;
    serialNumber: string;
    orderNumber: string;
    specificationNumber: string;
    orderName: string;
    status: number;
    manufacturerId: number;
  };

  product?: {
    id: number;
    lineNumber: string;
    weight: number;
    remarks: string;
    productList: {
      name: string;
    };
  };

  process?: {
    amount: number;
    proratedValue: number;
    processList: {
      id: number;
      name: string;
    };
  };
}
