# Round 3 Audit — 存档（已执行修复）

**时间**: 2026-04-11
**项目**: /Users/myk/Repo/wangrui2025.github.io/astro/
**Commit**: `4268b6c` (待 push)
**Astro版本**: v6.1.5
**@astrojs/tailwind**: ^6.0.2 (legacy, peer range 不含 v6)

## 构建验证
- `astro check`: 0 errors, 0 warnings, 187 hints (zod deprecation — OK)
- `astro build`: ✅ 2.32s, 7 pages, 0 errors
- `pnpm outdated`: tailwindcss 3.4.19 → 4.2.2

## 已修复
| Priority | File | Issue | Fix Applied |
|----------|------|-------|-------------|
| HIGH | `CVLayout.astro` | CV pages missing SEO meta | Added canonical, hreflang, og:* (image+alt), twitter:card |
| HIGH | `BaseLayout.astro:146` | Person Schema @id has no HTML anchor | Added `id="person"` to `<body>` |
| MED | `BaseLayout.astro:71` | og:site_name uses page title | Changed to fixed `"Rui Wang"` |
| MED | `structuredData.ts:10` | Person Schema missing @id | Added `"@id": "https://wangrui2025.github.io/#person"` |
| LOW | `en.json:37`, `zh.json:37` | Inline `style='color: black'` | Replaced with Tailwind theme classes |

## 待处理（需确认）
| Priority | File | Issue | Recommended Fix |
|----------|------|-------|-----------------|
| HIGH | `package.json` | `@astrojs/tailwind@6.0.2` peer range excludes Astro v6 | Migrate to `@tailwindcss/vite` via `astro add tailwind`（破坏性变更，需本地测试） |
| LOW | `src/content.config.ts` | 185× zod deprecation hints | 暂缓，不影响运行时 |

## Context7 Docs 结论
- @astrojs/tailwind v6.x 是 legacy 包，Tailwind 4 + Astro v6 推荐 `@tailwindcss/vite`
- glob() vs file(): glob() 自动生成 id，当前 5 个 collection 全部正确使用
