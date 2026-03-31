# 🚀 Jekyll → Astro 原子级增量迁移计划

## ⚠️ 开始前的 Git 安全检查

> **在任何时候，当你准备开始新的迁移步骤时，请先执行：**

```bash
# 1. 保存当前工作
git add -A
git commit -m "backup: before [步骤名称] migration"

# 2. 创建迁移分支（推荐）
git checkout -b astro-migration/step-[n]-[name]

# 3. 验证当前状态
git status
```

---

## 📋 原子迁移路线图（10个微步骤）

### Step 0: 预备工作 - 环境隔离
**目标**: 在不影响现有 Jekyll 站点的情况下，创建 Astro 开发环境

#### 迁移逻辑
1. 在当前项目根目录创建 `astro/` 子目录
2. 在子目录内初始化 Astro 项目
3. 保持原 Jekyll 项目完全不动，实现"双轨并行"

#### 避坑指南
- ⚠️ **不要**直接在当前目录运行 `npm create astro`，会污染原项目
- ⚠️ **不要**删除或修改任何 `_layouts/`、`_includes/`、`_data/` 中的文件
- ✅ 使用子目录隔离，确保随时可以回退

#### 验证清单
- [ ] `astro/` 目录已创建
- [ ] `astro/package.json` 存在且可运行 `npm run dev`
- [ ] 原 Jekyll 项目 `bundle exec jekyll serve` 仍能正常运行
- [ ] 访问 `http://localhost:4321` 能看到 Astro 默认欢迎页

#### 预计耗时: 15分钟

---

### Step 1: 骨架搭建 - BaseLayout.astro
**目标**: 创建最基础的布局骨架，验证 HTML 结构输出

#### 迁移逻辑
从 `_layouts/default.html` 中提取核心骨架：
1. `<!DOCTYPE html>` 声明
2. `<head>` 中的 meta 标签、字符集、viewport
3. `<body>` 的基础结构（不含具体内容）
4. 保留关键的 `data-theme` 属性（用于暗色模式）

#### 避坑指南
- ⚠️ **不要**一次性迁移所有 CSS/JS 引用，只保留最关键的
- ⚠️ **不要**在 layout 中直接放业务组件
- ✅ 只保留 HTML 骨架，样式和脚本后续逐步添加
- ✅ 关键属性检查清单：`lang`、`data-theme`、`class` 在 body 上

#### 文件结构
```
astro/src/layouts/
└── BaseLayout.astro    # 仅此一个文件
```

#### 验证清单
- [ ] `npm run dev` 无报错启动
- [ ] 查看页面源代码，包含完整的 `<html>`、`<head>`、`<body>` 结构
- [ ] `<head>` 中包含 charset="UTF-8" 和 viewport meta
- [ ] `<body>` 有 `data-theme` 属性（即使值为空）
- [ ] 浏览器 DevTools Console 无红色报错

#### 预计耗时: 30分钟

---

### Step 2: 全局样式引入 - Tailwind 配置
**目标**: 让 Tailwind CSS 在 Astro 中正常工作

#### 迁移逻辑
1. 复制原项目的 `assets/css/tailwind-custom.css` 到 Astro
2. 安装 Tailwind 依赖：`@astrojs/tailwind`
3. 配置 `tailwind.config.mjs`，确保与原项目一致
4. 在 `BaseLayout.astro` 中引入全局样式

#### 避坑指南
- ⚠️ **不要**遗漏自定义配置（如颜色、字体）
- ⚠️ **不要**忘记安装 Typography 插件（如果原项目使用）
- ✅ 先复制原 `tailwind.config.js` 内容，再适配到 `.mjs` 格式
- ✅ 检查字体配置：Inter、Source Serif 4、Noto Serif SC

#### 验证清单
- [ ] 在任意页面添加 `<div class="bg-red-500 p-4">Test</div>`
- [ ] 浏览器中能看到红色背景和 padding
- [ ] 自定义字体正确加载（检查 Network 面板）
- [ ] 响应式类如 `md:flex` 能正常工作

#### 预计耗时: 45分钟

