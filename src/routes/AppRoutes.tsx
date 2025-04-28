import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy, Suspense } from "react";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import { AuthProvider } from "@context/auth/AuthProvider";
import { ROUTES } from "@constants/routes";

// Lazy load pages
const MainLayout = lazy(() => import("@layouts/MainLayout"));
const QRScanner = lazy(() => import("@/pages/QrScanner"));
const Home = lazy(() => import("@/pages/Home"));
const Profile = lazy(() => import("@/pages/Profile"));
const Login = lazy(() => import("@/pages/Login"));
const ScanResult = lazy(() => import("@/pages/ScanResult"));

// Fallback UI while loading
const LoadingScreen = () => <div>Loading...</div>;

const router = createBrowserRouter([
  {
    path: ROUTES.LOGIN,
    element: (
      <PublicRoute>
        <Suspense fallback={<LoadingScreen />}>
          <Login />
        </Suspense>
      </PublicRoute>
    ),
  },
  {
    path: "/",
    element: <PrivateRoute />,
    children: [
      {
        path: "/",
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <MainLayout />
          </Suspense>
        ),
        children: [
          {
            path: ROUTES.HOME,
            element: (
              <Suspense fallback={<LoadingScreen />}>
                <Home />
              </Suspense>
            ),
          },
          {
            path: ROUTES.SCANNER,
            element: (
              <Suspense fallback={<LoadingScreen />}>
                <QRScanner />
              </Suspense>
            ),
          },
          {
            path: ROUTES.SCAN_RESULT,
            element: (
              <Suspense fallback={<LoadingScreen />}>
                <ScanResult />
              </Suspense>
            ),
          },
          {
            path: ROUTES.PROFILE,
            element: (
              <Suspense fallback={<LoadingScreen />}>
                <Profile />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },
  {
    path: "/redirecting",
    element: <div style={{ display: "none" }}>Redirecting...</div>,
  },
]);

export default function AppRoutes() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
