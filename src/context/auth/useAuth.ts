import { createContext, useContext } from "react";

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  roleId: number;
  employeeId: number;
  isEnable: number;
  manufacturerId: number;
  projectId: number;
  status: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuthContextType {
  // isAuthenticated: boolean;
  user: User | null;
  login: (data: { email: string; password: string }) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

// ✅ Consumer hook
export const useAuthContext = () => useContext(AuthContext);
