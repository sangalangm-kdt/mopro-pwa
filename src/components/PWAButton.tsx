import { useEffect, useState } from "react";
import Button from "@/components/Button";
import { useAuth } from "@/context/useAuth";

// Inline fallback type declaration
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
  const [isVisible, setIsVisible] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      const event = e as BeforeInstallPromptEvent;
      setDeferredPrompt(event);
      setIsVisible(true);

      console.log("🔥 beforeinstallprompt event fired");
    };

    window.addEventListener("beforeinstallprompt", handler as EventListener);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handler as EventListener
      );
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;

    if (result.outcome === "accepted") {
      console.log("✅ PWA installed");
    }

    setDeferredPrompt(null);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return isAuthenticated ? (
    // 👤 Logged-in: show as a setting-style item
    <>
      <span className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
        App
      </span>
      <button
        onClick={handleInstall}
        className="block w-full text-left px-3 py-3 font-semibold border border-primary-600 text-sm text-primary-800  hover:bg-primary-100 dark:hover:bg-zinc-700 rounded"
      >
        Install app
      </button>
    </>
  ) : (
    // 🚫 Guest: show as a full button
    <Button onClick={handleInstall} fullWidth>
      PWA
    </Button>
  );
}
