# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Astro-based academic personal homepage. The site is deployed directly to GitHub Pages.

## Common Commands

```bash
# Install dependencies
cd astro && npm install

# Local development server with live reload
cd astro && npm run dev

# Build the site locally
cd astro && npm run build
```

The site will be available at http://127.0.0.1:4321 during local development.

## Architecture

- **Astro static site**: GitHub Pages builds and serves the static site from `astro/dist`
- **Framework**: Astro v5.x with Tailwind CSS
- **Bilingual support**: English (`/`) and Chinese (`/zh/`) versions via URL routing
- **Google Scholar integration**: Stats stored in `astro/src/content/scholar/stats.json`
- **Publications**: Managed via Content Collections in `astro/src/content/papers/`
- **Theme**: Custom design with CSS variables for light/dark mode

## Key Files

- `astro/astro.config.mjs` - Astro configuration
- `astro/src/layouts/BaseLayout.astro` - Main page layout template
- `astro/src/pages/index.astro` - English homepage
- `astro/src/pages/[lang]/index.astro` - Bilingual homepage template
- `astro/src/components/` - Reusable UI components
- `astro/src/content/` - Content collections (papers, scholar, homepage)
- `astro/src/styles/global.css` - Global styles and theme variables
- `astro/tailwind.config.mjs` - Tailwind CSS configuration

## Academic Features

- **Math rendering**: KaTeX (CDN-loaded)
- **Code highlighting**: Prism via @astrojs/prism
- **Publications**: JSON-based content collection
- **Google Scholar**: Auto-updated via GitHub Actions workflow

## GitHub Pages Deployment

This is a user/organization site. The `astro/dist` folder is deployed to GitHub Pages via `.github/workflows/deploy.yml`.

The site is available at `https://wangrui2025.github.io`.

GitHub Pages builds automatically on push - no manual deployment step needed.

## Content Management

- Edit `astro/src/data/content.ts` for homepage UI text (EN/ZH)
- Add papers as JSON files in `astro/src/content/papers/`
- Education data in `astro/src/data/education.ts`
- Honors data in `astro/src/data/honors.ts`
