# 废弃项目存档 / Archived Projects

## latextab_in_html 计划（已废弃）

### 项目背景
尝试在 HTML 中复刻 LaTeX 学术表格风格，对比 8 种不同的技术实现方案：
1. HTML + Tailwind CSS
2. MathJax + LaTeX (Booktabs)
3. LaTeX.css
4. Tufte CSS
5. Custom Booktabs CSS
6. Quarto
7. Tailwind CSS + Booktabs
8. MDX + Tailwind Typography

### 废弃原因
1. **时间不足** — 项目需要精细调整字体、间距、线宽等细节，耗时超出预期
2. **技术力不足** — 无法完美还原 LaTeX 编译 PDF 的精确排版效果
3. **边际收益递减** — HTML 网页与 LaTeX PDF 本质上是不同的媒介，强行模拟成本过高

### 替代方案
- 直接导出 LaTeX PDF 作为学术展示
- 使用现有的成熟工具（如 Quarto、Typst）生成 HTML

### 相关文件
- `latextab_in_html.html` — 已废弃的对比页面

### 废弃日期
2026-04-08
