import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { fileURLToPath } from "url";
import AutoImport from "unplugin-auto-import/vite";
import svgr from "vite-plugin-svgr";
import viteCompression from "vite-plugin-compression"; // ✅ NEW
import { allIcons } from "./src/assets/icons";
import pkg from "./package.json";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
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
    viteCompression({
      // ✅ Enable gzip
      algorithm: "gzip",
      threshold: 10240, // Only assets > 10KB
      ext: ".gz",
    }),
  ],
  preview: {
    host: "0.0.0.0",
    port: 1000, // optional: set your preferred port
  },
  server: {
    port: 3000,
  },

  build: {
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@components": path.resolve(__dirname, "src/components"),
      "@pages": path.resolve(__dirname, "src/pages"),
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
