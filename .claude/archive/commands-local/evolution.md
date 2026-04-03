---
description: 触发自我进化分析 — 运行 evolution-trigger 和 evolution-distill
---

运行自我进化检查：

```bash
.claude/scripts/evolution-trigger.sh
.claude/scripts/evolution-distill.sh
```

然后读取 `.claude/state/evolution-suggestion.md` 查看结果。

**触发时机**：
- 距离上次进化超过 10 轮对话时
- 用户提到"记住"、"学习"、"下次"等关键词时
- 发现重复模式或可以固化的工作流时
