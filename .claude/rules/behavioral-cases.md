---
name: behavioral-cases
description: 记录案例 - 沉淀多方协作解决的问题
type: behavioral
---

# 行为准则：记录案例

对于经过多方（用户、Claude、第三方如网页端）共同协作解决的问题，需要提炼并记录。

**触发时机**：当一个问题经过了多次尝试、失败、调整后最终解决时。

**事件驱动自动触发**（无需用户明确要求）：
- 当 `chezmoi doctor`、`测试`、`验证` 等命令成功通过时
- 当用户确认"修好了"、"可以了"、"问题已解决"时
- 当 Debug/Troubleshooting 任务状态变为完成时

**自动执行流程**：
```
ON EVENT "User_Confirms_Issue_Resolved" OR "Tests_Pass_Successfully":
  IF Task_Type == "Debug" OR "Troubleshooting":
    1. 挂起后续常规对话
    2. 生成《故障排查与根因分析报告》
    3. 写入 ~/.claude/knowledge/cases/ 目录
    4. 向用户展示归档摘要
```

**记录格式**（存放在 `~/.claude/knowledge/cases/`）：
```markdown
---
name: {{案例简称}}
description: {{一句话描述问题}}
date: {{YYYY-MM-DD}}
tags: [{{标签1}}, {{标签2}}]
status: {{open|resolved}}
---

## 问题描述
{{清晰描述遇到了什么问题}}

## 失败尝试
- {{尝试1}} → {{失败原因}}
- {{尝试2}} → {{失败原因}}

## 最终解决方案
{{如何解决的}}

## 关键教训
{{提炼的核心经验}}
```

**How to apply**：
- 问题解决并验证通过后，**自动**生成案例报告并存入知识库
- 无需等待用户明确要求"记录这个案例"
- 完成后向用户展示归档内容摘要
