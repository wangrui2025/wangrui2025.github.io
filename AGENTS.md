# AI Agent Documentation

## 项目概述

基于 Astro 构建的学术个人主页，支持中英文双语。

- **仓库**: https://github.com/wangrui2025/mykcs
- **部署**: GitHub Pages
- **在线演示**: https://wangrui2025.github.io
- **语言**: 双语 (English + Chinese)

## 技术栈

| 组件 | 技术 |
|------|------|
| 静态站点生成 | Astro v5.x |
| CSS 框架 | Tailwind CSS |
| 数学公式 | KaTeX (CDN) |
| 代码高亮 | Prism (@astrojs/prism) |
| 部署 | GitHub Pages |

## 项目结构

```
astro/
├── src/
│   ├── components/      # UI 组件
│   │   └── *.astro      # Astro 组件
│   ├── content/
│   │   ├── papers/      # 论文数据 (JSON)
│   │   └── scholar/      # Google Scholar 统计
│   ├── data/
│   │   ├── content.ts    # 主页文本 (EN/ZH)
│   │   ├── education.ts # 教育背景
│   │   └── honors.ts    # 荣誉奖项
│   ├── layouts/
│   │   └── BaseLayout.astro  # 基础布局
│   ├── pages/
│   │   ├── index.astro   # 英文首页 (/)
│   │   └── [lang]/       # 多语言路由 (/zh/)
│   └── styles/
│       └── global.css    # 全局样式 & 主题变量
├── public/              # 静态资源
│   └── images/          # 图片 & favicon
└── astro.config.mjs    # Astro 配置
```

## 常用命令

```bash
# 安装依赖
cd astro && npm install

# 本地开发 (热重载)
cd astro && npm run dev

# 构建静态站点
cd astro && npm run build
```

本地开发地址: http://127.0.0.1:4321

## 内容管理

### 主页文本

编辑 `astro/src/data/content.ts`:
- `hero` — 首页标语
- `about` — 关于部分
- `publications` — 论文列表
- `experience` — 工作经历

### 论文数据

在 `astro/src/content/papers/` 添加 JSON 文件:
```json
{
  "title": "Paper Title",
  "conference": "CVPR 2024",
  "authors": ["Author Name"],
  "links": {
    "arxiv": "url",
    "github": "url"
  }
}
```

### Google Scholar

统计数据存储在 `astro/src/content/scholar/stats.json`，由 GitHub Actions 每日自动更新。

## 部署

GitHub Pages 自动构建:
1. 推送至 `main` 分支
2. GitHub Actions 构建 `astro/dist`
3. 部署至 https://wangrui2025.github.io

## 致谢

- Font Awesome (SIL OFL 1.1 / MIT)
- 参考 [mmistakes/minimal-mistakes](https://github.com/mmistakes/minimal-mistakes) (MIT)
- 参考 [academicpages/academicpages.github.io](https://github.com/academicpages/academicpages.github.io) (MIT)
