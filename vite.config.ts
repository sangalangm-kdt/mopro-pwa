import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { fileURLToPath } from "url";
import AutoImport from "unplugin-auto-import/vite";
import svgr from "vite-plugin-svgr";
import { allIcons } from "./src/assets/icons";

// Fix __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    svgr(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "MOPro",
        short_name: "MOPro",
        description: "A mobile-friendly QR scanner and monitoring progress app",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
        icons: allIcons,
      },
      workbox: {
        clientsClaim: true,
        skipWaiting: true,
      },
    }),

    AutoImport({
      imports: ["react", "react-router-dom"],
      dts: "src/auto-imports.d.ts",
    }),
  ],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@components": path.resolve(__dirname, "src/components"),
      "@pages": path.resolve(__dirname, "src/pages"), // <-- fix this line
      "@constants": path.resolve(__dirname, "src/constants"),
      "@layouts": path.resolve(__dirname, "src/layouts"),
      "@router": path.resolve(__dirname, "src/router"),
      "@locales": path.resolve(__dirname, "src/locales"),
      "@assets": path.resolve(__dirname, "src/assets"),
      "@hooks": path.resolve(__dirname, "src/hooks"),
      "@context": path.resolve(__dirname, "src/context"),
      "@types": path.resolve(__dirname, "src/types"),
    },
  },
});
