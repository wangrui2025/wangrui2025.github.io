---
description: 分析当前改动并执行语义化推送
---

1. 执行 `./scripts/autopush.sh --stage` 暂存所有更改并获取统计。
2. 运行 `git diff --cached` 深度分析代码逻辑（重点看改了什么，而不是文件名）。
3. **任务**：基于 diff 生成一个精准的 **Conventional Commits** 标题。
   - 严禁罗列后缀（如 .ts, .json）。
   - 必须描述"改动了什么逻辑"或"解决了什么问题"。
4. 最终调用：`./scripts/autopush.sh "你生成的语义化信息"`。
