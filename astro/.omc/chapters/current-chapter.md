## 任务：Astro 项目创建 Pokémon Sprites Gallery 子页面 + 首页链接
## 阶段：已完成
## 完成：
- 创建 `src/data/sprite-sources.ts`：9 个 PokeAPI 精灵图来源配置，含 Gen 边界校验（Gen I=151, Gen II=251, Dream World=649）
- 创建 `src/pages/sprites-gallery.astro`：控制栏（ID 输入/随机/世代筛选）、响应式网格（2→6 列）、卡片信息、键盘快捷键（←/→/R/F）、Favicon 联动、底部 URL 模板
- 更新 `src/layouts/BaseLayout.astro`：通过 `define:vars` + `localStorage` 读取用户 favicon 偏好，覆盖随机逻辑
- 更新 `src/content/homepage/en.json` 和 `zh.json`：Skills 区域增加 Pokémon / 宝可梦链接到 `/sprites-gallery`
- `astro check` 0 errors，`npm run build` 6 pages 成功，Playwright 视觉+功能验证通过
- 记录 CASE-031 并推送至 knowledge repo
## 下一步：
等待用户新指令
## 阻塞：
无
## 涉及文件：
- `src/data/sprite-sources.ts`
- `src/pages/sprites-gallery.astro`
- `src/layouts/BaseLayout.astro`
- `src/content/homepage/en.json`
- `src/content/homepage/zh.json`
## Token：N/A @ 2026-04-16T03:20:00Z
