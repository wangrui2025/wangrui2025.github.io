import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import astroIcon from 'astro-icon';

export default defineConfig({
  site: 'https://wangrui2025.github.io',
  integrations: [tailwind(), sitemap(), astroIcon()],
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
    css: {
      postcss: './postcss.config.mjs',
    },
  },
});
