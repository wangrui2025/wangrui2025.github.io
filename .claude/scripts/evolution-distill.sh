#!/bin/bash
# 自我蒸馏执行脚本 — 主动进化
# 使用 $CLAUDE_PROJECT_DIR 定位项目本地 .claude/

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(cd "$(dirname "$0")/.." && pwd)}"
CLAUDE_DIR="$PROJECT_DIR/.claude"

EVOLUTION_FILE="$CLAUDE_DIR/state/pending-evolution.md"
SUGGESTION_FILE="$CLAUDE_DIR/state/evolution-suggestion.md"
LOG_FILE="$CLAUDE_DIR/logs/evolution.log"
HISTORY_FILE="$CLAUDE_DIR/history.jsonl"

mkdir -p "$(dirname "$LOG_FILE")"

# 如果没有待处理的进化，直接退出
[ ! -f "$EVOLUTION_FILE" ] && exit 0

echo "$(date '+%Y-%m-%d %H:%M:%S') [DISTILL START]" >> "$LOG_FILE"

# 分析最近的对话历史，提取模式
if [ -f "$HISTORY_FILE" ]; then
    RECENT_HISTORY=$(tail -200 "$HISTORY_FILE" 2>/dev/null | jq -r '
      select(.type == "user" or .type == "assistant") |
      {type: .type, content: .content[0:200]}
    ' | tail -50 || echo "")
else
    RECENT_HISTORY=""
fi

# 检测重复纠正模式
CORRECTION_PATTERNS=$(echo "$RECENT_HISTORY" | grep -iE '(不要|别|不是这样|错了|不对|应该|需要)' | wc -l)

# 读取 pending-evolution 信息
if [ -f "$EVOLUTION_FILE" ]; then
    DETECTED_AT=$(grep "detected_at:" "$EVOLUTION_FILE" | cut -d: -f2- | xargs)
    REASON=$(grep "^reason:" "$EVOLUTION_FILE" | cut -d: -f2- | xargs)
fi

# 生成进化建议
cat > "$SUGGESTION_FILE" << EOF
# 自我进化建议报告

生成时间: $(date '+%Y-%m-%d %H:%M:%S')
检测时间: ${DETECTED_AT:-unknown}
触发原因: ${REASON:-unknown}

## 最近对话主题分析
（注：需人工读取 history.jsonl 获取上下文）

## 检测到的信号
- 纠正模式出现次数: $CORRECTION_PATTERNS
$([ "$CORRECTION_PATTERNS" -ge 2 ] && echo "- ⚠️ 检测到多次纠正，建议回顾" || echo "- ✅ 纠正次数在正常范围")

## 建议的进化方向

1. **规则强化** — 如果发现重复问题，添加到 behavioral-*.md
2. **记忆补充** — 如果有新的用户偏好，写入 memory/
3. **工作流优化** — 如果流程有瓶颈，更新 rules/

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
