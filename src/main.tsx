import { createRoot } from "react-dom/client";
import "./index.css";
import { registerSW } from "virtual:pwa-register";
import "@/i18n.ts";

import App from "./App.tsx";
import { AuthProvider } from "./context/auth/AuthProvider.tsx";
import { ThemeProvider } from "./context/theme/ThemeContext.tsx";

registerSW({ immediate: true });
window.addEventListener("beforeinstallprompt", (e) => {
  console.log("[PWA] beforeinstallprompt fired", e);
});
window.addEventListener("appinstalled", () => {
  console.log("[PWA] appinstalled");
});
console.log(
  "[PWA] display-mode standalone?",
  matchMedia("(display-mode: standalone)").matches
);
console.log(
  "[PWA] navigator.standalone (iOS)?",
  (navigator as any).standalone === true
);

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </AuthProvider>
);
