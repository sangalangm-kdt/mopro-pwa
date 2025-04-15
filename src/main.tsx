import { createRoot } from "react-dom/client";
import "./index.css";
import { registerSW } from "virtual:pwa-register";
import "@/i18n.ts";
import "react-toastify/dist/ReactToastify.css";

import App from "./App.tsx";
import { AuthProvider } from "./context/auth/AuthProvider.tsx";
import { ThemeProvider } from "./context/theme/ThemeContext.tsx";

registerSW();
createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </AuthProvider>
);
