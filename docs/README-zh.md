# Academic Homepage

基于 Astro 构建的学术个人主页，支持中英文双语。

**在线演示**: https://wangrui2025.github.io

## 功能特点

- **Astro 框架** — 快速静态站点生成，完美适配 GitHub Pages
- **双语支持** — 通过 URL 路由实现英文 (`/`) 和中文 (`/zh/`) 版本
- **Google Scholar 集成** — 通过 GitHub Actions 每日自动更新引用数据
- **响应式设计** — 移动端优先，支持深色模式
- **学术工具** — KaTeX 数学公式渲染、Prism 代码高亮
- **SEO 优化** — Schema.org Person 结构化数据、Open Graph 标签

## 快速开始

### 1. 克隆并安装依赖

```bash
git clone https://github.com/wangrui2025/mykcs.git
cd mykcs/astro && npm install
```

### 2. 本地开发

```bash
cd astro && npm run dev
```

访问 http://127.0.0.1:4321

### 3. 配置内容

| 文件 | 用途 |
|------|------|
| `astro/src/data/content.ts` | 主页文本内容 (中/英) |
| `astro/src/data/education.ts` | 教育背景 |
| `astro/src/data/honors.ts` | 荣誉奖项 |
| `astro/src/content/papers/*.json` | 论文 publications 数据 |
| `astro/astro.config.mjs` | 站点 URL 和基础配置 |

### 4. 部署

推送到 GitHub — GitHub Pages 会自动从 `astro/dist` 构建部署。

## Google Scholar 集成

1. 从 Google Scholar 个人主页 URL 获取 ID（如 `https://scholar.google.com/citations?user=SCHOLAR_ID`）
2. 在 GitHub 仓库 Settings → Secrets → Actions 中添加 `GOOGLE_SCHOLAR_ID` secret
3. 在 Actions 页面启用 workflows

数据每日 08:00 UTC 自动抓取。

## 项目结构

```
astro/
├── src/
│   ├── components/     # UI 组件
│   ├── content/         # 论文 & scholar 数据
│   ├── data/           # 内容配置
│   ├── layouts/        # 页面模板
│   ├── pages/          # 路由页面
│   └── styles/         # 全局 CSS
├── public/             # 静态资源
└── astro.config.mjs    # Astro 配置
```

## 致谢

- Font Awesome (SIL OFL 1.1 / MIT)
- 参考 [mmistakes/minimal-mistakes](https://github.com/mmistakes/minimal-mistakes) (MIT)
- 参考 [academicpages/academicpages.github.io](https://github.com/academicpages/academicpages.github.io) (MIT)
