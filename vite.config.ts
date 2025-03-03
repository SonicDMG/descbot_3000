
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    cors: true,
    hmr: {
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
    'process.env': {},
  },
  build: {
    // Clean the output directory before building
    emptyOutDir: true,
    // Improve build process
    minify: 'terser',
    sourcemap: false,
    // Handle crypto polyfill
    rollupOptions: {
      // Externalize any problematic dependencies
      external: ['crypto'],
    }
  },
}));
