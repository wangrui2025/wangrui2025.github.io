#!/bin/bash
# 自我蒸馏执行脚本 — 主动进化

EVOLUTION_FILE="$HOME/.claude/state/pending-evolution.md"
RULES_DIR="$HOME/.claude/rules"
MEMORY_DIR="$HOME/.claude/memory"
LOG_FILE="$HOME/.claude/logs/evolution.log"

# 如果没有待处理的进化，直接退出
[ ! -f "$EVOLUTION_FILE" ] && exit 0

echo "$(date '+%Y-%m-%d %H:%M:%S') [DISTILL START]" >> "$LOG_FILE"

# 分析最近的对话历史，提取模式
RECENT_HISTORY=$(tail -200 "$HOME/.claude/history.jsonl" 2>/dev/null | jq -r '
  select(.type == "user" or .type == "assistant") |
  {type: .type, content: .content[0:200]}
' | tail -50)

# 简单启发式：检测高频主题
TOPICS=$(echo "$RECENT_HISTORY" | grep -oE '\b\w{5,}\b' | tr '[:upper:]' '[:lower:]' | \
  grep -vE '^(hello|thanks|please|could|would|should|there|about|this|that|with|from|have|what|when|where|will|want|like|just|know|think|sure|here|okay|yes|now|can|you|the|and|for|are|but|not|use|get|see|add|one|two|new|may|ask|via|let|set|put|end|way|man|try|run|out|how|all|any|need|each|which|their|time|who|its|more|very|after|words|long|than|first|water|been|call|oil|sit|come|made|find|sound|day|did|get|has|him|his|how|she|use|her|way|many|oil|sit|set|run|eat|far|sea|eye|ago|off|too|old|tell|very|when|much|would|there|all|one|every|great|think|where|help|through|much|before|move|right|too|mean|old|same|tell|boy|follow|came|want|show|also|around|farm|three|small|set|put|end|why|again|turn|here|off|play|say|where|over|think|say|great|where|help)$' | \
  sort | uniq -c | sort -rn | head -10)

# 检测重复纠正模式
CORRECTION_PATTERNS=$(echo "$RECENT_HISTORY" | grep -iE '(不要|别|不是这样|错了|不对|应该|需要)' | wc -l)

# 生成进化建议
cat > "$HOME/.claude/state/evolution-suggestion.md" << EOF
# 自我进化建议报告

生成时间: $(date '+%Y-%m-%d %H:%M:%S')

## 最近对话主题分析
\`\`\`
$TOPICS
\`\`\`

## 检测到的信号
- 纠正模式出现次数: $CORRECTION_PATTERNS
$([ "$CORRECTION_PATTERNS" -ge 2 ] && echo "- ⚠️ 检测到多次纠正，建议回顾" || echo "- ✅ 纠正次数在正常范围")

## 建议的进化方向

1. **规则强化** — 如果发现重复问题，添加到 behavioral-*.md
2. **记忆补充** — 如果有新的用户偏好，写入 memory/
3. **工作流优化** — 如果流程有瓶颈，更新 self-evolution-engine.md

## 自动检查清单

- [ ] 是否有重复的解释？→ 添加到 memory
- [ ] 是否有重复的确认？→ 添加到 permissions 或 hooks
- [ ] 是否有用户的新偏好？→ 添加到 feedback
- [ ] 是否有新的项目上下文？→ 添加到 project

---

**下一步**: 查看此报告后，决定是否需要更新规则文件。
EOF

# 标记进化已处理
rm -f "$EVOLUTION_FILE"
echo "$(date '+%Y-%m-%d %H:%M:%S') [DISTILL COMPLETE]" >> "$LOG_FILE"

exit 0
