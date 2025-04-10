import { useState, useEffect } from "react";
import AppRoutes from "@/routes/AppRoutes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Preloader from "@/components/Preloader";

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading or initialization logic here (e.g., fetching config, user auth, etc.)
    const loadApp = async () => {
      // Example delay simulation
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
        <>
          <AppRoutes />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            pauseOnHover
            draggable
            theme="colored"
          />
        </>
      )}
    </>
  );
}
