---
name: bilingual-alignment
description: 中英文内容同步修改规则
date: 2026-04-02
tags: [i18n, bilingual, alignment]
---

## 规则

修改中文内容时，必须同步修改英文内容（反之亦然）。

## 触发时机

每次修改以下文件时，必须同时检查并修改对应的另一语言版本：
- `astro/src/content/homepage/zh.json` ↔ `astro/src/content/homepage/en.json`
- `astro/src/content/papers/*.json` 中的 `zh.title` ↔ `en.title`

## 如何应用

1. 修改其中一个语言文件后，**立即**检查另一语言文件
2. 如果另一语言也有对应内容需要修改，**同步修改**
3. 提交信息体现双语更新，如 `refactor(homepage): align zh/en timeline titles`

## 示例

- 修改 zh.json 的 GDKVM 标题 → 同时检查 en.json 的 GDKVM 标题
- 修改论文 osa.json 的 zh.title → 同时更新 en.title
