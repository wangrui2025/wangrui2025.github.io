---
name: commit message specificity
description: commit 信息必须描述具体改动，禁止使用通用 "chore: auto-update after file change"
type: feedback
---

## 规则

调用 `autopush.sh` 时，commit message 必须描述具体改了什么文件/功能，**禁止使用**通用的 "chore: auto-update after file change"。

## 为什么

之前的提交 (b71b436, 6495d9f 等) 使用了通用信息，导致提交历史无法反映真实改动，降低了 git log 的可读性。

## 如何应用

每次调用 autopush.sh 前，先分析 `git diff --cached --name-only` 的结果，生成描述具体改动的 commit message：

| 改动 | 正确写法 |
|------|---------|
| 修改 zh/cv.astro | `chore(cv): update zh/cv.astro` |
| 重构 CVLayout | `refactor(cv): extract CVLayout styles` |
| 更新引文数据 | `chore(scholar): update citation stats` |
