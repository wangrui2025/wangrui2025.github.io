---
date: 2026-04-19
status: completed
tags: [design-page, responsive-design, first-person-narrative]
---

# Design Page 设计迭代 Case

## 问题描述
Design 页面 Hero 区域在桌面端只占 3/5 宽度，内容被 max-w 限制导致留白过多。

## 解决路径
1. 发现问题：用户反馈"浏览器只占 3/5 宽度"
2. 定位根因：Hero 内容有 max-w-3xl 限制
3. 修复方案：去掉 max-w 限制，桌面端全宽平铺
4. 同步记录：在 Philosophy section 新增响应式设计 card

## 最终产物
- 桌面端：Hero 全宽平铺
- 移动端：保持 max-w-5xl 居中
- Design 页面：Philosophy section 新增第 4 个 card 解释响应式策略

## 关键教训
- 用户说"3/5"是症状描述，要理解成"宽度受限"
- 响应式设计要先问桌面端还是移动端问题
- Design 页面迭代要及时同步设计决策
