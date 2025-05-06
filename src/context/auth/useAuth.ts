import { createContext, useContext } from "react";

export interface User {
    email: string;
    firstName: string;
    lastName: string;
}

export interface AuthContextType {
    // isAuthenticated: boolean;
    user: User | null;
    login: (data: { email: string; password: string }) => Promise<boolean>;
    // logout: () => void;
    isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType>(
    {} as AuthContextType
);

export const useAuth = () => useContext(AuthContext);
