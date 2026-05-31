import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["fonts/Inter-Regular.ttf", "robots.txt"],
      manifest: {
        name: "SocialRender",
        short_name: "SocialRender",
        description:
          "Generate Open Graph social cards and syntax-highlighted code screenshots in your browser.",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/",
        icons: [
          {
            src: "/icon-192.svg",
            sizes: "192x192",
            type: "image/svg+xml",
          },
          {
            src: "/icon-512.svg",
            sizes: "512x512",
            type: "image/svg+xml",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,svg,ttf,woff,woff2}"],
        maximumFileSizeToCacheInBytes: 5_000_000,
      },
    }),
  ],
  build: {
    target: "es2022",
    chunkSizeWarningLimit: 800,
  },
  server: {
    port: 5173,
  },
});
