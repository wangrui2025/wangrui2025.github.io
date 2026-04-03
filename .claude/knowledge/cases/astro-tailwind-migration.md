---
name: Astro Tailwind Architecture Migration
description: 从 CSS 变量 + global.css + Tailwind 混合架构迁移到纯 Tailwind + Astro 5 现代特性
date: 2026-04-03
tags: [astro, tailwind, refactoring, css-architecture, dark-mode]
status: completed
---

## 问题描述

Astro 学术主页项目存在**三重混合架构**问题：
- `global.css` 815 行定义大量工具类和样式
- Tailwind CSS 部分使用，未充分发挥 utility-first 优势
- 组件中存在大量 `<style>` scoped styles
- 暗色模式基于 CSS 变量 + `:global(.dark)` 选择器

这种混合架构导致：
1. 维护困难（修改样式需查多个位置）
2. Tailwind 配置和 CSS 变量重复定义
3. 组件样式分散，难以追踪

## 最终解决方案

### 1. 色彩系统重构

在 `tailwind.config.mjs` 中定义完整的色彩系统：

```javascript
colors: {
  paper: {
    DEFAULT: '#FFFFFF',
    dark: '#1E1E1E',
    border: '#E5E5E5',
    'border-dark': '#2A2A2A',
    accent: '#1e3a5f',
    'accent-dark': '#60a5fa',
  },
  text: {
    DEFAULT: '#3d3d3d',
    dark: '#c9c9c9',
  },
  // ... 其他色彩
}
```

### 2. Astro 5 升级

- `ViewTransitions` → `ClientRouter` (Astro 5 新 API)
- 字体加载添加 `display=swap`
- 移除过时 meta 标签 (`HandheldFriendly`, `MobileOptimized`)

### 3. 组件完全 Tailwind 化

所有组件从 scoped styles 迁移到 Tailwind classes：
- `AuthorProfile.astro`
- `Education.astro`
- `PaperCard.astro`
- `Masthead.astro`
- `ScholarBadge.astro`
- `CvHonorItem.astro`
- `CvEducationItem.astro`
- `PaperBadge.astro`
- `CvPaperItem.astro`

### 4. global.css 精简

从 815 行精简到 235 行（-71%），仅保留：
- 基础 reset
- 代码块样式
- 打印样式（CV 需要）
- View Transition 动画禁用

## 关键教训

### 1. Tailwind 配置设计

**推荐命名方式**：
```javascript
// 好：语义化命名
colors: {
  paper: { DEFAULT: '#FFF', dark: '#1E1E1E' },
  text: { DEFAULT: '#333', dark: '#ccc' }
}

// 使用
text="text-text-primary dark:text-text-dark"
bg="bg-paper-bg dark:bg-paper-bg-dark"
```

**避免的坑**：
- 不要保留 CSS 变量和 Tailwind 配置并行
- 不要混用 `:global(.dark)` 和 `dark:` 前缀

### 2. 图片响应式配置

```astro
<Image
  src={image}
  alt={alt}
  width={600}
  height={300}
  densities={[1, 2]}  <!-- Retina 支持 -->
  sizes="(max-width: 768px) 100vw, 400px"
/>
```

### 3. 暗色模式最佳实践

```html
<!-- 正确：全部用 Tailwind dark: -->
<div class="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">

<!-- 错误：混合 CSS 变量 -->
<div style="background: var(--bg-color)">
```

### 4. 迁移顺序

推荐按依赖关系分批：
1. 基础组件（无依赖）: `AuthorProfile`, `Sidebar`
2. 卡片组件: `PaperCard`, `Education`
3. 布局组件: `Masthead`, `BaseLayout`
4. CV 组件（独立）: `CvPaperItem`, `CvHonorItem`

### 5. 构建验证

每次修改后立即验证：
```bash
cd astro && npm run build
```

## 文件变更统计

```
20 files changed, 118 insertions(+), 579 deletions(-)

global.css:  815 lines → 235 lines (-71%)
组件: 12 个完全 Tailwind 化
```

## 相关提交

- `2989e00` refactor(styles): migrate to Tailwind-first architecture with Astro 5 ClientRouter

## 经验总结

1. **彻底优于渐进** - 对于这种规模的项目，一次性重构比渐进迁移更高效
2. **色彩系统是核心** - 先设计好 tailwind.config 的色彩结构，其他都基于此
3. **保持视觉一致性** - 重构前后页面看起来应该完全一致
4. **CV 打印样式例外** - `@media print` 保留在 `<style>` 中是合理的
