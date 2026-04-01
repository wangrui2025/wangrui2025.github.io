# Academic Homepage

An Astro-based academic personal homepage with bilingual support (English/Chinese).

**Live Demo**: https://wangrui2025.github.io

> 中文说明见 [README-zh.md](README-zh.md).

## Features

- **Astro Framework** — Fast static site generation, optimized for GitHub Pages
- **Bilingual** — English (`/`) and Chinese (`/zh/`) versions via URL routing
- **Google Scholar Integration** — Citation stats auto-updated daily via GitHub Actions
- **Responsive Design** — Mobile-first with dark mode support
- **Academic Tools** — KaTeX math rendering, Prism code highlighting
- **SEO Ready** — Schema.org Person structured data, Open Graph tags

## Quick Start

### 1. Clone and Setup

```bash
git clone https://github.com/wangrui2025/mykcs.git
cd mykcs/astro && npm install
```

### 2. Development

```bash
cd astro && npm run dev
```

Open http://127.0.0.1:4321

### 3. Configure

Edit these files to customize your homepage:

| File | Purpose |
|------|---------|
| `astro/src/data/content.ts` | Homepage text (EN/ZH) |
| `astro/src/data/education.ts` | Education background |
| `astro/src/data/honors.ts` | Honors and awards |
| `astro/src/content/papers/*.json` | Publications |
| `astro/astro.config.mjs` | Site URL and config |

### 4. Deploy

Push to GitHub — GitHub Pages auto-builds from `astro/dist`.

## Google Scholar Integration

1. Find your Google Scholar ID from your profile URL (e.g., `https://scholar.google.com/citations?user=SCHOLAR_ID`)
2. Add `GOOGLE_SCHOLAR_ID` secret in GitHub repo Settings → Secrets → Actions
3. Enable workflows in Actions tab

Stats are fetched daily at 08:00 UTC.

## Project Structure

```
astro/
├── src/
│   ├── components/     # UI components
│   ├── content/         # Papers & scholar data
│   ├── data/           # Content config
│   ├── layouts/        # Page templates
│   ├── pages/          # Route pages
│   └── styles/         # Global CSS
├── public/             # Static assets
└── astro.config.mjs    # Astro config
```

## Acknowledgments

- Font Awesome (SIL OFL 1.1 / MIT)
- Inspired by [mmistakes/minimal-mistakes](https://github.com/mmistakes/minimal-mistakes) (MIT)
- Inspired by [academicpages/academicpages.github.io](https://github.com/academicpages/academicpages.github.io) (MIT)

