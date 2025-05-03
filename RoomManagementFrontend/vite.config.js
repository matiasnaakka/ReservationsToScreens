import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/roomscontentmanagement/",
  plugins: [react()],
  build: {
    // Use esbuild for minification during the build process
    minify: "esbuild",
  },
  esbuild: {
    // Remove console and debugger statements during the build process
    drop: ["console", "debugger"],
  },
  define: {
    // Pass environment variables to the app during build
    "process.env": process.env,
  },
});
