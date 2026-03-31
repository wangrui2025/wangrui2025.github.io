# 项目架构分析与 Astro 迁移评估报告

## 1. 核心框架及版本

### 当前技术栈
| 组件 | 当前版本/类型 | 说明 |
|------|-------------|------|
| **静态生成器** | Jekyll (via github-pages gem) | GitHub Pages 原生支持 |
| **包管理器** | Bundler (Ruby) | Gemfile 管理依赖 |
| **前端框架** | **无** | 纯静态 HTML + 少量 jQuery |
| **Node.js** | **未使用** | 无 package.json |

### Jekyll 插件列表
```yaml
plugins:
  - jekyll-paginate      # 分页功能
  - jekyll-sitemap       # 自动生成 sitemap
  - jekyll-gist          # 嵌入 GitHub Gist
  - jekyll-feed          # RSS Feed 生成
  - jekyll-redirect-from # URL 重定向
```

---

## 2. 状态管理与数据获取方案

### 当前数据流：纯静态 + 运行时客户端获取

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   YAML 数据文件  │────→│   Jekyll 构建    │────→│   静态 HTML     │
│   (_data/)      │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                                        │
                        ┌─────────────────┐             │
                        │ jsDelivr CDN    │←────────────┘
                        │ (gs_data.json)  │   Google Scholar
                        └─────────────────┘   运行时 AJAX
```

### 数据源详情

| 数据类型 | 位置 | 结构 | 迁移建议 |
|---------|------|------|---------|
| **导航链接** | `_data/navigation.yml` | 数组 | 转为 JSON 或直接导入 |
| **个人资料** | `_data/profile.yml` | 嵌套对象 | 中英文合并或拆分 |
| **论文列表** | `_data/papers.yml` | 数组 | 保持 YAML 或转 Markdown |
| **荣誉奖项** | `_data/honors.yml` | 数组 | 同上 |
| **教育经历** | `_data/education.yml` | 数组 | 同上 |
| **页面文案** | `_data/content.yml` | 深层嵌套 | 使用 Astro i18n 替代 |

### Google Scholar 集成（唯一动态数据）

```javascript
// 当前实现：客户端 jQuery AJAX
var gsDataBaseUrl = 'https://cdn.jsdelivr.net/gh/{{ site.repository }}@'
$.getJSON(gsDataBaseUrl + "google-scholar-stats/gs_data.json", ...)
```

**Astro 迁移方案：**
- **推荐：** 使用 `client:load` island 组件保持客户端获取
- **可选：** 构建时通过 `fetch()` 预取（数据会略微陈旧）

---

## 3. 样式处理方式

### 当前：双重样式系统

```
┌─────────────────────────────────────────────────────────┐
│                    样式架构                              │
├─────────────────────────────────────────────────────────┤
│  Tailwind CSS v4.2.2 (Primary)                          │
│  └── assets/css/tailwind-custom.css                     │
│      └── @property CSS 变量 + 工具类                     │
├─────────────────────────────────────────────────────────┤
│  Sass/SCSS (Secondary)                                  │
│  ├── assets/css/main.scss (入口)                        │
│  └── _sass/                                             │
│      ├── _animations.scss    # 动画                     │
│      ├── _masthead.scss      # 导航栏                   │
│      ├── _sidebar.scss       # 侧边栏                   │
│      ├── _page.scss          # 页面布局                 │
│      ├── _syntax.scss        # 代码高亮                 │
│      └── vendor/             # 第三方库                 │
│          ├── font-awesome/   # 图标                     │
│          └── magnific-popup/ # 灯箱                     │
└─────────────────────────────────────────────────────────┘
```

### 关键样式特征

| 特征 | 当前实现 | Astro 迁移方案 |
|------|---------|---------------|
| **深色模式** | `data-theme` + CSS 变量 | Tailwind `darkMode: 'class'` |
| **中文字体栈** | `'Inter', 'PingFang SC', 'Microsoft YaHei'` | 保持 |
| **网格系统** | Susy (Sass 库) | 替换为 Tailwind Grid |
| **响应式断点** | 自定义 breakpoint 库 | Tailwind 默认断点 |

---

## 4. 内容管理模式

### 当前：YAML 驱动 + Markdown 模板

```
_pages/
├── about.md      # 英文首页 (lang: en)
└── about-cn.md   # 中文首页 (lang: zh)
    ↓
_layouts/
└── default.html  # 主模板
    ↓
_includes/
└── about-content.html  # 实际内容渲染
    ↓
