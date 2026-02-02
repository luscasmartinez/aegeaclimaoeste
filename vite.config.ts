import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      // Proxy para Feriados API - resolve problema de CORS em desenvolvimento
      // /api-feriados/feriados/cidade/123 -> https://feriadosapi.com/api/v1/feriados/cidade/123
      '/api-feriados': {
        target: 'https://feriadosapi.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-feriados/, '/api/v1'),
        secure: true,
        followRedirects: true,
      },
    },
  },
});
