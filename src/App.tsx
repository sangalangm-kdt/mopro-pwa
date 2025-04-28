import { useState, useEffect } from "react";
import AppRoutes from "@/routes/AppRoutes";
import { ToastProvider } from "@/components/toast/ToastProvider";
import Preloader from "@/components/Preloader";

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadApp = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setLoading(false);
    };

    loadApp();
  }, []);

  return (
    <>
      {loading ? (
        <Preloader />
      ) : (
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      )}
    </>
  );
}
