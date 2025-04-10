// src/router/AppRoutes.tsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "@layouts/MainLayout";
import QRScanner from "@/pages/qr-scanner/QrScanner";
import Home from "@pages/home/Home";
import Profile from "@pages/profile/Profile";
import Login from "@pages/auth/Login";
import PrivateRoute from "./PrivateRoute";
import { AuthProvider } from "@/context/AuthProvider";
import { ROUTES } from "@constants/routes";
import PublicRoute from "./PublicRoute";

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
