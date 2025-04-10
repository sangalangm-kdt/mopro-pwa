import { ROUTES } from "@/constants";
import { useAuth } from "@/context/useAuth";
import { JSX } from "react";

export default function PublicRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div>Loading...</div>;

  if (isAuthenticated) {
    // Redirect to previous or home
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return children;
}
