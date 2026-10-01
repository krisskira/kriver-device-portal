import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { seoFiles } from './scripts/vite-plugin-seo.ts';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', 'VITE_');

  return {
    plugins: [react(), tailwindcss(), seoFiles({ siteUrl: env.VITE_SITE_URL })],
    base: './',
  };
});
