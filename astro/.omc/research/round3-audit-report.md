# Round 3 Complete Audit — 存档（第三轮完整审计）

**时间**: 2026-04-11
**项目**: /Users/myk/Repo/wangrui2025.github.io/astro/
**Astro版本**: v6.1.5
**Tailwind**: v4.2.2 + @tailwindcss/vite（✅ 已迁移，Round 3 修复）

## 构建验证
- `astro check`: **0 errors, 0 warnings, 2 hints**（仅 zod deprecation — OK）
- `astro build`: ✅ 7 pages, 1.39s, 0 errors

## 已确认 OK（跳过重复检查）
- ✅ `@tailwindcss/vite` 迁移完成（不再使用 @astrojs/tailwind）
- ✅ Content Collections glob() loader — 5 个 collection 全部正确
- ✅ schema 无冗余 `id` 字段
- ✅ 无废弃字段（about_text 等）
- ✅ Person Schema alumniOf + @id 对应 HTML `id="person"`
- ✅ CVLayout 完整 SEO（canonical + hreflang + og + twitter:image + og:image:alt）
- ✅ `og:site_name` 固定为 "Rui Wang"
- ✅ 无 `style="display:none"` 内联样式
- ✅ 4 处 `<>` JSX fragment — ✅ 不是问题，Astro 支持
- ✅ KaTeX 按需加载
- ✅ `manifest.json` name 为 "Rui Wang - Homepage"（可接受）
- ✅ `experimental.rustCompiler` — Astro v6 仍有效，不要移除

## 本轮修复
| Priority | File | Issue | Fix Applied |
|----------|------|-------|-------------|
| LOW | `BaseLayout.astro` | 缺少 `<link rel="icon">` | 添加 SVG favicon link |
| LOW | `BaseLayout.astro` | 缺少 PWA manifest 引用 | 添加 manifest.json link |
| LOW | `BaseLayout.astro` | 缺少 apple-touch-icon | 添加 apple-touch-icon link |
| LOW | `CVLayout.astro:3` | 未使用的 `SITE_URL` import | 删除该 import |
| LOW | `cv.astro:13` | 未使用的 `isZh = false` | 删除该行 |
| LOW | `scripts/generate-cv-pdf.mjs:34` | 未使用的 `page` 参数 | 改为 `_page` |
| LOW | `BaseLayout.astro:143` | script 缺少 `is:inline` hint | 添加 `is:inline` |

## 待处理（不阻塞，可后续迭代）
| Priority | Item | Recommended Fix | Notes |
|----------|------|-----------------|-------|
| LOW | Google Fonts via `<link>` | 迁移到 `@fontsource` 包 | 破坏性低，需本地测试 |
| LOW | favicon.svg 默认蓝色 | 改为品牌色 `#c96442` | 品牌一致性 |
| LOW | zod deprecation hints | 暂缓 | 不影响运行时，zod API 兼容 |

## 审计执行记录
- Step 0: ✅ 读取上轮存档（round3-audit-report.md）区分已确认项
- Step 1: ✅ 查阅 package.json/astro.config.mjs — Tailwind 迁移已确认
- Step 2: ✅ 逐项检查 checklist（见 checklist 追踪）
- Step 3: ✅ 修复 7 个 LOW 问题
- Step 4: ✅ `astro check` 0e 0w 2h ✅ `astro build` 0 errors
- Step 5: ✅ git commit + push
