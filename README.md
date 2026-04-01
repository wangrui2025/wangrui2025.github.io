# 学术主页

> **给其他 AI 助手**: 如需了解本项目技术栈和修改规范，请阅读 [AI_CONTEXT.md](AI_CONTEXT.md)。

基于 Astro 的学术个人主页，支持中英双语。

**在线演示**: https://wangrui2025.github.io

## 功能特性

- **Astro 框架** — 快速静态站点生成，针对 GitHub Pages 优化
- **双语支持** — 通过 URL 路由实现英文 (`/`) 和中文 (`/zh/`) 版本
- **Google Scholar 集成** — 通过 GitHub Actions 每日自动更新引用数据
- **响应式设计** — 移动优先，支持深色模式
- **学术工具** — KaTeX 数学渲染、Prism 代码高亮
- **SEO 就绪** — Schema.org Person 结构化数据、Open Graph 标签

## 快速开始

### 1. 克隆与安装

```bash
git clone https://github.com/wangrui2025/mykcs.git
cd mykcs/astro && npm install
```

### 2. 开发

```bash
cd astro && npm run dev
```

访问 http://127.0.0.1:4321

### 3. 配置

编辑以下文件来自定义你的主页：

| 文件 | 用途 |
|------|------|
| `astro/src/data/content.ts` | 首页文案（中英） |
| `astro/src/data/education.ts` | 教育背景 |
| `astro/src/data/honors.ts` | 荣誉奖项 |
| `astro/src/content/papers/*.json` | 论文发表 |
| `astro/astro.config.mjs` | 站点 URL 和配置 |

### 4. 部署

推送到 GitHub — GitHub Actions 自动构建并部署到 GitHub Pages。

## Google Scholar 集成

1. 从个人资料 URL 获取 Google Scholar ID（例如 `https://scholar.google.com/citations?user=SCHOLAR_ID`）
2. 在 GitHub 仓库 Settings → Secrets → Actions 中添加 `GOOGLE_SCHOLAR_ID`
3. 在 Actions 标签页启用工作流

数据每日 UTC 08:00 自动获取。

**引用数徽章**: 通过 Shields.io Endpoint 直接链接实现：
```markdown
![Citations](https://img.shields.io/endpoint?url=https://wangrui2025.github.io/gs_data_shieldsio.json)
```

部署后徽章可通过 `https://img.shields.io/endpoint?url=https://你的域名/gs_data_shieldsio.json` 访问。

## 项目结构

```
astro/
├── src/
│   ├── components/     # 界面组件
│   ├── content/        # 论文与学者数据
│   ├── data/           # 内容配置
│   ├── layouts/        # 页面模板
│   ├── pages/          # 路由页面
│   └── styles/         # 全局样式
├── public/             # 静态资源
└── astro.config.mjs    # Astro 配置
```

## 项目自动化架构

本项目采用**三层自动化系统**。修改任何配置前，请先理解这个架构：

```
┌─────────────────────────────────────────────────────────────────┐
│  第一层：Claude Code 钩子（触发器）                              │
│  文件：.claude/settings.json                                    │
│  ├─ PostToolUse 钩子：监听 Edit/Write/Bash 操作                 │
│  └─ 动作：调用 scripts/autopush.sh                              │
│                                                                  │
│  何时修改：想改变自动提交的触发条件或超时时间                     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  第二层：Autopush 脚本（逻辑层）                                 │
│  文件：scripts/autopush.sh                                      │
│  ├─ git add -A（排除 .astro 缓存）                              │
│  ├─ 生成 Conventional Commit 提交信息                           │
│  ├─ git commit                                                  │
│  ├─ git pull --rebase                                           │
│  └─ git push                                                    │
│                                                                  │
│  何时修改：想改变提交信息格式或 git 操作流程                      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  第三层：GitHub Actions（CI/CD）                                 │
│  文件：.github/workflows/*.yml                                  │
│  ├─ deploy.yml：构建并部署到 GitHub Pages                       │
│  └─ update_google_scholar_stats.yml：定时更新引用数             │
│                                                                  │
│  何时修改：想改变部署方式或定时任务                               │
└─────────────────────────────────────────────────────────────────┘
```

### 配置文件速查表

| 文件 | 作用 | 何时修改 |
|------|------|----------|
| `.claude/settings.json` | 钩子触发器 + 项目权限 | 想改变自动提交何时触发（如排除某些工具） |
| `.claude/settings.local.json` | 本地权限（git、npm 等） | 需要允许新的 Bash 命令或工具 |
| `scripts/autopush.sh` | 提交信息生成 + git 工作流 | 想改变提交信息格式或 git 操作顺序 |
| `.github/workflows/deploy.yml` | 构建与部署管道 | 需要改变构建步骤或部署目标 |
| `.github/workflows/update_google_scholar_stats.yml` | 定时引用数更新 | 需要改变定时计划或学者数据获取方式 |
| `CLAUDE.md` | Claude 的项目上下文 | 想更新项目概述或常用命令 |

### 提交信息自动化

提交信息遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范：
```
<type>(<scope>): <description>
```

类型根据修改的文件自动确定：
- `style(global):` - CSS/样式变更
- `content(honors|education|publications):` - 数据更新
- `feat(navigation|profile|layout):` - 组件功能
- `ci(automation|workflows):` - 脚本/CI 变更
- `docs(readme):` - 文档
- `chore(ext):` - 其他文件

**修改提交信息行为**：编辑 `scripts/autopush.sh` → `generate_commit_msg()` 函数。
