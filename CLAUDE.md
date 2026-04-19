# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 请参考

请先阅读 `~/.claude/CLAUDE.md` 获得通用知识。

## Project Overview

This is an Astro-based academic personal homepage. The site is deployed directly to GitHub Pages.

## ⚠️ 两个项目区分（必须先确认）

| 项目 | URL | 功能 |
|------|-----|------|
| **主站（当前项目）** | wangrui2025.github.io/ | 王锐个人主页，有 CV/Publications 等 |
| **sprites-gallery** | wangrui2025.github.io/sprites-gallery/ | 宝可梦图鉴，grid 展示所有 sprite 来源 |

**Favicon 行为（两个项目相同）：**

| 属性 | 值 |
|------|-----|
| 默认 favicon | Lotad (静态 HTML link) |
| 刷新行为 | 随机 regular + shiny (2665个) |
| 实现方式 | fetch manifest.json → 随机选择 |
| 无 localStorage | 每次都是真随机 |

**主站关键文件：**
- `src/components/Favicon.astro` — 动态随机 favicon 逻辑
- `public/favicons/` — 静态 Lotad 图标（astro-icon 覆盖后被 post-build 脚本恢复）
- `scripts/inline-critical-css.mjs` — post-build 恢复 Lotad 图标

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
- **Framework**: Astro v6.1.5 with Tailwind CSS v4 + `@tailwindcss/vite` (migrated from `@astrojs/tailwind` on 2026-04-11)
- **⚠️ Tailwind v4 Critical Migration Rules**（迁移后已验证，禁止违反）:
  - `tailwind.config.mjs` 完全被 v4 忽略（darkMode/content/theme/colors 全部失效）
  - v4 主题必须写在 `src/styles/global.css` 的 `@theme {}` 块里
  - dark mode 必须用 `@custom-variant dark (&:where(.dark, .dark *))` 启用 class 模式
  - `@theme` 里的 `--text-*` 长度变量自动生成 `.text-*` 字体工具，**禁止用 `text-[--var]`**（会生成 `color:` 而非 `font-size:`）
  - `tailwind.config.mjs` 保留仅为参考，不要往里面加任何影响构建的配置
- **⚠️ FOUC 防护（2026-04-11）**：Tailwind v4 + Vite 将 utility class CSS 输出到外部 CSS 文件，通过 `<link rel="stylesheet">` 异步加载。`@font-face` 链式加载导致字体 FOUC。**必须使用 `scripts/inline-critical-css.mjs` post-build 脚本将全部 CSS 内联到 HTML `<head>` 中**，`npm run build` 已自动集成此步骤。
- **Bilingual support**: English (`/`) and Chinese (`/zh/`) versions via `[lang]` dynamic route
- **Google Scholar integration**: Stats stored in `astro/src/content/scholar/stats.json`
- **Publications**: Managed via Content Collections in `astro/src/content/papers/`
- **Theme**: Custom design with CSS variables for light/dark mode
- **Rust compiler**: `experimental.rustCompiler: true` + `@astrojs/compiler-rs` (both still valid in Astro v6)

## Key Files

- `astro/astro.config.mjs` - Astro configuration (Rust compiler, sitemap, Tailwind v4 via @tailwindcss/vite)
- `astro/src/layouts/BaseLayout.astro` - Main page layout template
- `astro/src/pages/index.astro` - English homepage
- `astro/src/pages/[lang]/index.astro` - Bilingual homepage template
- `astro/src/components/` - Reusable UI components
- `astro/src/content/` - Content collections (papers, scholar, homepage)
- `astro/src/styles/global.css` - Global styles and theme variables
- `astro/tailwind.config.mjs` - Tailwind CSS v3 config (legacy, kept for reference; v4 theme migrated to `src/styles/global.css` @theme block)

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

**Content Collections** (Astro v6 loader API):

| Collection | Path | Loader |
|------------|------|--------|
| Homepage | `src/content/homepage/{en,zh}.json` | `glob()` |
| Papers | `src/content/papers/*.json` | `glob()` |
| Scholar stats | `src/content/scholar/stats.json` | `glob()` |
| Education | `src/content/education/education.json` | `glob()` |
| Honors | `src/content/honors/honors.json` | `glob()` |

**⚠️ Loader 规则：单文件=单entry 用 `glob()`，不用 `file()`。** `file()` 会把 JSON 顶级键拆成多个 entry。

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

## Design 页面同步协议

**`/design/` 页面是这个项目的唯一设计文档。每次设计变更时，必须同步更新该页面。**

### 触发场景

| 设计变更类型 | 同步到 Design 页面的哪个 section |
|-------------|-------------------------------|
| 新增 / 修改组件 | **Components** section |
| 新增 / 修改页面 | **Pages** section |
| 修改配色 / 字体 / 间距 / CSS 变量 | **Tokens** section |
| 修改主题、暗黑模式、FOUC 处理 | **Components** (ThemeToggle) 或 **Philosophy** |
| Commit 后 | 在 **Timeline** 追加 commit SHA + 简短描述 |

### 操作流程

1. 完成设计变更，Commit 并 Push
2. 打开 `astro/src/pages/design.astro`
3. 更新对应的 section（Favicon/Tokens/Components/Pages）
4. 在 Timeline 最顶部（W17 位置）插入新的 commit 条目
5. Commit：`docs(design): sync [变更描述]`
6. Push

