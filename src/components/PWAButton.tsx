import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Button from "@/components/Button";
import { useAuth } from "@/context/auth/useAuth";
import { Download, X } from "lucide-react";

// Type-safe custom event for beforeinstallprompt
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
}

export default function PWAButton() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isSafari, setIsSafari] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation("pwa");

  useEffect(() => {
    const ua = window.navigator.userAgent.toLowerCase();
    const isSafariBrowser =
      /safari/.test(ua) && !/chrome/.test(ua) && !/android/.test(ua);
    setIsSafari(isSafariBrowser);

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsVisible(true);
      console.log("🔥 beforeinstallprompt event captured");
    };

    if (!isSafariBrowser) {
      window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    } else {
      setIsVisible(true);
    }

    return () => {
      if (!isSafariBrowser) {
        window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      }
    };
  }, []);

  const handleInstall = async () => {
    if (isSafari) {
      setShowInstructions(true);
      return;
    }

    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;

    if (result.outcome === "accepted") {
      console.log("✅ PWA installed");
    } else {
      console.log("❌ PWA install dismissed");
    }

    setDeferredPrompt(null);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <>
      {isAuthenticated ? (
        <>
          <span className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
            {t("app")}
          </span>
          <button
            onClick={handleInstall}
            className="w-full flex items-center gap-2 px-3 py-2 border border-primary-600 rounded text-sm font-semibold text-primary-800 hover:bg-primary-100 dark:hover:bg-zinc-700 transition"
          >
            <Download className="h-4 w-4" />
            {isSafari ? t("how_to_install") : t("install_app")}
          </button>
        </>
      ) : (
        <Button onClick={handleInstall} fullWidth>
          <div className="flex items-center gap-2 justify-center">
            <Download className="h-4 w-4" />
            {t("pwa")}
          </div>
        </Button>
      )}

      {/* Safari Instructions Modal */}
      {showInstructions && (
        <div
          onClick={() => setShowInstructions(false)}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 transition-opacity animate-fade"
        >
          {/* Modal Card */}
          <div
            onClick={(e) => e.stopPropagation()} // prevent backdrop closing when clicking inside modal
            className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full text-center relative animate-fade-up"
          >
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowInstructions(false)}
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-semibold mb-4">
              {t("how_to_install_app")}
            </h2>
            <p className="text-sm text-gray-600 mb-2">
              {t("instruction_share")}
            </p>
            <p className="text-sm text-gray-600 mb-4">
              {t("instruction_add_home")}
            </p>
            <Button onClick={() => setShowInstructions(false)} fullWidth>
              {t("got_it")}
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
