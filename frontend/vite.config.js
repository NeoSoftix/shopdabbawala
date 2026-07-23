import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Split heavy, rarely-changing vendor libraries into their own
        // chunks so the browser can cache them separately from app code -
        // an app deploy no longer forces a re-download of react/recharts/etc,
        // and the chart/email-editor bundles only load on the pages that use them.
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (/[\\/](react|react-dom|react-router-dom)[\\/]/.test(id)) return "vendor-react";
          if (/[\\/](framer-motion|gsap)[\\/]/.test(id)) return "vendor-motion";
          if (id.includes("recharts")) return "vendor-charts";
          if (/[\\/](lucide-react|react-icons)[\\/]/.test(id)) return "vendor-icons";
        },
      },
    },
  },
});