### 示例

新增了一个 `ProjectCard` 组件：
```
1. 完成组件代码，git commit -m "feat(components): add ProjectCard for project showcase"
2. git push
3. 在 design.astro 的 Components section 添加 ProjectCard 说明
4. 在 Timeline 顶部添加：code>abc1234</code> — add ProjectCard component
5. git add + commit + push
```

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
| `.claude/rules/` | 行为准则（含 common/ 通用规则 + behavioral/ 行为规则 + 语言特定规则） |
| `.claude/rules/common/` | 通用规则：development-workflow, testing, code-review, hooks, patterns, performance, security, coding-style, agents, git-workflow |
| `.claude/rules/typescript/` | TypeScript 特定规则（coding-style, testing, patterns, security, hooks） |
| `.claude/rules/behavioral/` | 行为规则：Post-Fix 验证、自我进化、案例记录、备份 |
| `.claude/memory/` | 用户偏好、反馈、静态上下文 |
| `.claude/knowledge/` | 知识库：案例记录 (`cases/`) + 约定规范 (`conventions/`) |
| `.claude/case/` | 已解决的 technical cases（CV 布局、移动端缩放等） |
| `.claude/commands/` | 自定义 slash 命令（如 `/push`） |
| `.claude/scripts/` | 自我进化脚本（evolution-trigger.sh, evolution-distill.sh） |
| `.claude/DESIGN.md` | 设计系统文档（色彩、字体、组件规范） |

**行为规则引擎**：
- Post-Fix 验证 → `.claude/rules/behavioral-post-fix-validation.md`
- 失败 2 次触发自省 → `.claude/rules/meta-cognition-engine.md`
- 问题解决后自动记录案例 → `.claude/rules/behavioral-cases.md`
- 内存/知识变更自动 push → `.claude/rules/behavioral-backup.md`
- **Benchmark-First 元规则** → `.claude/rules/behavioral-benchmark-first.md`

**通用规则**（`.claude/rules/common/`）：
- `development-workflow.md` — Research-First Protocol（GitHub → Docs → Exa 调研顺序）+ Plan/TDD/Review 流程
- `testing.md` — 80% 覆盖率要求，TDD RED-GREEN-REFACTOR 流程
- `code-review.md` — CRITICAL/HIGH/MEDIUM/LOW severity 分级，Approve/Warning/Block 判定
- `performance.md` — 模型选择决策树（Haiku/Sonnet/Opus 场景），Context Window 管理
- `hooks.md` — PreToolUse/PostToolUse/Stop 钩子类型，TodoWrite 实时 steering
- `security.md` — 强制性安全检查清单
- `coding-style.md` — 不可变性原则，文件组织规范
- `patterns.md` — Repository 模式，API Response Format，Skeleton Projects 流程
- `agents.md` — 代理编排，parallel agent 执行规范
- `git-workflow.md` — Conventional Commits 格式

**约定规范**（`.claude/knowledge/conventions/`）：
- `bilingual-alignment.md` — 中英文必须同步修改
- `conventional-commits.md` — Commit message 规范
- `git-rebase-workflow.md` — Push 前必须 fetch/rebase
- `astro-patterns.md` — Astro scoped CSS 与组件模式规范

## Astro 6.x 收敛检查清单（精简版）

> 来源：`~/.claude/memory/astro-6-modernization-checklist.md`（Frozen v1.0）

### 完成定义（6 项全过）
1. `src/` 全量反模式扫描完成
2. `npx astro check` 0 errors / 0 warnings / 0 hints
3. `npm run build` 通过
4. 9 项回归脚本全部通过
5. 修改文件数 > 3 时，`code-reviewer` agent 通过
6. Playwright E2E 通过（如有配置）

### 禁止写法（Hard No）
- `is:inline` 页面级脚本内联 → `src/scripts/` + `astro:page-load`
- 页面级资源放 `public/` → `src/styles/` 或组件 `<style>`
- 字符串拼接 locale URL → `getRelativeLocaleUrl(locale, path)`
- `getEntry(...)!` 非空断言 → `if (!entry) throw new Error(...)`
- `<ViewTransitions />` → `<ClientRouter />`
- `Astro.glob(...)` → `import.meta.glob(..., { eager: true })`
- `<Image format="webp" />` → 移除，由 Sharp 自动优化
- `__themeBound` / `__copyBound` → 事件委托 `e.target.closest('[data-action]')`
- 重复页面并存（`/cv.astro` + `/[lang]/cv.astro`）→ 仅保留 `[lang]/cv.astro`

### Build 后 9 项回归脚本
```bash
# 1. Build 产物存在
ls -d dist/
# 2. 无 TS 错误
npx astro check
# 3. ClientRouter 激活
grep -r "astro-route-announcer" dist/
# 4. 结构化数据注入
grep -r "application/ld+json" dist/
# 5. SW 注册（如有）
grep -r "navigator.serviceWorker.register" dist/ || true
# 6. CSS 变量层内联
grep -r "@fontsource" dist/ || grep -r "--color-" dist/
# 7. CSS utility 层存在
grep -r 'class="[^"]*bg-[^"]*"' dist/ | head -5
# 8. 无残留 is:inline（排除第三方）
test -z "$(grep -r 'is:inline' dist/ | grep -v 'third-party')" && echo "OK" || echo "WARN"
# 9. Open Graph 标签
grep -r "og:image" dist/
```
