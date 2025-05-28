// RouterWrapper.tsx
import { useOnboardingRedirect } from "@/hooks/onboarding-direct";
import { RouterProvider } from "react-router-dom";
import { router } from "@/routes/router"; // make sure your router is exportable

export default function RouterWrapper() {
  useOnboardingRedirect(); // now safely inside Router context
  return <RouterProvider router={router} />;
}
