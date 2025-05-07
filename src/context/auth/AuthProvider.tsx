import { AuthContext } from "./useAuth";
import { useAuth } from "@/api/auth"; // your original auth logic hook

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const { user, login, logout, isLoading } = useAuth();

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};
