import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import astroIcon from 'astro-icon';

import tailwindcss from '@tailwindcss/vite';
import { inlineCriticalCSS } from './src/plugins/inline-critical-css.mjs';

export default defineConfig({
  site: 'https://wangrui2025.github.io',
  integrations: [sitemap(), astroIcon()],
  experimental: {
    rustCompiler: true,
  },
  output: 'static',
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
  },
  vite: {
    plugins: [tailwindcss(), inlineCriticalCSS()],
  },
});