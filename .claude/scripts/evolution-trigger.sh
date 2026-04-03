#!/bin/bash
# 自我进化触发器 — 主动检测进化时机

EVOLUTION_LOG="$HOME/.claude/logs/evolution.log"
DIALOGUE_COUNT_FILE="$HOME/.claude/state/dialogue-count"
LAST_EVOLUTION_FILE="$HOME/.claude/state/last-evolution"

mkdir -p "$(dirname "$EVOLUTION_LOG")" "$(dirname "$DIALOGUE_COUNT_FILE")"

# 读取计数
DIALOGUE_COUNT=$(cat "$DIALOGUE_COUNT_FILE" 2>/dev/null || echo "0")
LAST_EVOLUTION=$(cat "$LAST_EVOLUTION_FILE" 2>/dev/null || echo "0")

# 增加计数
DIALOGUE_COUNT=$((DIALOGUE_COUNT + 1))
echo "$DIALOGUE_COUNT" > "$DIALOGUE_COUNT_FILE"

# 检查是否需要进化（每5次对话或距离上次进化10次以上）
SINCE_LAST=$((DIALOGUE_COUNT - LAST_EVOLUTION))

if [ "$SINCE_LAST" -ge 5 ]; then
    # 分析最近的历史，检测模式
    RECENT_HISTORY=$(tail -100 "$HOME/.claude/history.jsonl" 2>/dev/null | jq -r 'select(.type == "user") | .content' | tail -20)

    # 检测重复模式（简单启发式：相似词频）
    REPEAT_PATTERNS=$(echo "$RECENT_HISTORY" | grep -oE '\b\w{4,}\b' | sort | uniq -c | sort -rn | head -5 | awk '$1 >= 3 {print}')

    # 检测进化关键词
    EVOLUTION_KEYWORDS=$(echo "$RECENT_HISTORY" | grep -iE '(记住|学习|记住这个|下次|总是|又|重复|再次)' | wc -l)

    SHOULD_EVOLVE=false
    REASON=""

    if [ "$EVOLUTION_KEYWORDS" -ge 2 ]; then
        SHOULD_EVOLVE=true
        REASON="检测到进化关键词"
    elif [ "$SINCE_LAST" -ge 10 ]; then
        SHOULD_EVOLVE=true
        REASON="距离上次进化已超过10轮对话"
    fi

    if [ "$SHOULD_EVOLVE" = true ]; then
        echo "$(date '+%Y-%m-%d %H:%M:%S') [EVOLUTION TRIGGERED] $REASON (dialogue #$DIALOGUE_COUNT)" >> "$EVOLUTION_LOG"

        # 创建进化建议文件（Claude 会在下次读取）
        cat > "$HOME/.claude/state/pending-evolution.md" << EOF
---
detected_at: $(date '+%Y-%m-%d %H:%M:%S')
dialogue_count: $DIALOGUE_COUNT
reason: $REASON
---

## 检测到的信号
$([ "$EVOLUTION_KEYWORDS" -ge 2 ] && echo "- 用户提到学习/记住/下次等关键词" || true)
$([ "$SINCE_LAST" -ge 10 ] && echo "- 已积累10轮对话未进化" || true)

## 建议行动
运行自我蒸馏分析：
1. 回顾最近$SINCE_LAST轮对话
2. 识别重复模式或可以固化的规则
3. 生成进化建议或更新规则文件

EOF

        echo "$DIALOGUE_COUNT" > "$LAST_EVOLUTION_FILE"
        echo "EVOLUTION_SUGGESTED"
        exit 0
    fi
fi

exit 0
