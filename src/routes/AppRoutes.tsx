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
import SkeletonLoader from "@/components/SkeletonLoader";

const LoadingScreen = () => (
  <div className="flex justify-center items-center min-h-screen p-8 bg-bg-color">
    <SkeletonLoader
      blocks={[
        { type: "title" },
        { type: "text" },
        { type: "text" },
        { type: "rect", height: "48" },
      ]}
    />
  </div>
);

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
    element: (
      <PrivateRoute>
        <Suspense fallback={<LoadingScreen />}>
          <MainLayout />
        </Suspense>
      </PrivateRoute>
    ),
    children: [
      {
        path: ROUTES.HOME,
        element: <Home />, // No need to wrap in Suspense again
      },
      {
        path: ROUTES.SCANNER,
        element: <QRScanner />,
      },
      {
        path: ROUTES.SCAN_RESULT,
        element: <ScanResult />,
      },
      {
        path: ROUTES.PROFILE,
        element: <Profile />,
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
