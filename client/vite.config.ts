import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from 'path'

// Production-grade HTTP Security Headers
const securityHeaders = {
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'", // inline theme script & Vite module execution
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: blob: http://localhost:5000 http://localhost:5173 http://localhost:4173 http://127.0.0.1:5000 https:",
    "connect-src 'self' http://localhost:5000 http://localhost:5173 http://localhost:4173 http://127.0.0.1:5000 ws://localhost:5173 ws://127.0.0.1:5173 https:",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; '),
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  server: {
    headers: securityHeaders,
    proxy: {
      '/uploads': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  preview: {
    port: 4173,
    headers: securityHeaders,
    proxy: {
      '/uploads': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    cssMinify: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        passes: 2,
        pure_getters: true,
        unsafe_arrows: true,
      },
      mangle: {
        safari10: true,
      },
    },
    reportCompressedSize: false,
    modulePreload: {
      polyfill: true,
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('framer-motion')) {
              return 'vendor-motion';
            }
            if (id.includes('react-router') || id.includes('react-dom') || id.includes('/react/')) {
              return 'vendor-react';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            if (id.includes('gsap')) {
              return 'vendor-gsap';
            }
            if (id.includes('axios')) {
              return 'vendor-network';
            }
            if (id.includes('embla-carousel')) {
              return 'vendor-carousel';
            }
          }
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
})

