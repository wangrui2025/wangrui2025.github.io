---
name: CV 移动端 A4 缩放方案
description: 解决移动端简历页面内容重排问题，实现 PDF 般原生缩放体验
date: 2026-04-03
tags: [mobile, viewport, CSS, Astro, CV]
status: resolved
---

## 问题描述

移动端访问简历页面（CV）时，页面需要表现得像一张 A4 尺寸的 PDF 文件：
- 版面严格锁定，不允许内容重排
- 默认适配屏幕宽度（整体等比例缩小）
- 支持双指缩放，缩放后可横向滑动查看细节

## 失败尝试

### 尝试 1：响应式宽度 + 百分比
**方案：** 移动端将 `.cv-page` 的 `width` 改为 `100vw`，内容使用百分比布局。

**失败原因：** 内容会随着屏幕宽度变化而重新排布（例如 grid 列数变化、字体换行位置改变），无法保持 A4 版面的严格对应关系。

### 尝试 2：CSS zoom 属性
**方案：** 使用 `zoom: calc(100vw / 210mm)` + `-moz-transform: scale()` 缩放整个页面。

**失败原因：** Firefox 对 `zoom` 属性支持不佳，`-moz-transform` 需要额外处理 `transform-origin`，且两者同时存在时行为不一致。

### 尝试 2.5：移除移动端 CSS，回归固定尺寸
**方案：** 保持 `.cv-page` 为固定的 `210mm`，不加任何移动端覆盖样式。

**失败原因：** 移动端浏览器会强制横向滚动（因为屏幕宽度 < 794px），用户不得不一开始就左右滑动才能看完整内容，体验差。

## 最终解决方案

**方案 1（已采用）：固定 Viewport 宽度**

在 CV 页面专用的 `CVLayout.astro` 中，将 `<meta name="viewport">` 的 `width` 从 `device-width` 改为固定像素值：

```html
<meta name="viewport" content="width=794, initial-scale=1.0, user-scalable=yes" />
```

**为什么有效：**
- `width=794` 对应 A4 纸宽度（210mm）在 96dpi 下的像素值
- 浏览器自动将 794px 宽的页面等比例缩放以适应任何屏幕宽度
- 页面内容完全不变（字体、间距、换行位置均与桌面端一致）
- 支持原生双指缩放和横向滑动，行为与 PDF 阅读器一致
- 所有现代浏览器均支持，无兼容性问题

**实现代码：**

```astro
// CVLayout.astro
export interface Props {
  title: string;
  description?: string;
  lang?: string;
  viewport?: string; // 新增 prop，默认 width=794
}

const {
  viewport = 'width=794', // 默认 A4 宽度像素值
} = Astro.props;

// 模板中
<meta name="viewport" content={`${viewport}, initial-scale=1.0, user-scalable=yes`} />
```

## 关键教训

1. **不要用响应式布局处理"固定尺寸"需求**：响应式的本质是"内容适应容器"，但 A4 简历需要的是"容器适应屏幕"——这是两种完全相反的需求。

2. **viewport 固定宽度是 PDF 类页面的标准解法**：在前端领域，处理"不可重排的固定尺寸页面"（报表、简历、票据等）的正确做法是修改 viewport 的 `width` 值，而不是试图用 CSS 控制。

3. **`zoom` 是过渡方案，不适合生产环境**：虽有 polyfill 效果，但 `zoom` 不是 CSS 标准属性，各浏览器支持参差不齐。

4. **渐进信任原则的应用**：Claude 一开始尝试了"看似合理的 CSS 方案"（zoom/transform），被用户否定后，才被迫走向正确的底层方案（viewport）。这说明技术债往往来自于"先实现再说"的偷懒路径。

## 待关注

- 确保其他使用 `CVLayout` 的页面不受影响（目前只有 `/cv` 和 `/zh/cv` 使用）
- 打印 PDF 场景（`@media print`）已单独处理，不依赖 viewport
