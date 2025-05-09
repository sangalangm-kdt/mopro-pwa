export interface Product {
  lineNumber: string;
}

export interface Process {
  processList: {
    [x: string]: unknown;
    name: string;
  };
}

export interface Project {
  products: Product[];
  process: Process[];
}
