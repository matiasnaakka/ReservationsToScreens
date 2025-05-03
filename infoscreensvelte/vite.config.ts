import {sveltekit} from '@sveltejs/kit/vite';
import {defineConfig} from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  // @ts-expect-error - Vite types are not up-to-date
  base: process.env.NODE_ENV === 'production' ? '/infoScreenProject' : '/',
  define: {
    __BUILD_TIME__: JSON.stringify(new Date().toISOString())
    // },
    // build: {
    //   target: 'esnext',
    //   minify: 'terser',
    //   rollupOptions: {
    //     output: {
    //       manualChunks: {
    //         vendor: ['@sveltejs/kit']
    //       }
    //     }
    //   },
    //   chunkSizeWarningLimit: 1000
    // },
    // optimizeDeps: {
    //   include: ['three']
    // },
    // server: {
    //   watch: {
    //     usePolling: true
    //   },
    //   fs: {
    //     strict: false
    //   }
  }
});