---

### Step 3: 数据迁移 YAML → TS (Part 1: 单文件试点)
**目标**: 迁移最简单的数据文件，验证数据流

#### 迁移逻辑
选择最简单的 `_data/navigation.yml` 作为试点：
1. 创建 `astro/src/data/` 目录
2. 将 YAML 转换为 TypeScript 模块导出
3. 添加类型定义（可选但推荐）
4. 在页面中 import 使用

#### 避坑指南
- ⚠️ **不要**一次性迁移所有 YAML 文件，先选一个最简单的
- ⚠️ **不要**改变数据结构，保持字段名完全一致
- ✅ 使用 `as const` 或 interface 添加类型安全
- ✅ 保留原始 YAML 文件不动（双轨制）

#### 文件结构
```
astro/src/data/
└── navigation.ts       # 仅此一个数据文件
```

#### 验证清单
- [ ] `console.log(navigation)` 能正确输出数据
- [ ] TypeScript 无类型报错
- [ ] 数据字段名与 YAML 原文件一致
- [ ] 数组结构正确（如 `main`, `quick` 等分组）

#### 预计耗时: 30分钟

---

### Step 4: 第一个静态组件 - Masthead
**目标**: 迁移最简单的静态组件，验证组件渲染

#### 迁移逻辑
迁移 `_includes/masthead.html`：
1. 创建 `astro/src/components/Masthead.astro`
2. 将 Liquid 语法转为 Astro 语法：
   - `{% for item in items %}` → `{items.map(item => ...)}`
   - `{{ item.url }}` → `{item.url}`
3. 使用 Step 3 迁移的 navigation 数据
4. 在 BaseLayout 中引入 Masthead

#### 避坑指南
- ⚠️ **不要**在第一次迁移时就处理 active 状态逻辑
- ⚠️ **不要**改变 HTML 结构，保持 class 名完全一致
- ✅ 先让组件能渲染，交互逻辑后续添加
- ✅ 使用浏览器 Inspector 对比 Jekyll 和 Astro 的 DOM 结构

#### 验证方法（视觉对比）
```
左侧浏览器: http://localhost:4000 (Jekyll)
右侧浏览器: http://localhost:4321 (Astro)
```

#### 验证清单
- [ ] 导航链接数量和顺序与 Jekyll 版本一致
- [ ] 链接文字正确显示（中英文）
- [ ] HTML 结构一致（使用 Inspector 对比）
- [ ] CSS 类名完全一致
- [ ] 响应式行为一致（移动端菜单按钮出现）

#### 预计耗时: 45分钟

---

### Step 5: 数据迁移 (Part 2: 核心内容数据)
**目标**: 迁移 content.yml（双语文本内容）

#### 迁移逻辑
1. 创建 `astro/src/data/content.ts`
2. 保留 `zh` 和 `en` 的嵌套结构
3. 定义类型接口 `ContentData`
4. 导出数据对象

#### 避坑指南
- ⚠️ **不要**扁平化数据结构，保持 `content.zh.title` 这种访问方式
- ⚠️ **注意** YAML 中的多行字符串在 TS 中的表示
- ✅ 使用嵌套对象保持与 Liquid 模板相似的访问路径
- ✅ 为常用字段添加 JSDoc 注释

#### 验证清单
- [ ] 能正确访问 `content.zh.title` 和 `content.en.title`
- [ ] 嵌套对象结构完整（如 `content.zh.sections`）
- [ ] 长文本内容无截断或格式丢失
- [ ] TypeScript 类型推断正确

#### 预计耗时: 40分钟

---

### Step 6: 作者资料卡片 - AuthorProfile
**目标**: 迁移 `_includes/author-profile.html`

#### 迁移逻辑
1. 创建 `astro/src/components/AuthorProfile.astro`
2. 迁移头像、姓名、职位、社交链接等
3. 使用 content.ts 中的数据
4. 处理图片路径（注意 Astro 的 public 目录规则）

