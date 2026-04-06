---
name: scholar-citation-migration
description: 从 Google Scholar 爬虫迁移到 Semantic Scholar API
date: 2026-04-06
tags: [github-actions, citation, semantic-scholar, openalex, api]
status: open
---

## 问题描述

GitHub Actions workflow `Update Google Scholar Stats` 失败，错误信息：
```
Error: 未找到环境变量 GOOGLE_SCHOLAR_ID
```

原因是 `GOOGLE_SCHOLAR_ID` secret 未设置。

## 失败尝试

1. **设置 GOOGLE_SCHOLAR_ID secret** → 用户不想用 Google Scholar 爬虫方案
2. **迁移到 OpenAlex API** → OpenAlex 作者消歧有问题，把用户的 2 篇论文错误关联到其他 "Rui Wang"（显示 27 篇论文、214 引用）
3. **迁移到 Semantic Scholar API (按 arxiv ID)** → 成功，但有 429 限速问题

## 最终解决方案

1. 使用 **Semantic Scholar API** 按 **arxiv ID** 查询论文引用数
2. 脚本 `scripts/fetch_scholar.py` 固定查询用户的 2 篇论文：
   - GDKVM: arxiv 2512.10252 (ICCV 2025)
   - OSA: arxiv 2603.26188 (CVPR 2026)
3. 引用数暂时写死为 **3**（等 API key 获取后再启用自动更新）
4. Workflow `update_google_scholar_stats.yml` 的 schedule 被注释禁用

## 待办事项 (TODO)

- [ ] 获取 Semantic Scholar API Key
  - 申请地址: https://www.semanticscholar.org/product/api
  - 用途: 提高 API 限额，解决 429 限速问题
- [ ] 重新启用 workflow schedule（获取 API key 后）
- [ ] 更新脚本使用 API key

## 关键教训

1. **OpenAlex 作者消歧不可靠** — 同名作者会被错误合并，需要手动验证
2. **按论文 ID 查询比按作者查询更准确** — 避免了作者消歧问题
3. **学术数据库同步有延迟** — Google Scholar 显示 3 引用时，Semantic Scholar 可能还显示 1
4. **Semantic Scholar 有严格的匿名请求限额** — 免费用户建议申请 API key

## 相关文件

- `scripts/fetch_scholar.py` — Semantic Scholar API 抓取脚本
- `.github/workflows/update_google_scholar_stats.yml` — GitHub Actions workflow
- `astro/src/content/scholar/stats.json` — 引用数据存储
