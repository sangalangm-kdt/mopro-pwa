import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, Frown } from "lucide-react";
import Button from "@/components/buttons/Button";
import CurvedLine from "@assets/curved-line.svg?react";
import { ROUTES } from "@/constants";

export default function NotFound() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    const timeout = setTimeout(() => {
      navigate(ROUTES.HOME);
    }, 10000); // Auto-redirect after 10s

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [navigate]);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-white dark:bg-zinc-900 px-4 sm:px-6 text-center overflow-hidden">
      {/* Animated curved line at bottom */}
      <div className="hidden md:block absolute top-30 left-0 w-full  opacity-20 pointer-events-none z-0 rotate-180">
        <CurvedLine className="w-full h-auto " />
      </div>
      {/* Responsive background triangle */}
      <AlertTriangle
        className="absolute text-primary-100 dark:text-primary-900 opacity-20 pointer-events-none z-0
                   -bottom-20 -right-20 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] lg:w-[500px] lg:h-[500px]"
      />

      {/* Foreground content */}
      <div className="z-10 flex flex-col items-center max-w-md w-full">
        <Frown size={60} className="text-gray-300 mb-4" />
        <h1 className="text-4xl sm:text-5xl font-bold text-primary-800 dark:text-white mb-2">
          404
        </h1>
        <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 mb-2">
          The page you are looking for does not exist.
        </p>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
          Redirecting to home in{" "}
          <span className="font-semibold text-primary-600 dark:text-blue-400 animate-pulse">
            {countdown}
          </span>{" "}
          second{countdown !== 1 && "s"}...
        </p>
        <Button
          onClick={() => navigate("/")}
          className="w-full sm:w-auto bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-full shadow transition"
        >
          Go to Home Now
        </Button>
      </div>
    </div>
  );
}
