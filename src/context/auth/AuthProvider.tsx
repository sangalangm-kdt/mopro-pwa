import { useEffect, useState } from "react";
import { AuthContext } from "@context/auth/useAuth";

const DUMMY_USER = {
  email: "demo@sample.com",
  firstName: "Jane",
  lastName: "Doe",
  password: "12345678",
};

interface User {
  email: string;
  firstName: string;
  lastName: string;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const login = async (email: string, password: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (email === DUMMY_USER.email && password === DUMMY_USER.password) {
          const userData: User = {
            email,
            firstName: DUMMY_USER.firstName,
            lastName: DUMMY_USER.lastName,
          };
          setUser(userData);
          setIsAuthenticated(true);
          localStorage.setItem("user", JSON.stringify(userData));
          resolve(true);
        } else {
          resolve(false);
        }
      }, 800); // simulate network delay
    });
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser) as User;
      setUser(parsed);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}
