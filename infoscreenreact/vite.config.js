import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import compression from 'vite-plugin-compression';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import path from 'path';
 
// Determine if we are in production (GitHub Pages) or local development
const isProduction = process.env.NODE_ENV === 'production';
const isCI = process.env.CI === 'true'; // Detect GitHub Actions
 
export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        icon: true,
      },
    }),
 
    // Use gzip instead of brotli for GitHub Pages compatibility
    isProduction &&
      compression({
        algorithm: 'gzip',
        ext: '.gz',
      }),
 
    // ⚠️ Disable ViteImageOptimizer in GitHub Actions (CI/CD)
    !isCI &&
      ViteImageOptimizer({
        png: {
          quality: 80,
          compressionLevel: 9,
        },
        jpeg: {
          quality: 80,
        },
        jpg: {
          quality: 80,
        },
        webp: {
          quality: 80,
          lossless: false,
        },
        avif: {
          quality: 1, // Lowest possible AVIF quality
          speed: 10, // Fastest AVIF compression
          lossless: false,
        },
        cache: true,
        logStats: true,
        cacheLocation: path.resolve(__dirname, '.cache/vite-plugin-image-optimizer'),
      }),
  ].filter(Boolean), // Removes false/null values to avoid errors
 
  base: isProduction ? '/reservationstatus/' : './',
 
  build: {
    outDir: '../production/infoscreenreact',
    assetsInlineLimit: 4096, // 4kb - files smaller than this will be inlined as base64
    minify: false,
 
    rollupOptions: {
      output: {
        // Use chunking for better caching
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
 
        // Optimize asset file names for better caching
        assetFileNames: (assetInfo) => {
          if (assetInfo.name) {
            const info = assetInfo.name.split('.');
            const ext = info[info.length - 1];
            if (['png', 'jpg', 'jpeg', 'webp', 'avif'].includes(ext)) {
              return `assets/images/[name]-[hash].[ext]`;
            }
          }
          return `assets/[name]-[hash].[ext]`;
        },
      },
    },
  },
});