_data/*.yml       # 所有实际内容数据
```

### 内容模板结构

```liquid
<!-- _includes/about-content.html -->
<section id="about">
  {{ content.about.description[lang] }}
</section>

<section id="news">
  <h2>{{ content.section_titles.news[lang] }}</h2>
  {% for item in content.news %}
    <p>{{ item.date[lang] }}: {{ item.text[lang] }}</p>
  {% endfor %}
</section>

<section id="publications">
  <h2>{{ content.section_titles.publications[lang] }}</h2>
  {% for paper in site.data.papers %}
    {% include paper-card.html paper=paper %}
  {% endfor %}
</section>
```

### 迁移方案对比

| 方案 | 优点 | 缺点 | 推荐度 |
|-----|------|-----|-------|
| **A. YAML → JSON** | 保持现有数据结构 | 失去 YAML 可读性 | ⭐⭐ |
| **B. YAML → Markdown** | 更好版本控制 | 需重写内容 | ⭐⭐⭐ |
| **C. Content Collections** | Astro 原生，类型安全 | 需调整目录结构 | ⭐⭐⭐⭐⭐ |

**推荐方案 C：**
```
src/content/
├── config.ts           # 类型定义
├── profile/
│   └── index.json      # 个人资料
├── papers/
│   ├── paper-1.md      # 每篇论文一个文件
│   └── paper-2.md
├── news/
│   └── index.json      # 新闻列表
└── i18n/
    ├── en.json         # 界面文案
    └── zh.json
```

---

## 5. 路由与部署逻辑

### 当前路由结构

| URL | 来源文件 | 语言 |
|-----|---------|-----|
| `/` | `_pages/about.md` | en |
| `/zh/` | `_pages/about-cn.md` | zh |
| `/404.html` | `404.html` | - |

### URL 重定向配置
```yaml
# _config.yml
plugins:
  - jekyll-redirect-from

# 在页面中使用
redirect_from:
  - /old-url/
```

### 部署流程

```
Git push → GitHub Pages
                ↓
         GitHub Actions (可选)
         └── 构建 Tailwind CSS
                ↓
         自动部署到 username.github.io
```

### Astro 路由映射

| 当前 URL | Astro 文件路径 | 备注 |
|---------|---------------|-----|
| `/` | `src/pages/index.astro` | 英文首页 |
| `/zh/` | `src/pages/zh/index.astro` | 中文首页 |
| `/404` | `src/pages/404.astro` | 404 页面 |

### Astro i18n 配置建议

```javascript
// astro.config.mjs
export default defineConfig({
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh'],
    routing: {
      prefixDefaultLocale: false,  // / 为英文
    }
  }
});
```

---

## 6. 静态 vs 交互组件分析

### 静态组件（直接转为 .astro）

| 组件 | 当前实现 | 复杂度 | 优先级 |
|-----|---------|-------|-------|
| **导航栏** | HTML + SCSS | 低 | P1 |
| **侧边栏个人资料** | HTML + SCSS | 低 | P1 |
| **论文卡片** | HTML + SCSS | 中 | P1 |
| **荣誉列表** | HTML + SCSS | 低 | P2 |
| **教育经历** | HTML + SCSS | 低 | P2 |
| **页脚** | HTML + SCSS | 低 | P2 |

### 交互组件（需要 client: 指令）

| 组件 | 当前实现 | Astro 方案 | 优先级 |
|-----|---------|-----------|-------|
| **深色模式切换** | jQuery + localStorage | `client:load` island | P1 |
| **Google Scholar 统计** | jQuery AJAX | `client:load` island + fetch | P1 |
| **移动端菜单** | jQuery toggle | `client:load` island | P2 |
| **图片灯箱** | Magnific Popup | 替换为 PhotoSwipe 或原生 | P3 |
| **平滑滚动** | jQuery | CSS `scroll-behavior` | P3 |
| **Sticky 侧边栏** | Stickyfill.js | CSS `position: sticky` | P3 |
| **MathJax 渲染** | Lazy-loaded CDN | `client:visible` | P2 |

### 代码示例：深色模式 Island

```astro
---
// src/components/ThemeToggle.astro
---
<button id="theme-toggle" aria-label="Toggle Dark Mode">
  <span class="sun">☀️</span>
  <span class="moon">🌙</span>
</button>

<script>
  const toggle = document.getElementById('theme-toggle');
  const root = document.documentElement;

  // 检查系统偏好和本地存储
  const getTheme = () => {
    if (localStorage.theme) return localStorage.theme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  // 初始化
  root.setAttribute('data-theme', getTheme());

  toggle?.addEventListener('click', () => {
    const current = root.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.theme = next;
  });
</script>
```

---

## 7. 迁移复杂度评估

### Top 3 挑战

#### 🔴 挑战 1: 双语内容管理重构

**当前痛点：**
- 所有文案深嵌在 `_data/content.yml` 的嵌套结构中
- 语言切换通过 `page.lang` 变量硬编码在模板中

**解决方案：**
```typescript
// src/i18n/utils.ts
import en from './en.json';
import zh from './zh.json';

const translations = { en, zh };

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split('/');
  if (lang === 'zh') return 'zh';
  return 'en';
}

export function useTranslations(lang: keyof typeof translations) {
  return function t(key: string) {
    return key.split('.').reduce((obj, k) => obj?.[k], translations[lang]);
  };
}
```

**工作量：** 中等（2-3 小时）

---

#### 🟡 挑战 2: Sass → Tailwind 样式迁移

**当前痛点：**
- 混合使用 Tailwind 工具类和 Sass 组件样式
- 第三方库（Font Awesome、Magnific Popup）依赖 Sass

**解决方案：**
```css
/* src/styles/global.css - Tailwind v4 */
@import "tailwindcss";

