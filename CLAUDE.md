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

## Tools

**使用 ripgrep (rg) 而非 grep**：所有内容搜索优先使用 `Grep` 工具（基于 ripgrep），避免使用 bash `grep` 命令。

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

## Bilingual Content — 中英文同步

**修改中文内容时，必须同步修改英文内容，反之亦然。**

### 触发场景

- 修改 `zh.json` → 立即检查并修改 `en.json` 对应条目
- 修改 `en.json` → 立即检查并修改 `zh.json` 对应条目
- 修改论文 JSON 的 `zh.title` → 同步修改 `en.title`

### 示例

| 中文修改 | 英文同步 |
|---------|---------|
| GDKVM 标题改"使用" | en.json 中 GDKVM 标题同步检查 |
| timeline 新增条目 | zh.json + en.json 同时新增 |

### Timeline 顺序维护

**按 period 降序排列（Present 在前，最早的在后）。**

修改 timeline 条目时，必须保持全局顺序：
- 新增条目 → 插入到正确的时间位置
- 拆分条目（如本科拆为入学/毕业）→ 确保中间条目在正确位置
- 每次修改后检查 period 顺序是否正确

### Honor 顺序维护

**按重要程度降序排列（国家奖学金 > 校级特等奖 > 校级一等奖 > ... > 本科）**，不按时间。荣誉奖项来自 `honors.ts`，与 timeline 独立。

## Git Workflow — 自动推送

**⚠️ 每次修改代码后，必须自动推送，无需等待确认。**

### 操作流程

1. **修改完成后，立即执行**：
   ```bash
   ./scripts/autopush.sh "<语义化提交信息>"
   ```
2. **脚本自动完成**：暂存 → 提交 → pull --rebase → push

### 提交信息规范

使用 **Conventional Commits**：`type(scope): 简短描述`

| ❌ 错误 | ✅ 正确 |
|--------|---------|
| `同步改动` | `refactor(timeline): unify award entry titles` |
| `update zh.json` | `style(homepage): remove redundant prefix from timeline descriptions` |
| `fix bug` | `fix(nav): resolve mobile menu collapse on iOS Safari` |

### 冲突处理

如果 `git pull --rebase` 失败：
```bash
git fetch origin && git reset --hard origin/main
# 重新应用改动后再次 autopush
```

## Claude Agent 配置 (`.claude/`)

Agent 的规则、记忆、案例和工具脚本都集中在 `.claude/` 目录下：

| 路径 | 用途 |
|------|------|
| `.claude/rules/` | 行为准则（Post-Fix 验证、自我进化、案例记录、备份等） |
| `.claude/memory/` | 用户偏好、反馈、静态上下文 |
| `.claude/knowledge/` | 知识库：案例记录 (`cases/`) + 约定规范 (`conventions/`) |
| `.claude/case/` | 已解决的 technical cases（CV 布局、移动端缩放等） |
| `.claude/commands/` | 自定义 slash 命令（如 `/push`） |
| `.claude/scripts/` | 自我进化脚本（evolution-trigger.sh, evolution-distill.sh） |
| `.claude/DESIGN.md` | 设计系统文档（色彩、字体、组件规范） |

**规则引擎**：
- Post-Fix 验证 → `.claude/rules/behavioral-post-fix-validation.md`
- 失败 2 次触发自省 → `.claude/rules/meta-cognition-engine.md`
- 问题解决后自动记录案例 → `.claude/rules/behavioral-cases.md`
- 内存/知识变更自动 push → `.claude/rules/behavioral-backup.md`

**约定规范**（`.claude/knowledge/conventions/`）：
- `bilingual-alignment.md` — 中英文必须同步修改
- `conventional-commits.md` — Commit message 规范
- `git-rebase-workflow.md` — Push 前必须 fetch/rebase
- `astro-patterns.md` — Astro scoped CSS 与组件模式规范
