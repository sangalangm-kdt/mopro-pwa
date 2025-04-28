import { useEffect, useState } from "react";
import Button from "@/components/Button";
import { useAuth } from "@/context/auth/useAuth";
import { Download } from "lucide-react";

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
  const [isVisible, setIsVisible] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();

      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsVisible(true);
      console.log("🔥 beforeinstallprompt event captured");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  const handleInstall = async () => {
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

  return isAuthenticated ? (
    <>
      <span className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
        App
      </span>
      <button
        onClick={handleInstall}
        className="w-full flex items-center gap-2 px-3 py-2 border border-primary-600 rounded text-sm font-semibold text-primary-800 hover:bg-primary-100 dark:hover:bg-zinc-700 transition"
      >
        <Download className="h-4 w-4" />
        Install App
      </button>
    </>
  ) : (
    <Button onClick={handleInstall} fullWidth>
      <div className="flex items-center gap-2 justify-center">
        <Download className="h-4 w-4" />
        Install App
      </div>
    </Button>
  );
}
