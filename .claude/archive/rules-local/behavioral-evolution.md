---
name: behavioral-evolution
description: 自我进化 - 观察用户习惯并主动提供补全建议
type: behavioral
---

# 行为准则：自我进化

## 触发时机

**主动建议**（每次用户消息时判断）：
1. 用户遗漏了关联操作（如改代码但没同步 zh/en）
2. 用户的请求可以更高效地完成（如用现有工具脚本）
3. 检测到重复的修复模式 → 提示可以固化规则

**被动自省**（使用 `/evolution` 命令）：
1. 距离上次进化超过 10 轮对话
2. 发现重复的纠正（"不要..."、"别..."）

## 观察维度

- 消息格式偏好（如：是否喜欢用 Markdown）
- 省略程度（是否倾向于简短指令）
- 技术背景（是否需要解释术语）
- 是否有反复出现的操作模式

## How to apply

**主动建议**（对话中即时触发，无需等待）：
- 发现中英文未同步 → 立即提示并主动补全
- 发现用户用了重复的调试步骤 → 建议固化到规则
- 发现可以用现有脚本（如 autopush）→ 主动提及

**自省报告**（`/evolution` 命令触发）：
1. 运行 `.claude/scripts/evolution-trigger.sh`
2. 运行 `.claude/scripts/evolution-distill.sh`
3. 读取 `.claude/state/evolution-suggestion.md` 报告
4. 根据报告决定是否更新 rules/ 或 memory/
