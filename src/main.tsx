import { createRoot } from "react-dom/client";
import "./index.css";
import { registerSW } from "virtual:pwa-register";
import "@/i18n.ts";
import "react-toastify/dist/ReactToastify.css";

import App from "./App.tsx";
import { AuthProvider } from "./context/AuthProvider.tsx";

registerSW();
createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <>
      <App />
    </>
  </AuthProvider>
);
