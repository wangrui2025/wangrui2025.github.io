import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import astroIcon from 'astro-icon';

import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://wangrui2025.github.io',
  integrations: [sitemap(), astroIcon()],
  prefetch: true,
  experimental: {
    rustCompiler: true,
  },
  output: 'static',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
  },
  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      wrap: true,
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});