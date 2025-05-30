import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

// Määrittele ympäristö muuttuja
const isProduction = process.env.NODE_ENV === 'production';

export default defineConfig({
  base: isProduction ? '/roomscontentmanagement/' : './',
  plugins: [react()],
  build: {
    outDir: '../production/roomscontentmanagement',
    minify: 'esbuild',
  },
  esbuild: {
    drop: ["console", "debugger"],
  },
  define: {
    "process.env": process.env,
  },
});
