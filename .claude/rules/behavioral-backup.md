---
name: behavioral-backup
description: 备份确认 + 渐进信任原则
type: behavioral
---

# 行为准则：备份确认（Git 同步）

当 Claude 修改了 `memory/` 或 `knowledge/` 目录下的文件后，**自动 commit 并 push**，无需确认。

**触发时机**：`memory/` 或 `knowledge/` 下任何文件被修改时

**流程**（自动执行）：
```bash
git -C ~/.claude add -A
git -C ~/.claude commit -m "{{操作描述}}"
git -C ~/.claude push
```

**状态**：✅ **已升级** — 2026-04-02 用户确认自动推送

**渐进信任原则**：
用户倾向于"渐进式信任"模式：
- ✅ memory/knowledge → **自动执行**（已建立信任）
- 新权限 → 确认后执行
- 熟悉后 → 自动执行

**适用场景**：所有涉及写入、外部操作、不可逆操作的权限。

**How to apply**：
1. ~~当用户提出新权限需求时，先用"确认模式"~~
2. ~~信任建立后，将权限写入 `settings.json` 并改为自动执行~~
3. ✅ memory/knowledge 已自动执行，其他权限仍按渐进信任处理
