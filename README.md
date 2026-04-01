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

## 项目自动化架构

本项目采用**三层自动化系统**。修改任何配置前，请先理解这个架构：

```
┌─────────────────────────────────────────────────────────────────┐
│  第一层：Claude Code 钩子（触发器）                              │
│  文件：.claude/settings.json                                    │
│  ├─ PostToolUse 钩子：监听 Edit/Write/Bash 操作                 │
│  └─ 动作：调用 scripts/autopush.sh                              │
│                                                                  │
│  何时修改：想改变自动提交的触发条件或超时时间                     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  第二层：Autopush 脚本（逻辑层）                                 │
│  文件：scripts/autopush.sh                                      │
│  ├─ git add -A（排除 .astro 缓存）                              │
│  ├─ 生成 Conventional Commit 提交信息                           │
│  ├─ git commit                                                  │
│  ├─ git pull --rebase                                           │
│  └─ git push                                                    │
│                                                                  │
│  何时修改：想改变提交信息格式或 git 操作流程                      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  第三层：GitHub Actions（CI/CD）                                 │
│  文件：.github/workflows/*.yml                                  │
│  ├─ deploy.yml：构建并部署到 GitHub Pages                       │
│  └─ update_google_scholar_stats.yml：定时更新引用数             │
│                                                                  │
│  何时修改：想改变部署方式或定时任务                               │
└─────────────────────────────────────────────────────────────────┘
```

### 配置文件速查表

| 文件 | 作用 | 何时修改 |
|------|------|----------|
| `.claude/settings.json` | 钩子触发器 + 项目权限 | 想改变自动提交何时触发（如排除某些工具） |
| `.claude/settings.local.json` | 本地权限（git、npm 等） | 需要允许新的 Bash 命令或工具 |
| `scripts/autopush.sh` | 提交信息生成 + git 工作流 | 想改变提交信息格式或 git 操作顺序 |
| `.github/workflows/deploy.yml` | 构建与部署管道 | 需要改变构建步骤或部署目标 |
| `.github/workflows/update_google_scholar_stats.yml` | 定时引用数更新 | 需要改变定时计划或学者数据获取方式 |
| `CLAUDE.md` | Claude 的项目上下文 | 想更新项目概述或常用命令 |

### 提交信息自动化

提交信息遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范：
```
<type>(<scope>): <description>
```

类型根据修改的文件自动确定：
- `style(global):` - CSS/样式变更
- `content(honors|education|publications):` - 数据更新
- `feat(navigation|profile|layout):` - 组件功能
- `ci(automation|workflows):` - 脚本/CI 变更
- `docs(readme):` - 文档
- `chore(ext):` - 其他文件

**修改提交信息行为**：编辑 `scripts/autopush.sh` → `generate_commit_msg()` 函数。

## Acknowledgments

- Font Awesome (SIL OFL 1.1 / MIT)
- Inspired by [mmistakes/minimal-mistakes](https://github.com/mmistakes/minimal-mistakes) (MIT)
- Inspired by [academicpages/academicpages.github.io](https://github.com/academicpages/academicpages.github.io) (MIT)

