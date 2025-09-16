import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  // טען משתני סביבה לפי מצב (dev / prod)
  const env = loadEnv(mode, process.cwd(), '');

  return {
    base: mode === 'prod' ? '/support-dashboard/prod/' : '/support-dashboard/dev/',
    plugins: [react()],
    server: {
      port: 3000,
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL, // כאן זה כבר עובד
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
