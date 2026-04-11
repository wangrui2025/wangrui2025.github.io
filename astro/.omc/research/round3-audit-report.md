# Round 3 Audit — 存档

**时间**: 2026-04-11
**项目**: /Users/myk/Repo/wangrui2025.github.io/astro/
**Astro版本**: v6.1.5
**@astrojs/tailwind**: ^6.0.2

## 构建验证
- `astro check`: 0 errors, 185 hints (zod deprecation)
- `astro build`: ✅ 1.83s, 7 pages, 0 errors
- `pnpm outdated`: tailwindcss 3.4.19 → 4.2.2

## HIGH 问题（需修复）
1. `@astrojs/tailwind@6.0.2` peer range 不含 Astro v6 → 需迁移到 `@tailwindcss/vite`
2. CV 页面缺少完整 SEO meta（canonical, OG, Twitter）

## MED 问题
3. `og:site_name` 用 page title 而非固定站点名
4. Person Schema 缺 `@id`
5. CV 路由缺少 hreflang alternates

## LOW 问题
6. skills_items 内联 style
7. 缺 twitter:site
8. zod deprecation hints（185个，暂缓）

## Context7 结论
- @astrojs/tailwind 是 legacy 包，Tailwind 4 → @tailwindcss/vite
- glob() vs file(): glob() 自动生成 id，当前使用正确