#### 避坑指南
- ⚠️ **图片路径**: Jekyll 用 `/images/`，Astro 中放在 `public/images/`
- ⚠️ **不要**在第一次迁移时就做图片优化（如 .astro 的 Image 组件）
- ✅ 使用标准 `<img>` 标签，路径以 `/` 开头
- ✅ 检查头像是否能正常显示

#### 验证清单
- [ ] 头像图片正常显示
- [ ] 作者姓名、职位文字正确
- [ ] 社交图标（GitHub, Scholar等）链接可点击
- [ ] 侧边栏在桌面端位置正确
- [ ] 移动端下作者卡片折叠行为一致

#### 预计耗时: 1小时

---

### Step 7: 核心内容组件 - AboutContent
**目标**: 迁移 `_includes/about-content.html`（论文列表等）

#### 迁移逻辑
1. 创建 `astro/src/components/AboutContent.astro`
2. 先迁移论文列表部分（最复杂）
3. 迁移教育经历、荣誉奖项等区块
4. 使用 papers.ts, education.ts, honors.ts 数据

#### 避坑指南
- ⚠️ **不要**一次性加载所有论文图片，先验证结构
- ⚠️ **注意**论文的中英文切换逻辑（可能有字段如 `title.en` 和 `title.zh`）
- ✅ 先用最简单的列表渲染，图片和交互后续添加
- ✅ 检查论文链接是否正确（PDF、代码、项目页）

#### 验证清单
- [ ] 论文列表按年份分组正确
- [ ] 每篇论文显示：标题、作者、会议、年份
- [ ] 论文链接（PDF、arXiv、代码）可点击
- [ ] 教育经历时间线正确
- [ ] 荣誉奖项列表完整

#### 预计耗时: 1.5小时

---

### Step 8: 首页页面 - index.astro
**目标**: 组装完整首页（英文版）

#### 迁移逻辑
1. 创建 `astro/src/pages/index.astro`
2. 使用 BaseLayout
3. 组合 Masthead、AuthorProfile、AboutContent
4. 添加页脚（Footer）

#### 避坑指南
- ⚠️ **不要**在第一次就处理双语路由，先确保英文版完整
- ⚠️ **检查**页面 title 和 meta description
- ✅ 使用 `Astro.props` 传递数据（如当前语言）
- ✅ 确保 Layout 组件的 `<slot />` 正确渲染内容

#### 验证清单
- [ ] 页面能完整渲染，无白屏
- [ ] 所有组件正常显示
- [ ] 页面 title 正确（浏览器标签页）
- [ ] 滚动页面各区块正常
- [ ] 与 Jekyll 版本进行视觉对比

#### 预计耗时: 1小时

---

### Step 9: 客户端交互 - 主题切换
**目标**: 迁移主题切换功能（第一个需要 client:* 的组件）

#### 迁移逻辑
1. 创建 `astro/src/components/ThemeToggle.astro`
2. 迁移原项目的主题切换 JS 逻辑
3. 添加 `client:load` 指令确保在客户端运行
4. 保存主题偏好到 localStorage

#### 避坑指南
- ⚠️ **必须**使用 `client:load`，否则 localStorage 不可用
- ⚠️ **防止闪烁**: 使用内联脚本在 `<head>` 中设置初始主题
- ⚠️ **检查**原项目使用的 data-theme 值（dark/light 或具体颜色）
- ✅ 首次加载时检查系统偏好（`prefers-color-scheme`）

#### 验证清单
- [ ] 点击主题切换按钮，页面主题变化
- [ ] 刷新页面，主题偏好被保留
- [ ] 切换时无闪烁（FOUC - Flash of Unstyled Content）
- [ ] 在 DevTools Application > Local Storage 中能看到主题值
- [ ] 系统主题变化时（如有监听）响应正确

#### 预计耗时: 45分钟

---

### Step 10: 双语路由 - /zh/ 页面
**目标**: 实现中文首页

#### 迁移逻辑
1. 创建 `astro/src/pages/zh/index.astro`
2. 复用所有组件，传入 `lang="zh"` 参数
3. 创建 LanguageSwitcher 组件
4. 配置 Astro 路由

