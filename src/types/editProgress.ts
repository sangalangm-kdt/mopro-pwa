export interface Product {
  lineNumber: string;
  currentProcess?: {
    id: string;
    name: string;
  };
  progress?: number;
  updated_at?: string; // ✅ Add this to support showing the last updated date
}

export interface Process {
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
