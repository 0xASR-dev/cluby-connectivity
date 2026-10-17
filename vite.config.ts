import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: true,
    port: 5173,
    strictPort: false,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks(id) {
          const normalizedId = id.replace(/\\/g, '/');

          if (normalizedId.includes('/node_modules/@radix-ui/')) {
            return 'ui';
          }

          if (/\/node_modules\/(?:react|react-dom|react-router-dom)\//.test(normalizedId)) {
            return 'vendor';
          }
        },
      },
    },
  },
  define: {
    // Fix for "process is not defined" error
    'process.env': {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      MONGODB_URI: JSON.stringify(process.env.MONGODB_URI),
      JWT_SECRET: JSON.stringify(process.env.JWT_SECRET)
    }
  }
});