#### 避坑指南
- ⚠️ **不要**复制粘贴整个页面代码，复用组件
- ⚠️ **注意**语言切换后的页面跳转逻辑
- ✅ 使用 `Astro.params` 或组件 props 传递当前语言
- ✅ 确保从 `/` 切换到 `/zh/` 时用户位置保持（如滚动位置）

#### 验证清单
- [ ] 访问 `/zh/` 能看到中文内容
- [ ] 语言切换器能正常工作
- [ ] 从英文页切换到中文页，URL 正确变化
- [ ] 当前语言在 UI 中高亮显示
- [ ] 直接访问 `/zh/` 无 404 错误

#### 预计耗时: 1小时

---

## 📊 进度追踪表

| Step | 任务 | 预计 | 实际 | 状态 | 验证通过 |
|------|------|------|------|------|----------|
| 0 | 环境隔离 | 15m | | ⬜ | ⬜ |
| 1 | BaseLayout | 30m | | ⬜ | ⬜ |
| 2 | Tailwind | 45m | | ⬜ | ⬜ |
| 3 | 数据迁移(导航) | 30m | | ⬜ | ⬜ |
| 4 | Masthead | 45m | | ⬜ | ⬜ |
| 5 | 数据迁移(内容) | 40m | | ⬜ | ⬜ |
| 6 | AuthorProfile | 1h | | ⬜ | ⬜ |
| 7 | AboutContent | 1.5h | | ⬜ | ⬜ |
| 8 | 首页(index) | 1h | | ⬜ | ⬜ |
| 9 | 主题切换 | 45m | | ⬜ | ⬜ |
| 10 | 双语路由 | 1h | | ⬜ | ⬜ |
| **总计** | | **~8.5h** | | | |

## ✅ 已完成步骤

| Step | 任务 | 状态 | 完成时间 |
|------|------|------|----------|
| 0 | 环境隔离 | ✅ 完成 | 2026-03-31 |
| 1 | BaseLayout | ✅ 完成 | 2026-03-31 |
| 2 | Tailwind/CSS | ✅ 完成 | 2026-03-31 |
| 3 | 数据迁移 | ✅ 完成 | 2026-03-31 |
| 4-5 | Masthead/双页 | ✅ 完成 | 2026-03-31 |

---

## 🔧 通用避坑指南

### 路径问题
- **图片**: `public/images/` → 引用用 `/images/`
- **字体**: 放在 `public/fonts/` 或直接用 Google Fonts CDN
- **数据**: `src/data/` 文件可以被 import，不会打包到客户端

### Liquid → Astro 语法对照

| Liquid | Astro |
|--------|-------|
| `{{ variable }}` | `{variable}` |
| `{% for item in items %}` | `{items.map(item => (...))}` |
| `{% if condition %}` | `{condition && (...)}` 或 `{condition ? (...) : null}` |
| `{% include file.html %}` | `import Component from './Component.astro'` + `<Component />` |
| `site.data.file` | `import data from '../data/file.ts'` |

### 性能优化时机
- ⬜ **不要**在 Step 1-8 考虑性能优化
- ⬜ **不要**过早使用 `client:*` 指令（Step 9 开始才需要）
- ✅ 先让功能正常工作，性能优化是最后一步

---

## ✅ 每个 Step 完成后的标准动作

```bash
# 1. 自检验证（根据该 Step 的 Checklist）
# 2. 保存工作
git add -A
git commit -m "astro(step[N]): [简短描述]"

# 3. 标记进度（更新此文件的进度表）
# 4. 休息 5 分钟，准备下一步
```

---

## 🎯 "第一刀" 建议

**从 Step 0 开始：环境隔离**

理由：
1. **零风险** - 完全不碰现有代码
2. **快速验证** - 15 分钟内能看到 Astro 运行
3. **建立信心** - 看到新框架跑起来后再深入
4. **可随时回退** - 如果 Astro 不适合，直接删除 `astro/` 目录即可

准备好了吗？请告诉我你想从哪个 Step 开始，我将提供该 Step 的详细代码指导。
