import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import AutoImport from "unplugin-auto-import/vite";
import { fileURLToPath } from "url";
import { defineConfig, type UserConfigExport } from "vite";
import viteCompression from "vite-plugin-compression";
import { VitePWA } from "vite-plugin-pwa";
import svgr from "vite-plugin-svgr";
import pkg from "./package.json";

// __dirname polyfill for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config: UserConfigExport = {
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
  plugins: [
    react(),
    tailwindcss(),
    svgr(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: [
        "favicon.ico",
        "apple-touch-icon.png",
        "safari-pinned-tab.svg",
      ],
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
      algorithm: "brotliCompress",
      ext: ".br",
    }),
    viteCompression({
      algorithm: "gzip",
      threshold: 10240,
      ext: ".gz",
    }),
  ],
  preview: {
    host: "0.0.0.0",
    port: parseInt(process.env.PORT || "1000"),
  },
  server: {
    port: 4000,
  },
  build: {
    minify: true,
    target: "esnext",
    // @ts-expect-error: esbuild config is valid in runtime but not recognized due to stale TS types
    esbuild: {
      drop: ["console", "debugger"],
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
};

export default defineConfig(config);
