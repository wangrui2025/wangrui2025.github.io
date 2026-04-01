# AI 助手项目上下文

> **用途**: 将本文件内容直接粘贴给 Claude、ChatGPT、Gemini 等 AI 助手，使其快速理解本项目技术栈和修改规范。
> **更新日期**: 2026-04-01

---

## 一句话总结

这是一个基于 **Astro v5 + Tailwind CSS v3** 构建的**学术个人主页**，部署在 **GitHub Pages**，支持**中英文双语**、**暗色模式**和**Google Scholar 引用自动同步**，关键配置在 `astro/astro.config.mjs`。

---

## 目录结构（必须知道的）

```
项目根目录/
├── DESIGN.md                      # 视觉设计系统文档（权威）
├── astro/                          # 网站源码（全部在此目录下）
│   ├── src/
│   │   ├── components/             # Astro 组件
│   │   │   ├── AuthorProfile.astro # 侧边栏作者简介
│   │   │   ├── Education.astro     # 教育经历卡片
│   │   │   ├── Masthead.astro      # 顶部导航栏
│   │   │   ├── PaperCard.astro     # 论文展示卡片（核心组件）
│   │   │   ├── ScholarBadge.astro  # Google Scholar 引用徽章
│   │   │   ├── Scripts.astro       # 客户端脚本（主题切换）
│   │   │   └── Sidebar.astro       # 侧边栏布局
│   │   ├── content/                # 内容集合（Astro Content Collections）
│   │   │   ├── config.ts           # 内容集合 Schema 定义
│   │   │   ├── homepage/           # 首页文案（en.json / zh.json）
│   │   │   ├── papers/             # 论文数据（*.json）
│   │   │   └── scholar/            # Scholar 统计数据
│   │   │       └── stats.json      # 引用数、H-index 等
│   │   ├── data/                   # TypeScript 数据文件
│   │   │   ├── content.ts          # 首页 UI 文案（双语）
│   │   │   ├── education.ts        # 教育经历
│   │   │   ├── honors.ts           # 荣誉奖项
│   │   │   ├── index.ts            # 数据导出
│   │   │   └── navigation.ts       # 导航配置
│   │   ├── layouts/
│   │   │   └── BaseLayout.astro    # 基础布局（HTML 模板）
│   │   ├── pages/                  # 路由页面
│   │   │   ├── index.astro         # 英文首页 (/)
│   │   │   ├── en.astro            # 英文首页别名
│   │   │   └── [lang]/
│   │   │       └── index.astro     # 动态语言路由 (/zh/)
│   │   ├── styles/
│   │   │   └── global.css          # 全局样式 + CSS 变量
│   │   ├── env.d.ts                # Astro 类型声明
│   │   └── middleware.ts           # Astro 中间件
│   ├── package.json                # npm 依赖
│   ├── astro.config.mjs            # Astro 主配置
│   └── tailwind.config.mjs         # Tailwind 配置
├── .github/
│   └── workflows/
│       ├── deploy.yml              # GitHub Pages 部署
│       └── update_google_scholar_stats.yml  # Scholar 数据同步
├── scripts/
│   ├── autopush.sh                 # 自动提交脚本（重要！）
│   └── fetch_scholar.py            # Scholar 数据抓取
├── gs_data_shieldsio.json          # Shields.io 徽章数据
└── requirements.txt                # Python 依赖
```

---

## 技术依赖版本

| 包名 | 版本 | 用途 |
|------|------|------|
| astro | ^5.0.0 | 静态站点生成器 |
| @astrojs/tailwind | ^6.0.0 | Tailwind 集成 |
| @astrojs/sitemap | ^3.7.2 | 站点地图 |
| tailwindcss | ^3.4.0 | CSS 框架 |
| @tailwindcss/typography | ^0.5.0 | 排版样式 |

**Node 版本**: 22（CI 环境）

---

## 核心配置详解

### 1. astro.config.mjs

```javascript
export default defineConfig({
  site: 'https://wangrui2025.github.io',
  integrations: [tailwind(), sitemap()],
  output: 'static',
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
  },
});
```

**关键配置**:
- `site`: 站点 URL（必须正确，影响 sitemap 和 canonical）
- `output: 'static'`: 纯静态输出，适配 GitHub Pages
- `shikiConfig`: 代码块高亮主题

### 2. tailwind.config.mjs

**关键配置**:
- `darkMode: 'class'`: 通过 CSS class 切换暗色模式
- 自定义颜色映射 CSS 变量（`--paper-bg`, `--text-color` 等）
- 字体: Inter（西文）、Noto Serif SC（中文衬线）

### 3. Content Collections Schema (src/content/config.ts)

定义了三种内容类型：

**papers**: 论文数据，含标题、作者、会议、字段标签等双语字段
**scholar**: Google Scholar 统计数据（引用数、h-index 等）
**homepage**: 首页所有文案内容

---

## 主题系统（暗色模式）

通过 CSS 变量实现，定义在 `global.css`:

```css
:root {
  --bg-color: #ffffff;
  --text-color: #323232;
  /* ... 更多变量 */
}

.dark {
  --bg-color: #1a1a1a;
  --text-color: #c9c9c9;
  /* ... 暗色覆盖 */
}
```

