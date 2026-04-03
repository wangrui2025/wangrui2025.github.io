# 附录：Astro 项目工作状态（2026-04-03）

> 本文档用于会话上下文切换时恢复工作状态

## ✅ 已完成工作

### 1. Tailwind 架构重构（已完成）

**提交**: `2989e00` refactor(styles): migrate to Tailwind-first architecture with Astro 5 ClientRouter

**变更范围**:
- `tailwind.config.mjs` - 完整色彩系统（支持 dark:）
- `global.css` - 815行 → 197行（-76%）
- 12 个组件完全 Tailwind 化
- `ViewTransitions` → `ClientRouter` (Astro 5)
- 移除过时 meta 标签
- KaTeX 按需加载优化

**完全 Tailwind 化的组件**:
- ✅ `AuthorProfile.astro`
- ✅ `Education.astro`
- ✅ `PaperCard.astro`
- ✅ `Masthead.astro`
- ✅ `ScholarBadge.astro`
- ✅ `CvHonorItem.astro`
- ✅ `CvEducationItem.astro`
- ✅ `PaperBadge.astro`
- ✅ `CvPaperItem.astro`
- ✅ `CVLayout.astro`
- ✅ `Sidebar.astro`
- ✅ `BaseLayout.astro`

### 2. PWA 完整支持（已完成）

| 文件 | Commit |
|------|--------|
| `public/robots.txt` | `c57fcc2` |
| `public/manifest.json` | `c57fcc2` |
| `public/sw.js` | `1e98d06` |
| SW 注册脚本 | `1e98d06` |

### 3. 链接预取（已完成）

`Masthead.astro` 所有导航链接已添加 `data-astro-prefetch`（`c57fcc2`）。

### 4. 图标系统优化（已完成）

- `Masthead.astro`: Sun/Moon SVG → `<Icon name="lucide:sun|moon">`
- `ScholarBadge.astro`: Education SVG → `<Icon name="scholar">`

### 5. CSS 布局 Tailwind 化（已完成）

`Masthead.astro` 布局样式从 global.css 迁移到 Tailwind utility classes（`5f406db`）。

### 6. KaTeX 版本更新（已完成）

`0.16.9` → `0.16.11`（`639bf5a`）。

### 7. 清理未使用插件（已完成）

移除 `@tailwindcss/typography`（`a3027a2`）。

---

## 🔧 项目架构（当前状态）

```
astro/
├── src/
│   ├── components/      # 全部 Tailwind 化，内联 SVG 已移除
│   ├── layouts/         # 全部 Tailwind 化
│   ├── content/         # Content Collections (Zod 验证)
│   ├── data/            # TypeScript 数据文件
│   ├── styles/
│   │   └── global.css  # 197行（精简后）
│   ├── icons/           # 自定义 SVG 图标
│   └── pages/           # Astro 路由
├── tailwind.config.mjs  # 完整色彩系统（无未用插件）
├── astro.config.mjs     # Astro 5 + ClientRouter
└── public/
    ├── robots.txt       # SEO
    ├── manifest.json    # PWA
    └── sw.js            # Service Worker
```

---

## 🎨 设计系统（Tailwind 配置）

### 色彩映射

| 用途 | Light | Dark | Tailwind 类 |
|------|-------|------|-------------|
| 背景 | #FAF8F5 | #121212 | `bg-bg-primary` / `dark:bg-bg-dark` |
| 文字 | #3d3d3d | #c9c9c9 | `text-text-primary` / `dark:text-text-dark` |
| 标题 | #1a1a1a | #e8e8e8 | `text-heading-primary` / `dark:text-heading-dark` |
| 链接 | #2563eb | #60a5fa | `text-link-primary` / `dark:text-link-dark` |
| 卡片背景 | #FFFFFF | #1E1E1E | `bg-paper-bg` / `dark:bg-paper-bg-dark` |
| 强调色 | #1e3a5f | #60a5fa | `text-paper-accent` / `dark:text-paper-accent-dark` |

---

## 🚀 快速命令

```bash
# 开发
cd /Users/myk/Repo/wangrui2025.github.io/astro && npm run dev

# 构建
cd /Users/myk/Repo/wangrui2025.github.io/astro && npm run build

# 预览
cd /Users/myk/Repo/wangrui2025.github.io/astro && npm run preview

# 推送
cd /Users/myk/Repo/wangrui2025.github.io && ./scripts/autopush.sh "msg"
```

---

## 📂 关键文件路径

| 文件 | 路径 |
|------|------|
| Tailwind 配置 | `/astro/tailwind.config.mjs` |
| 全局样式 | `/astro/src/styles/global.css` |
| 基础布局 | `/astro/src/layouts/BaseLayout.astro` |
| 主页布局 | `/astro/src/layouts/HomepageLayout.astro` |
| 内容配置 | `/astro/src/content/config.ts` |
| Service Worker | `/astro/public/sw.js` |
| PWA Manifest | `/astro/public/manifest.json` |

---

## ⚠️ 注意事项

1. **暗色模式** - 使用 Tailwind `dark:` 前缀，不再使用 CSS 变量
2. **图片优化** - 使用 `astro:assets`，已配置 `densities={[1, 2]}`
3. **字体加载** - Google Fonts with `display=swap` + preconnect
4. **双语同步** - 修改 `zh.json` 必须同步修改 `en.json`
5. **SVG 图标** - 统一使用 `astro-icon`，本地图标放 `src/icons/`
6. **Service Worker** - 需等页面 load 后注册（`window.addEventListener('load', ...)`）

---

## 📜 全部 Commit（按时间）

| Commit | 内容 |
|--------|------|
| `678390f` | docs(knowledge): add astro tailwind migration case and project appendix |
| `c57fcc2` | perf: add robots.txt, PWA manifest, and prefetch for navigation links |
| `1e98d06` | perf: add PWA service worker with cache-first strategy |
| `639bf5a` | perf: bump KaTeX to 0.16.11 |
| `5f406db` | refactor: migrate inline SVGs to astro-icon and CSS layouts to Tailwind |
| `a3027a2` | perf: remove unused @tailwindcss/typography plugin |
| `2989e00` | refactor(styles): migrate to Tailwind-first architecture with Astro 5 ClientRouter |

---

*最后更新: 2026-04-03 下午*
*会话 ID: 当前会话*
