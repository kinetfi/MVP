import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import bootstrap from "./src/lib/bootstrap.min.js";

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [react(), bootstrap],
    build: {
      target: 'esnext',
      chunkSizeWarningLimit: 2000,
      minify: false,
      commonjsOptions: {
        transformMixedEsModules: true,
      },
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
