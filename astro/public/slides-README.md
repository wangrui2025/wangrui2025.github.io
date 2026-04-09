# OSA 幻灯片项目说明

> 交给新协作者时，**先让 Claude Code 读取本文件**，它就会了解全部上下文和工作要求。

---

## 1. 项目概述

- **论文**: OSA: Echocardiography Video Segmentation via Orthogonalized State Update and Anatomical Prior-aware Feature Enhancement
- **幻灯片文件**: `astro/public/slides.html`
- **在线地址**: `wangrui2025.github.io/slides.html`
- **仓库**: `wangrui2025.github.io`
- **本地路径**: `/Users/myk/Repo/wangrui2025.github.io`

幻灯片为单文件 HTML，使用 Tailwind CSS + KaTeX，共 10 页，16:9 比例（1280×720px）。

---

## 2. 当前状态

**已完成**: 整体框架、排版样式、公式内容（p5/p6）、Method 页面布局。

**进行中**: 排版微调中。p5（OSU 页）下方的占位方块可能在某些缩放比例下轻微溢出，当前已在压缩间距（pt-4, gap-3 等）。

**未完成**: 所有占位图/图表需要替换为真实图片。

---

## 3. 页面结构一览

| 页码 | 内容 | 状态 |
|------|------|------|
| p1 | 首页（标题、作者、单位） | ✅ 完成 |
| p2 | 目录 | ✅ 完成 |
| p3 | Problem Setting（两栏：文字+图） | ⚠️ 占位图未填 |
| p4 | Method Overview（总览流程图） | ⚠️ 占位图未填 |
| p5 | Method - Orthogonalized State Update | ✅ 公式完成，占位图未填 |
| p6 | Method - Anatomical Prior-aware Feature Enhancement | ✅ 公式完成，占位图未填 |
| p7 | Experiments Part 1 | ⚠️ 占位图未填 |
| p8 | Experiments Part 2 | ⚠️ 占位图未填 |
| p9 | Discussion | ✅ 完成 |
| p10 | Thanks | ✅ 完成 |

---

## 4. 待填充的占位框清单

### p3 (Problem Setting)
- **右栏上方**: 超声心动图相关图像
- **右栏下方**: 6 张小图组合

### p4 (Method Overview)
- **中间大框**: OSA 方法总览流程图

### p5 (OSU)
- **左侧底部 16:9 方块**: OSU 流程示意图
- **右上角表格框 (2:1)**: 公式对比表
- **右下角正方形框**: 数据可视化图表

### p6 (APFE)
- **右侧大框**: APFE 示意图

### p7 / p8 (Experiments)
- **整个页面框**: 实验结果表格/图表

---

## 5. 添加/替换图片的方法

### 步骤 1: 把图片放入 `astro/public/` 目录

推荐结构：
```
astro/public/
├── slides.html
├── slides-README.md
└── slides-images/
    ├── overview-flowchart.png      # p4
    ├── osu-flowchart.png            # p5
    ├── osu-table.png                # p5
    ├── osu-chart.png                # p5
    ├── apfe-diagram.png            # p6
    ├── exp-part1.png               # p7
    └── exp-part2.png               # p8
```

### 步骤 2: 在 slides.html 中替换占位框

找到对应的占位框代码，例如 p4 的：
```html
<div class="... border-dashed ...">
    <span class="text-gray-400 ...">Overview Flowchart Placeholder</span>
</div>
```

替换为：
```html
<img src="/slides-images/overview-flowchart.png" class="w-full h-full object-contain rounded-2xl" alt="Overview Flowchart">
```

### 步骤 3: 推送（见下方 Git 工作流）

---

## 6. Git 工作流规范

### 每次修改后执行：
```bash
cd /Users/myk/Repo/wangrui2025.github.io
git add -A
git commit -m "<type>(slides): 简短描述"
git push
```

### 推送失败时（git pull 报 ref 冲突）：
```bash
git fetch origin
git reset --hard origin/main
# 重新应用你的修改后再 push
```

### Commit 类型规范：
| type | 用途 |
|------|------|
| `feat` | 新增功能/内容 |
| `fix` | 修复问题 |
| `refactor` | 重构（不改功能） |
| `style` | 样式调整 |

**禁止**: `update`、`sync`、`fix bug` 等模糊信息。

---

## 7. 排版规范（经验总结）

### 字体
- 英文正文/标题: Times New Roman（通过 `font-['Times_New_Roman',Times,serif]`）
- 中文: 系统默认衬线字体
- 公式: KaTeX 渲染

### 颜色
- 主色: `#861F41`（深酒红）
- 背景: `#f8fafc`（公式框背景）
- 灰色辅助: `#64748b`、`#94a3b8`

### 布局
- 页面固定 1280×720px，overflow-hidden 防止溢出
- 副标题（OSU / APFE）与 Method 标题**在同一行**，用 `flex items-baseline gap-3` 实现
- 内容区使用 `flex-1` 占据剩余空间，底部留 `pb-4` padding

### 防止溢出的经验
- `overflow-hidden` 加在最外层容器
- KaTeX 公式用 `.katex-display { margin: 0.1em 0 !important; }` 压缩垂直间距
- 公式间距用 `gap-[3px]` 而非更大值
- 右下角方块高度控制在 `h-[220px]`
- 顶部 padding 用 `pt-4` 而非 `pt-6`
- 副标题字号 26px（可随文字长短上下浮动）

### 副标题与 Method 同行（当前正确写法）
```html
<div class="flex items-baseline gap-3 mb-1">
    <h1 class="text-[44px] font-bold text-[#861F41]">Method</h1>
    <span class="text-[#861F41] text-[26px] font-bold flex items-center gap-2">
        <span>-</span>
        <span>Orthogonalized State Update</span>
    </span>
</div>
<div class="w-full h-[2.5px] bg-[#861F41]"></div>
```

---

## 8. 给 Claude Code 新手的说明

### 如果你是第一次用 Claude Code：

1. 在终端进入项目目录：`cd /Users/myk/Repo/wangrui2025.github.io`
2. 启动 Claude Code：`claude`
3. **第一步，告诉它读本文件**：
   ```
   请先阅读 astro/public/slides-README.md 文件，了解这个项目的全部上下文。
   ```
4. 然后用自然语言描述你想做的事，例如：
   - "把 p4 的占位框替换成一张流程图图片"
   - "调整 p5 的副标题字号，让它不溢出"
   - "在 p7 添加实验数据表格"

### 如果你不用 Claude Code，直接改文件：

1. 用任意编辑器打开 `astro/public/slides.html`
2. 找到要替换的 `<div class="... border-dashed ...">` 块
3. 用 `<img src="图片路径" class="...">` 替换
4. 保存后按上方 Git 工作流推送

### GitHub Pages 重建
推送后约 1-2 分钟自动重建，无需手动操作。

---

## 9. 相关文件位置

```
astro/public/
├── slides.html       # 幻灯片主文件（唯一需要修改的文件）
└── slides-README.md  # 本文件

astro/dist/           # GitHub Pages 部署输出（自动生成，不要手动修改）
```

---

## 10. 遇到问题？

- **Claude Code 回答不清楚** → 把本 README 复制到一个新对话，让它重新读一遍
- **页面没变化** → 确认已 `git push`，等待 2 分钟后刷新
- **推送冲突** → 见上方「推送失败时」操作
