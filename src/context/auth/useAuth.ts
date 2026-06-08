import { createContext, useContext } from "react";
import type { KeyedMutator } from "swr";

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
  user: User | null;
  login: (data: { email: string; password: string }) => Promise<boolean>;
  logout: () => Promise<void>;
  changePassword: (data: {
    currentPassword: string;
    password: string;
    passwordConfirmation: string;
  }) => Promise<unknown>;
  mutate: KeyedMutator<unknown>;
  error: unknown;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

// ✅ Consumer hook
export const useAuthContext = () => useContext(AuthContext);
