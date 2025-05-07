import { useState, useEffect } from "react";
import AppRoutes from "@/routes/AppRoutes";
import { Toaster } from "sonner";
import Preloader from "@/components/Preloader";

export default function App() {
  const [loading, setLoading] = useState(true);
  const isDev = import.meta.env.DEV;

  useEffect(() => {
    const loadApp = async () => {
      if (isDev) {
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }
      setLoading(false);
    };
    loadApp();
  }, [isDev]);

  return (
    <>
      {loading ? (
        <Preloader />
      ) : (
        <>
          <AppRoutes />
          <Toaster position="top-right" richColors expand theme="light" />
        </>
      )}
    </>
  );
}
