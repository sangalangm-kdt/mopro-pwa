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
const EditProgress = lazy(() => import("@pages/EditProgress"));
const UserGuidelines = lazy(() => import("@pages/UserGuidelines"));
const HelpAndSupport = lazy(() => import("@pages/HelpAndSupport"));

// Fallback UI while loading
import SkeletonLoader from "@/components/skeletons/SkeletonLoader";

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
        element: <Home />,
      },
      {
        path: ROUTES.SCANNER,
        element: <QRScanner />,
      },
      {
        path: ROUTES.SCAN_RESULT,
        element: (
          <ScanResult
            qrData={""}
            onClose={function (): void {
              throw new Error("Function not implemented.");
            }}
          />
        ),
      },
      {
        path: ROUTES.EDIT_PROGRESS,
        element: <EditProgress />,
      },

      {
        path: ROUTES.PROFILE,
        element: <Profile />,
      },
      {
        path: ROUTES.USER_GUIDELINES,
        element: <UserGuidelines />,
      },
      { path: ROUTES.HELP_AND_SUPPORT, element: <HelpAndSupport /> },
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
