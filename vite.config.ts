import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@assets': path.resolve(__dirname, './public/assets'),
      '@shared': path.resolve(__dirname, './shared'),
    },
  },
  
  build: {
    outDir: 'dist',
    sourcemap: mode !== 'production',
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ai: ['@google/generative-ai', 'openai'],
          ui: ['@radix-ui/react-*'],
        },
      },
    },
  },
  
  define: {
    'import.meta.env.VITE_APP_VERSION': JSON.stringify(process.env.npm_package_version),
  },
  
  server: {
    port: 3000,
    open: true,
    fs: {
      strict: true,
      deny: ['**/.*'],
    },
  },
  
  preview: {
    port: 3000,
    open: true,
  },
}));
