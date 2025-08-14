// src/pwa/install-bus.ts
export interface BeforeInstallPromptEvent extends Event {
  prompt: () => void;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

let saved: BeforeInstallPromptEvent | null = null;
const listeners = new Set<(e: BeforeInstallPromptEvent | null) => void>();

// Attach ASAP (module side-effect)
if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e: Event) => {
    // IMPORTANT: stop the mini-infobar and keep the event
    (e as any).preventDefault?.();
    saved = e as BeforeInstallPromptEvent;
    listeners.forEach((cb) => cb(saved));
  });

  window.addEventListener("appinstalled", () => {
    saved = null;
    listeners.forEach((cb) => cb(saved));
  });
}

export function getSavedBip() {
  return saved;
}

export function subscribeBip(cb: (e: BeforeInstallPromptEvent | null) => void) {
  listeners.add(cb);
  // Push current value immediately
  cb(saved);
  return () => listeners.delete(cb);
}
