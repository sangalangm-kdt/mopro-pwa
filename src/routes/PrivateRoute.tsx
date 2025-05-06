import { ROUTES } from "@/constants";
import { useAuth } from "@/context/auth/useAuth";

export default function PrivateRoute() {
    const { user, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return <div>Loading...</div>; // or a fancy preloader/spinner
    }

    return user ? (
        <Outlet />
    ) : (
        <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />
    );
}
