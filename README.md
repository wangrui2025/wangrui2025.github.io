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

## Project Automation Architecture

This project uses a **three-layer automation system**. Understand this before modifying any configuration:

```
┌─────────────────────────────────────────────────────────────────┐
│  LAYER 1: Claude Code Hooks (Trigger)                           │
│  File: .claude/settings.json                                    │
│  ├─ PostToolUse hook: watches Edit/Write/Bash                   │
│  └─ Action: calls scripts/autopush.sh                           │
│                                                                  │
│  WHEN TO MODIFY: Change trigger conditions or timeout           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  LAYER 2: Autopush Script (Logic)                               │
│  File: scripts/autopush.sh                                      │
│  ├─ git add -A (excludes .astro cache)                          │
│  ├─ Generate Conventional Commit message                        │
│  ├─ git commit                                                  │
│  ├─ git pull --rebase                                           │
│  └─ git push                                                    │
│                                                                  │
│  WHEN TO MODIFY: Change commit message format or git workflow   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  LAYER 3: GitHub Actions (CI/CD)                                │
│  Files: .github/workflows/*.yml                                 │
│  ├─ deploy.yml: Build & deploy to GitHub Pages                  │
│  └─ update_google_scholar_stats.yml: Cron job for citations     │
│                                                                  │
│  WHEN TO MODIFY: Change deployment or scheduled tasks           │
└─────────────────────────────────────────────────────────────────┘
```

### Configuration Files Reference

| File | Purpose | Modify When |
|------|---------|-------------|
| `.claude/settings.json` | Hook triggers + project permissions | You want to change WHEN autopush runs (e.g., exclude certain tools) |
| `.claude/settings.local.json` | Local permissions (git, npm, etc.) | You need to allow new Bash commands or tools |
| `scripts/autopush.sh` | Commit message generation + git workflow | You want to change HOW commits are formatted or the git sequence |
| `.github/workflows/deploy.yml` | Build & deploy pipeline | You need to change build steps or deployment target |
| `.github/workflows/update_google_scholar_stats.yml` | Scheduled citation update | You need to change cron schedule or scholar data fetching |
| `CLAUDE.md` | Project context for Claude | You want to update project overview or common commands |

### Commit Message Automation

Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/):
```
<type>(<scope>): <description>
```

Types are automatically determined by changed files:
- `style(global):` - CSS/styling changes
- `content(honors|education|publications):` - Data updates
- `feat(navigation|profile|layout):` - Component features
- `ci(automation|workflows):` - Script/CI changes
- `docs(readme):` - Documentation
- `chore(ext):` - Other files

**To change commit message behavior**: Edit `scripts/autopush.sh` → `generate_commit_msg()` function.

## Acknowledgments

- Font Awesome (SIL OFL 1.1 / MIT)
- Inspired by [mmistakes/minimal-mistakes](https://github.com/mmistakes/minimal-mistakes) (MIT)
- Inspired by [academicpages/academicpages.github.io](https://github.com/academicpages/academicpages.github.io) (MIT)

