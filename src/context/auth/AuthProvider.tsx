import { AuthContext } from "./useAuth";
import { useAuth } from "@/api/auth"; // your original auth logic hook

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const {
        user: rawUser,
        login,
        logout,
        changePassword,
        mutate,
        error,
        isLoading,
    } = useAuth();

    const user = rawUser?.data ?? rawUser ?? null;

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                changePassword,
                mutate,
                error,
                isLoading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