**切换机制**: `Scripts.astro` 中的 inline script 检测 `localStorage.theme` 或 `prefers-color-scheme`

---

## 常用操作命令

```bash
# 进入项目目录
cd astro

# 安装依赖
npm install

# 开发服务器（http://127.0.0.1:4321）
npm run dev

# 构建（输出到 astro/dist/）
npm run build

# 预览构建结果
npm run preview
```

---

## 部署流程

**平台**: GitHub Pages
**触发条件**: `main` 分支 push

工作流 `.github/workflows/deploy.yml`:
1. 检出代码
2. 设置 Node 22 + npm cache
3. 恢复 Astro build cache (`.astro/`, `dist/`)
4. `npm ci` 安装依赖
5. `npm run build` 构建
6. 上传 `astro/dist` 到 GitHub Pages

---

## Google Scholar 自动同步

**工作流**: `.github/workflows/update_google_scholar_stats.yml`
**触发**: 每日 UTC 08:00 (cron)

流程:
1. Python 脚本 `scripts/fetch_scholar.py` 抓取 Scholar 数据
2. 更新 `astro/src/content/scholar/stats.json`
3. 更新 `gs_data_shieldsio.json`（用于徽章）
4. 提交并推送更改
5. 可选：更新 GitHub Gist

**所需 Secrets**:
- `GOOGLE_SCHOLAR_ID`: Scholar 用户 ID
- `GIST_PAT` (可选): GitHub Personal Access Token

---

## 自动化提交系统（重要！）

本项目使用 Claude Code 钩子 + `autopush.sh` 实现自动提交。

**禁止**: 直接运行 `git commit`
**正确流程**:
1. AI 分析改动 (`git diff --cached`)
2. 调用 `./scripts/autopush.sh "<message>"`
3. 脚本自动执行：暂存 → 提交 → pull --rebase → push

**提交信息规范** (Conventional Commits):
```
<type>(<scope>): <description>
```

常用类型:
- `style(global)`: CSS/样式变更
- `content(honors|education|publications)`: 数据内容更新
- `feat(navigation|profile|layout)`: 功能组件
- `ci(automation|workflows)`: 脚本/CI
- `docs(readme)`: 文档

---

## 双语实现机制

**路由**:
- `/` → `pages/index.astro`（英文）
- `/zh/` → `pages/[lang]/index.astro`（中文）

**数据组织**:
- 内容集合 JSON 文件包含 `zh` 和 `en` 字段
- `data/content.ts` 分离 UI 文案
- `data/honors.ts` 等包含双语数组

**切换**: Masthead 组件中的语言链接

---

## 修改注意事项

### 添加新论文

1. 在 `astro/src/content/papers/` 创建 JSON 文件
2. 遵循 Schema 结构（见 `config.ts`）
3. 包含字段标签（fields）和技术标签（technologies）
4. 在 `pages/index.astro` 和 `[lang]/index.astro` 添加 `<PaperCard paperKey="文件名" />`

### 修改首页文案

编辑 `astro/src/content/homepage/en.json` 或 `zh.json`

### 修改样式

- 全局样式: `astro/src/styles/global.css`
- Tailwind 配置: `astro/tailwind.config.mjs`
- 组件样式: 各 `.astro` 文件的 `<style>` 标签

### 修改部署配置

**注意**: 站点 URL 在多处定义，需同步修改：
- `astro/astro.config.mjs` → `site`
- `astro/src/content/homepage/en.json` → 所有绝对 URL
- `gs_data_shieldsio.json` → `schemaVersion` 中的 URL

---

## 常见问题

**Q: 如何修改作者信息？**
A: 编辑 `astro/src/components/AuthorProfile.astro`

**Q: 如何修改导航链接？**
A: 编辑 `astro/src/data/navigation.ts`

**Q: 如何添加新的内容集合？**
A: 1) 在 `content/` 创建目录 2) 在 `config.ts` 定义 Schema 3) 重启 dev server

**Q: 为什么样式没生效？**
A: 检查 Tailwind `content` 配置是否包含你的文件路径

---

## 文件速查表

| 想修改什么 | 去哪里找 |
|------------|----------|
| 站点标题/描述 | `astro/src/content/homepage/*.json` |
| 作者简介/头像 | `astro/src/components/AuthorProfile.astro` |
| 论文列表 | `astro/src/content/papers/*.json` + `pages/index.astro` |
| 教育经历 | `astro/src/data/education.ts` |
| 荣誉奖项 | `astro/src/data/honors.ts` |
| 导航栏 | `astro/src/data/navigation.ts` + `Masthead.astro` |
| 页脚 | `astro/src/components/Scripts.astro` |
| 主题颜色 | `DESIGN.md` (完整设计系统文档) |
| 部署配置 | `.github/workflows/deploy.yml` |
| Scholar 同步 | `.github/workflows/update_google_scholar_stats.yml` |

---

## 技术栈徽章

复制到 README 或其他文档：

```markdown
[![Astro](https://img.shields.io/badge/Astro-5.0-BC52EE?logo=astro)](https://astro.build)
[![Tailwind](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss)](https://tailwindcss.com)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Deployed-222?logo=github)](https://wangrui2025.github.io)
```
