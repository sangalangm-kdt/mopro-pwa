// src/router/AppRoutes.tsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "@layouts/MainLayout";
import QRScanner from "@/pages/QrScanner";
import Home from "@/pages/Home";
import Profile from "@/pages/Profile";
import Login from "@/pages/Login";
import PrivateRoute from "./PrivateRoute";
import { AuthProvider } from "@context/auth/AuthProvider";
import { ROUTES } from "@constants/routes";
import PublicRoute from "./PublicRoute";
import ScanResult from "@/pages/ScanResult";

const router = createBrowserRouter([
  {
    path: ROUTES.LOGIN,
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: "/",
    element: <PrivateRoute />,
    children: [
      {
        path: "/",
        element: <MainLayout />,
        children: [
          { path: ROUTES.HOME, element: <Home /> },
          { path: ROUTES.SCANNER, element: <QRScanner /> },
          { path: ROUTES.SCAN_RESULT, element: <ScanResult /> },
          { path: ROUTES.PROFILE, element: <Profile /> },
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