/* 保留必要的自定义 CSS 变量 */
@theme {
  --color-primary: #2c5282;
  --color-primary-dark: #1a365d;
  --font-sans: 'Inter', 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

/* 渐进式迁移：保留复杂组件样式为 CSS 模块 */
@import "../components/PaperCard.module.css";
```

**工作量：** 高（4-6 小时）

---

#### 🟢 挑战 3: Google Scholar 集成保留

**当前痛点：**
- 依赖 jQuery 运行时获取
- 构建时无数据

**解决方案：**
```astro
---
// src/components/ScholarStats.astro
// 组件在客户端获取数据
---
<div id="scholar-stats" data-repo="username/repo">
  <span class="citations">Loading...</span>
</div>

<script>
  const container = document.getElementById('scholar-stats');
  const repo = container?.dataset.repo;

  fetch(`https://cdn.jsdelivr.net/gh/${repo}@google-scholar-stats/gs_data.json`)
    .then(r => r.json())
    .then(data => {
      container.querySelector('.citations').textContent = data.citations.all_time;
    });
</script>
```

**工作量：** 低（30 分钟）

---

## 8. 迁移路线图

### 阶段 1: 项目初始化（1 天）
- [ ] 创建 Astro 项目 `npm create astro@latest`
- [ ] 配置 Tailwind CSS 集成
- [ ] 设置 i18n 路由
- [ ] 复制静态资源（图片、CV PDF）

### 阶段 2: 核心组件迁移（2-3 天）
- [ ] 创建 Layout 组件
- [ ] 迁移导航栏（静态）
- [ ] 迁移侧边栏个人资料（静态）
- [ ] 迁移论文列表（Content Collection）
- [ ] 迁移深色模式切换（Island）

### 阶段 3: 内容迁移（1 天）
- [ ] 转换 YAML 数据为 Content Collections
- [ ] 设置 i18n 文案系统
- [ ] 验证中英文页面渲染

### 阶段 4: 优化与部署（1 天）
- [ ] 移除未使用的 JavaScript
- [ ] 优化字体加载策略
- [ ] 配置 GitHub Actions 部署
- [ ] 测试构建输出

### 预计总工时：**5-7 天**

---

## 9. 技术决策清单

| 决策项 | 推荐方案 | 备选方案 |
|-------|---------|---------|
| **内容格式** | Content Collections (Markdown) | 保持 YAML |
| **样式方案** | Tailwind CSS 100% | Tailwind + CSS Modules |
| **图标方案** | Lucide React / Heroicons | 保留 Font Awesome |
| **数学公式** | KaTeX (服务端渲染) | MathJax (客户端) |
| **图片优化** | Astro `<Image />` | 原样复制 |
| **部署** | GitHub Actions → Pages | Vercel / Netlify |

---

## 附录：文件映射表

| Jekyll 文件 | Astro 目标 | 备注 |
|------------|-----------|-----|
| `_config.yml` | `astro.config.mjs` + `.env` | 配置拆分 |
| `_layouts/default.html` | `src/layouts/Layout.astro` | 主模板 |
| `_includes/head.html` | `src/components/Head.astro` | SEO + 元数据 |
| `_includes/masthead.html` | `src/components/Header.astro` | 导航 |
| `_includes/sidebar.html` | `src/components/Sidebar.astro` | 侧边栏 |
| `_includes/author-profile.html` | `src/components/Profile.astro` | 个人资料 |
| `_includes/about-content.html` | `src/pages/index.astro` | 页面内容 |
| `_includes/scripts.html` | `src/layouts/Layout.astro` 底部 | 脚本注入 |
| `assets/css/main.scss` | `src/styles/global.css` | 全局样式 |
| `assets/js/_main.js` | 拆分到各组件 | 交互逻辑 |
| `_data/*.yml` | `src/content/` | 内容集合 |
| `_pages/*.md` | `src/pages/*.astro` | 页面路由 |
