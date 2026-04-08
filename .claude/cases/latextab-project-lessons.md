---
name: latextab-project-lessons
description: latextab_in_html 废弃项目的教训与经验
type: project
date: 2026-04-08
status: archived
---

## 项目概述

尝试在 HTML 中复刻 LaTeX 学术表格风格，对比 8 种不同的技术实现方案，最终废弃归档。

**归档位置**: `arch/latextab_in_html.html`  
**详细记录**: `arch/README.md`

---

## 核心教训

### 1. 媒介特性不可逆

HTML 与 LaTeX 是根本不同的媒介：

| 维度 | LaTeX | HTML/CSS |
|------|-------|----------|
| 渲染引擎 | TeX 排版引擎（专用算法） | 浏览器引擎（通用布局） |
| 字体处理 | 嵌入字形轮廓，精确控制 | 依赖系统字体 + Web Fonts |
| 精度 | 物理尺寸（pt/mm） | 逻辑像素，DPI 差异 |

**结论**: 强行模拟 TeX 排版算法是逆媒介特性，事倍功半。

### 2. 边际收益递减

- **初期**: 快速搭建 8 种方案，成就感高
- **中期**: 微调字体和线宽，耗时但可见改进  
- **后期**: 投入数小时只能改进 1% 的效果

**关键认知**: "足够好"与"完美"之间的差距，观众几乎无法察觉。

### 3. 工程化成本

即使做出 80% 效果，维护成本也很高：
- 浏览器更新破坏样式
- 不同设备渲染差异
- 内容变化需重新调整

---

## 决策框架

```
技术选型 = 场景适配度 > 理论完美度
```

**错误的思维模式**:
- 单一源文件，多格式输出
- 网页应该看起来像 PDF
- 追求像素级一致

**正确的思维模式**:
- **PDF 场景**: 直接用 LaTeX 编译
- **网页场景**: 使用适合 Web 的表格设计
- **打印场景**: 专门的 @media print 样式

---

## 重启工作流

如需重新查看代码：
1. 复制 `arch/latextab_in_html.html` 到 [Gemini Canvas](https://gemini.google.com/canvas) 实时渲染
2. 或使用 GitHub Codespaces 在线编辑

**注意**: 仅供参考学习，不建议生产使用。

---

## 相关链接

- [详细归档记录](../../arch/README.md)
- [代码存档](../../arch/latextab_in_html.html)
