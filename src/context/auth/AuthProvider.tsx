import { AuthContext } from "./useAuth";
import { useAuth } from "@/api/auth"; // your original auth logic hook

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const { user: rawUser, login, logout, isLoading } = useAuth();

    const user = rawUser?.data ?? null;

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};
