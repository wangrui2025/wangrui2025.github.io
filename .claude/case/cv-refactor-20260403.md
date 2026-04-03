---
name: CV页面重构
description: 重构学术简历页面，统一数据源，修复布局和作者高亮问题
date: 2026-04-03
tags: [astro, cv, css-grid, frontend]
status: resolved
---

## 问题描述

CV 页面存在多个问题：
1. 中英文 CV 内容重复，数据分散在 Astro 页面中
2. HTML/CSS 结构混乱，`</BaseLayout>` 标签错误
3. 论文布局使用 `justify-content: space-between`，标题过长时排版崩溃
4. 作者名字全部置灰，丢失了本人（一作）的视觉强调

## 失败尝试

- 使用 `display: flex` + `justify-content: space-between` 处理会议标签和标题 → 标题换行时对齐崩溃
- 将所有作者（本人+其他）统一设置为灰色 → 违反学术简历规范，本人名字应加粗高亮
- 多次 Edit 操作导致 CSS 片段错位到 HTML 结构中 → 构建失败 `Expected "}" but found ":"`

## 最终解决方案

### 1. 数据层
创建统一的 `cv.ts` 数据文件，包含中英文双语数据

### 2. 布局层
使用 CSS Grid 实现学术标准布局：
```css
.cv-pub-entry {
  display: grid;
  grid-template-columns: 52pt 1fr;
  gap: 6pt;
  align-items: start;
}
```

### 3. 作者高亮
本人名字加粗黑色，其他作者灰色

### 4. 最终布局效果
```
[CVPR 2026] OSA: Echocardiography Video Segmentation via...
             王锐， 吴惠思， 秦璟
             [arXiv][Project]
```

## 关键教训

1. **CSS 必须严格包裹在 `<style>` 标签内** — 在 Astro 中，裸露的 CSS 代码会导致编译崩溃
2. **学术简历中本人名字必须高亮** — 加粗或下划线，不能置灰
3. **Grid 比 Flexbox 更适合固定标签+自适应内容的布局** — 避免 `space-between` 在换行时的崩溃问题
4. **复杂布局修改前先读完整文件** — 避免 CSS 片段错位到 HTML 结构中

## 相关文件

- `astro/src/data/cv.ts` — 统一的 CV 数据源
- `astro/src/pages/cv.astro` — 英文 CV 页面
- `astro/src/pages/zh/cv.astro` — 中文 CV 页面
- `astro/src/layouts/CVLayout.astro` — CV 页面布局模板
