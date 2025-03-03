
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    // Add security settings for development server
    cors: true,
    hmr: {
      // Improve security for Hot Module Replacement
      clientPort: 8080
    },
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    // Fix for crypto.getRandomValues issue
    'process.env': {},
    'global': {},
  },
  build: {
    // Enable node polyfills for the build
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  }
}));
