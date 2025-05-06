import { AuthContext } from "./useAuth";
import { useAuth } from "@/api/auth"; // your original auth logic hook

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, login, isLoading } = useAuth();

  return (
    <AuthContext.Provider value={{ user, login, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
