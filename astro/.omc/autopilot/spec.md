# Astro Site Round 3 Audit — Phase 0 Spec

## Task
第三轮完整审计 `/Users/myk/Repo/wangrui2025.github.io/astro/`

## Context
- Astro v6.1.5（package.json 写 ^6.1.5，CLAUDE.md 写 v5.x）
- @astrojs/tailwind ^6.0.2
- @astrojs/check ^0.9.8
- @astrojs/sitemap ^3.7.2
- 静态站点，GitHub Pages 部署
- 双语支持：/ + /zh/

## Audit Scope（适配为审计任务而非构建任务）

### 第一优先级：查官方 docs（Context7 MCP）
1. `@astrojs/tailwind` 在 Astro v6 下是否需要升级 — 查 `@astrojs/tailwind` 安装页面
2. Content Collections v5 loader API：file() vs glob() 区别
3. 任何拟建议的 API/配置，先查 docs 确认行为

### Checklist

#### 1. Content Collections（对照 docs 的 loader API）
- `src/content.config.ts` 的 loader 配置（file() vs glob()）
- 各 collection schema 中无冗余 `id` 字段
- 无废弃字段残留

#### 2. SEO & Accessibility
- 所有页面有完整 OG + Twitter + canonical
- og:image:alt 属性
- aria-label 在语言切换等交互元素
- Person Schema 用 alumniOf 而非 knowsAbout，@id 有对应 HTML 元素
- CVLayout 有无完整 SEO

#### 3. 样式和性能
- Google Fonts via `<link>` → 建议 @fontsource 或自托管
- 内联 `style="display:none"` → Tailwind hidden
- KaTeX 按需加载（已知 ok，跳过）

#### 4. 依赖
- @astrojs/tailwind peer dep 警告（Astro v6 不在 6.0.2 peer 范围）
- 任何过期依赖

#### 5. 构建
- `astro check`: 0 errors（允许 deprecation warnings）
- `astro build`: 成功

## Output
发现的问题列表：
| 优先级 | 文件:行 | 问题 | 修复方案 | 已查 docs 确认 |

## Agents
- **Docs-research** (haiku): Context7 查询 @astrojs/tailwind + content collections API
- **Code-audit** (sonnet): Content collections + SEO + Accessibility + Styles
- **Build-verify** (haiku): astro check + astro build
