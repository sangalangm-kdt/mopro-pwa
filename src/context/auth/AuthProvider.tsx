import { AuthContext } from "@context/auth/useAuth";
import { useAuth } from "@/api/auth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    // const { user, login, logout, isLoading } = useAuth();
    const { user, login, logout, isLoading } = useAuth();

    return (
        // <AuthContext.Provider value={{ user, login, logout, loading }}>
        <AuthContext.Provider value={{ user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}
