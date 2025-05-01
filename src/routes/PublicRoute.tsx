import Preloader from "@/components/Preloader";
import { ROUTES } from "@/constants";
import { useAuth } from "@/context/auth/useAuth";
import { JSX } from "react";

export default function PublicRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <Preloader />;

  if (isAuthenticated) {
    // Redirect to previous or home
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return children;
}
