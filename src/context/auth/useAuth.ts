import { createContext, useContext } from "react";

export interface User {
  email: string;
  firstName: string;
  lastName: string;
}

export interface AuthContextType {
  user: User | null;
  login: (data: { email: string; password: string }) => Promise<boolean>;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

// ✅ Consumer hook
export const useAuthContext = () => useContext(AuthContext);
