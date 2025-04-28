import { Navigate, Outlet, useLocation } from "react-router-dom";
import { ROUTES } from "@/constants";
import { useAuth } from "@/context/auth/useAuth";
import type { ReactNode } from "react";
import Preloader from "@/components/Preloader";

interface PrivateRouteProps {
  children?: ReactNode;
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Preloader />;
  }

  return isAuthenticated ? (
    children ?? <Outlet />
  ) : (
    <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />
  );
}
