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
const EditProfile = lazy(() => import("@/pages/EditProfile"));
const ChangePass = lazy(() => import("@pages/ChangePass"));
const RequestAccount = lazy(() => import("@pages/RequestAccount"));

const Login = lazy(() => import("@/pages/Login"));
const ScanResult = lazy(() => import("@/pages/ScanResult"));
const EditProgress = lazy(() => import("@pages/EditProgress"));
const UserGuidelines = lazy(() => import("@pages/UserGuidelines"));
const HelpAndSupport = lazy(() => import("@pages/HelpAndSupport"));
const ModalWrapper = lazy(() => import("@layouts/ModalWrapper"));
const OnboardingScreen = lazy(() => import("@components/BoardingScreen"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const ForgotPassword = lazy(() => import("@pages/ForgotPassword"));
const ScanHistoryDetail = lazy(() => import("@/pages/ScanHistoryDetail"));

// Fallback UI while loading
import SkeletonLoader from "@/components/skeletons/SkeletonLoader";
import BoardingScreen from "@components/BoardingScreen";

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
    path: ROUTES.ONBOARDING,
    element: (
      <PublicRoute>
        <Suspense fallback={<LoadingScreen />}>
          <OnboardingScreen />
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
    children: [{ path: ROUTES.HOME, element: <Home /> }],
  },
  {
    path: "/",
    element: (
      <PrivateRoute>
        <Suspense fallback={<LoadingScreen />}>
          <ModalWrapper />
        </Suspense>
      </PrivateRoute>
    ),
    children: [
      { path: ROUTES.PROFILE, element: <Profile /> },
      { path: ROUTES.EDIT_PROFILE, element: <EditProfile /> },
      { path: ROUTES.CHANGE_PASSWORD, element: <ChangePass /> },
      { path: ROUTES.SCANNER, element: <QRScanner /> },
      { path: ROUTES.EDIT_PROGRESS, element: <EditProgress /> },
      { path: ROUTES.USER_GUIDELINES, element: <UserGuidelines /> },
      { path: ROUTES.HELP_AND_SUPPORT, element: <HelpAndSupport /> },
      { path: ROUTES.SCAN_HISTORY_DETAIL, element: <ScanHistoryDetail /> },
      {
        path: ROUTES.SCAN_RESULT,
        element: (
          <ScanResult
            qrData={""}
            onClose={() => {
              throw new Error("Function not implemented.");
            }}
          />
        ),
      },
    ],
  },

  {
    path: "/redirecting",
    element: <div style={{ display: "none" }}>Redirecting...</div>,
  },
  {
    path: ROUTES.REQUEST_ACCOUNT,
    element: (
      <Suspense fallback={<BoardingScreen />}>
        <RequestAccount />
      </Suspense>
    ),
  },
  {
    path: ROUTES.FORGOT_PASSWORD,
    element: (
      <Suspense fallback={<LoadingScreen />}>
        <ForgotPassword />
      </Suspense>
    ),
  },
  {
    path: ROUTES.CHANGE_PASSWORD_WITH_TOKEN, // e.g. '/change-password/:token'
    element: (
      <PublicRoute>
        <Suspense fallback={<LoadingScreen />}>
          <ChangePass />
        </Suspense>
      </PublicRoute>
    ),
  },

  {
    path: "*",
    element: (
      <Suspense fallback={<LoadingScreen />}>
        <NotFound />
      </Suspense>
    ),
  },
]);

export default function AppRoutes() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
