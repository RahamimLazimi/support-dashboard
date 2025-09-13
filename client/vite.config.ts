import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  return {
    base: mode === 'prod' ? '/support-dashboard/prod/' : '/support-dashboard/dev/',
    plugins: [react()],
    server: {
      port: 3000,
      proxy: {
        '/api': {
          target: process.env.VITE_API_BASE_URL,
          changeOrigin: true,
          secure: false,
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  };
});
