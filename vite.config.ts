import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { compression } from "vite-plugin-compression2";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), compression({ algorithms: ["gzip"] })],
  build: {
    target: "esnext",
    minify: "esbuild",
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            // React core & Router
            if (
              id.includes("react") ||
              id.includes("react-dom") ||
              id.includes("react-router")
            ) {
              return "vendor-react";
            }
            // React Query
            if (id.includes("@tanstack/react-query")) {
              return "vendor-query";
            }
            // UI & Icons
            if (
              id.includes("lucide-react") ||
              id.includes("sonner") ||
              id.includes("tailwindcss")
            ) {
              return "vendor-ui";
            }
            // Forms & Validation
            if (
              id.includes("react-hook-form") ||
              id.includes("zod") ||
              id.includes("@hookform/resolvers")
            ) {
              return "vendor-forms";
            }
            // State & Đa ngôn ngữ
            if (
              id.includes("zustand") ||
              id.includes("i18next") ||
              id.includes("react-i18next")
            ) {
              return "vendor-state";
            }
            // Các package node_modules còn lại
            return "vendor-others";
          }
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    css: true,
  },
});
