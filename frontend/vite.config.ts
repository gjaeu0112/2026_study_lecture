import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiProxyTarget = env.VITE_API_PROXY_TARGET || 'http://localhost:3000';
  const port = Number(env.VITE_PORT) || 5173;

  const proxy = {
    '/api': {
      target: apiProxyTarget,
      changeOrigin: true,
      rewrite: (path: string) => path.replace(/^\/api/, ''),
    },
  };

  return {
    plugins: [react()],
    server: {
      host: '0.0.0.0',
      port,
      proxy,
    },
    preview: {
      host: '0.0.0.0',
      port,
      proxy,
    },
  };
});
