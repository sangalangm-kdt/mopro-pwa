import { CheckCircle, Home, QrCode, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ROUTES } from "@/constants";
import Button from "../buttons/Button";

interface SuccessModalProps {
  onClose: () => void;
}

export default function SuccessModal({ onClose }: SuccessModalProps) {
  const navigate = useNavigate();
  const [loadingTarget, setLoadingTarget] = useState<"home" | "scan" | null>(
    null
  );

  const handleGoHome = () => {
    setLoadingTarget("home");
    setTimeout(() => {
      navigate(ROUTES.HOME);
      onClose();
    }, 800);
  };

  const handleGoScan = () => {
    setLoadingTarget("scan");
    setTimeout(() => {
      navigate(ROUTES.SCANNER);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity duration-300 animate-fade-in">
      <div className="w-full max-w-sm rounded-lg bg-white dark:bg-zinc-900 p-6 text-center shadow-xl border border-gray-200 dark:border-zinc-700 transform transition-all duration-300 animate-slide-up">
        <CheckCircle className="mx-auto h-12 w-12 text-primary-500 mb-4" />
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          Progress Saved
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
          Your updates have been successfully saved.
        </p>
        <div className="mt-6 flex justify-center gap-2">
          <Button
            onClick={handleGoScan}
            variant="outlined"
            className="w-full flex items-center justify-center gap-2"
            disabled={loadingTarget !== null}
          >
            {loadingTarget === "scan" ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <QrCode className="w-4 h-4" /> Scan again
              </>
            )}
          </Button>
          <Button
            onClick={handleGoHome}
            variant="primary"
            className="w-full flex items-center justify-center gap-2"
            disabled={loadingTarget !== null}
          >
            {loadingTarget === "home" ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Home className="w-4 h-4" /> Home
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
