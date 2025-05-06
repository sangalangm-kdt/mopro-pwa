import { Navigate } from "react-router-dom";
import { ROUTES } from "@/constants";
import { useAuthContext } from "@/context/auth/useAuth";
import { JSX } from "react";

export default function PublicRoute({ children }: { children: JSX.Element }) {
  const { user } = useAuthContext();

  //   if (isLoading) return <Preloader />;

  if (user) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return children;
}
