import { useState } from "react";
import { useTranslation } from "react-i18next";
import Button from "./Button";
import { useAuthContext } from "@/context/auth/useAuth";
import { Download, X } from "lucide-react";
import { PWA_TEXT_KEYS } from "@/constants";
import { createPortal } from "react-dom";
import { usePwaInstallPrompt } from "@/utils/install-pwa";

export default function PWAButton() {
  const { user } = useAuthContext();
  const { t } = useTranslation("pwa");
  const [showInstructions, setShowInstructions] = useState(false);
  const [isVisible, setIsVisible] = useState(false); // ✅ Declare visibility

  const { deferredPrompt, isSafari, isInstallable, promptInstall } =
    usePwaInstallPrompt();

  useEffect(() => {
    if (isSafari || deferredPrompt) {
      setIsVisible(true); // ✅ Trigger button visibility
    }
  }, [isSafari, deferredPrompt]);

  const handleInstall = async () => {
    if (isSafari) {
      setShowInstructions(true);
      return;
    }

    if (!deferredPrompt) return;

    await promptInstall?.(); // This internally calls deferredPrompt.prompt()

    const result = await deferredPrompt.userChoice;

    if (result.outcome === "accepted") {
      console.log("✅ PWA installed");
      setIsVisible(false); // ✅ Auto-hide button
    } else {
      console.log("❌ PWA install dismissed");
    }
  };

  if (!isInstallable || !isVisible) return null; // ✅ Final visibility check

  return (
    <>
      {user ? (
        <div>
          <span className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-3">
            {t(PWA_TEXT_KEYS.INSTALL_APP)}
          </span>
          <button
            onClick={handleInstall}
            className="w-full flex items-center gap-2 px-3 py-2 border border-primary-600 rounded text-sm font-semibold text-primary-800 hover:bg-primary-100 dark:hover:bg-zinc-700 transition"
          >
            <Download className="h-4 w-4" />
            {isSafari
              ? t(PWA_TEXT_KEYS.HOW_TO_INSTALL)
              : t(PWA_TEXT_KEYS.INSTALL_APP)}
          </button>
        </div>
      ) : (
        <Button onClick={handleInstall}>
          <div className="flex items-center gap-2 justify-center ">
            <Download className="h-4 w-4" />
            {t(PWA_TEXT_KEYS.PWA_GENERIC_LABEL)}
          </div>
        </Button>
      )}

      {/* Safari Instructions Modal */}
      {showInstructions &&
        createPortal(
          <div
            onClick={() => setShowInstructions(false)}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 transition-opacity animate-fade "
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full m-4 text-center relative animate-fade-up dark:bg-zinc-800 dark:text-white"
            >
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-100"
                onClick={() => setShowInstructions(false)}
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-lg font-semibold mb-4 ">
                {t(PWA_TEXT_KEYS.HOW_TO_INSTALL_APP)}
              </h2>
              <p className="text-sm text-gray-600 mb-2 dark:text-gray-300">
                {t(PWA_TEXT_KEYS.INSTRUCTION_SHARE)}
              </p>
              <p className="text-sm text-gray-600 mb-4 dark:text-gray-300">
                {t(PWA_TEXT_KEYS.INSTRUCTION_ADD_HOME)}
              </p>
              <Button onClick={() => setShowInstructions(false)} fullWidth>
                {t(PWA_TEXT_KEYS.GOT_IT)}
              </Button>
            </div>
          </div>,
          document.getElementById("modal-root")!
        )}
    </>
  );
}
