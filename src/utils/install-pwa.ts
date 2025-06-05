import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export function usePwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isSafari, setIsSafari] = useState(false);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const nav = window.navigator as Navigator & { standalone?: boolean };

    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches || nav.standalone;
    if (isStandalone) return;

    const ua = nav.userAgent.toLowerCase();
    const safari =
      /safari/.test(ua) && !/chrome/.test(ua) && !/android/.test(ua);
    setIsSafari(safari);

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    if (!safari) {
      window.addEventListener("beforeinstallprompt", handler);
    } else {
      setIsInstallable(true);
    }

    return () => {
      if (!safari) {
        window.removeEventListener("beforeinstallprompt", handler);
      }
    };
  }, []);

  const promptInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  };

  return { deferredPrompt, isSafari, isInstallable, promptInstall };
}
