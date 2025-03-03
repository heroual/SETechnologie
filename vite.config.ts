import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import viteCompression from 'vite-plugin-compression';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isAnalyze = mode === 'analyze';
  
  return {
    plugins: [
      react(),
      viteCompression({
        algorithm: 'gzip',
        ext: '.gz',
      }),
      viteCompression({
        algorithm: 'brotliCompress',
        ext: '.br',
      }),
      isAnalyze && visualizer({
        open: true,
        filename: 'dist/stats.html',
        gzipSize: true,
        brotliSize: true,
      }),
    ],
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
    build: {
      // Enable chunk splitting for better caching
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            'firebase-vendor': ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/storage'],
            'ui-vendor': ['framer-motion', 'react-hot-toast', 'lucide-react'],
            'chart-vendor': ['recharts']
          }
        }
      },
      // Minify output
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
    },
    // Enable source map in development only
    sourcemap: mode === 'development',
    // Improve CSS handling
    css: {
      devSourcemap: mode === 'development',
      modules: {
        scopeBehaviour: 'local',
      },
    },
    // Improve server performance
    server: {
      hmr: {
        overlay: true,
      },
      watch: {
        usePolling: false,
      },
    },
  };
});