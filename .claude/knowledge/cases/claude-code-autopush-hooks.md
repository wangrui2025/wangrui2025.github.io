---
name: claude-code-autopush-hooks
description: 为 Claude Code 配置自动推送 hooks
date: 2026-04-02
tags: [claude-code, hooks, git, automation, autopush]
status: resolved
---

## 问题描述

需要在 Claude Code 中实现两个自动推送场景：
1. 每次 npm run build 成功后自动 push
2. 每次文件修改后自动 push（无需手动调用 autopush）

## 失败尝试

- 直接用硬编码路径 → 用户拒绝，要求用 $CLAUDE_PROJECT_DIR 相对地址
- PostToolUse Write|Edit 全局触发 → 会误触发其他项目，改用路径过滤
- Bash build 命令匹配 → 需要从 tool_input.command 和 tool_response.exitCode 提取信息

## 最终解决方案

在 ~/.claude/settings.json 的 hooks.PostToolUse 中添加两个 hook：
- Bash hook: 检测 npm run build 成功后自动 push
- Write|Edit hook: 检测项目文件修改后自动 push（异步）

关键点：
- 用 $CLAUDE_PROJECT_DIR 代替硬编码路径
- Hook 输入是 JSON stdin，通过 jq 提取 command 和 exitCode
- 使用 async: true 避免阻塞主流程
- 权限直接写死，无需每次确认

## 关键教训

1. 路径用环境变量：$CLAUDE_PROJECT_DIR 是 Claude Code 内置变量
2. Hook 输入是 JSON stdin：PostToolUse 的 hook 从 stdin 接收包含 tool_input、tool_response 的 JSON
3. 异步执行：自动推送用 async: true 避免阻塞 AI 响应
4. 容错设计：所有 hook 命令末尾加 || true 防止失败影响主流程
5. 渐进信任：用户确认方案可行后，将权限写入 settings.json 改为自动执行
