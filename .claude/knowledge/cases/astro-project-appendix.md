# 附录：Astro 项目工作状态（2026-04-03）

> 本文档用于会话上下文切换时恢复工作状态

## ✅ 已完成工作

### 1. Tailwind 架构重构（已完成）

**提交**: `2989e00` refactor(styles): migrate to Tailwind-first architecture with Astro 5 ClientRouter

**变更范围**:
- `tailwind.config.mjs` - 完整色彩系统（支持 dark:）
- `global.css` - 815行 → 235行（-71%）
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

### 2. 构建验证

```bash
cd /Users/myk/Repo/wangrui2025.github.io/astro
npm run build  # ✅ 通过
```

### 3. Git 推送

已推送至 GitHub Pages，自动部署完成。

---

## 📝 待办事项（可选优化）

### 低优先级

1. **添加 `robots.txt`**
   - 位置: `/astro/public/robots.txt`
   - 内容:
   ```
   User-agent: *
   Allow: /
   Sitemap: https://wangrui2025.github.io/sitemap-index.xml
   ```

2. **链接预取优化**
   - 文件: `Masthead.astro`
   - 修改:
   ```astro
   <a href={item.url} data-astro-prefetch>{item.title}</a>
   ```

3. **PWA 支持（可选）**
   - 添加 `manifest.json`
   - 添加 service worker

---

## 🔧 项目架构（当前状态）

```
astro/
├── src/
│   ├── components/      # 全部 Tailwind 化
│   ├── layouts/         # 全部 Tailwind 化
│   ├── content/         # Content Collections (Zod 验证)
│   ├── data/            # TypeScript 数据文件
│   ├── styles/
│   │   └── global.css   # 235行（精简后）
│   └── pages/           # Astro 路由
├── tailwind.config.mjs  # 完整色彩系统
├── astro.config.mjs     # Astro 5 + ClientRouter
└── public/              # 静态资源
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

---

## ⚠️ 注意事项

1. **暗色模式** - 使用 Tailwind `dark:` 前缀，不再使用 CSS 变量
2. **图片优化** - 使用 `astro:assets`，已配置 `densities={[1, 2]}`
3. **字体加载** - Google Fonts with `display=swap`
4. **双语同步** - 修改 `zh.json` 必须同步修改 `en.json`

---

*最后更新: 2026-04-03*
*会话 ID: 当前会话*
