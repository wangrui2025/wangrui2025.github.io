#!/bin/bash
# 自我进化触发器 — 主动检测进化时机
# 使用 $CLAUDE_PROJECT_DIR 定位项目本地 .claude/

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(cd "$(dirname "$0")/.." && pwd)}"
CLAUDE_DIR="$PROJECT_DIR/.claude"

EVOLUTION_LOG="$CLAUDE_DIR/logs/evolution.log"
DIALOGUE_COUNT_FILE="$CLAUDE_DIR/state/dialogue-count"
LAST_EVOLUTION_FILE="$CLAUDE_DIR/state/last-evolution"
HISTORY_FILE="$CLAUDE_DIR/history.jsonl"

mkdir -p "$(dirname "$EVOLUTION_LOG")" "$(dirname "$DIALOGUE_COUNT_FILE")"

# 读取计数
DIALOGUE_COUNT=$(cat "$DIALOGUE_COUNT_FILE" 2>/dev/null || echo "0")
LAST_EVOLUTION=$(cat "$LAST_EVOLUTION_FILE" 2>/dev/null || echo "0")

# 增加计数
DIALOGUE_COUNT=$((DIALOGUE_COUNT + 1))
echo "$DIALOGUE_COUNT" > "$DIALOGUE_COUNT_FILE"

# 检查是否需要进化（每5次对话或距离上次进化10次以上）
SINCE_LAST=$((DIALOGUE_COUNT - LAST_EVOLUTION))

if [ "$SINCE_LAST" -ge 5 ] && [ -f "$HISTORY_FILE" ]; then
    # 分析最近的历史，检测模式
    RECENT_HISTORY=$(tail -100 "$HISTORY_FILE" 2>/dev/null | jq -r 'select(.type == "user") | .content' | tail -20 || echo "")

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
        mkdir -p "$CLAUDE_DIR/state"
        echo "$(date '+%Y-%m-%d %H:%M:%S') [EVOLUTION TRIGGERED] $REASON (dialogue #$DIALOGUE_COUNT)" >> "$EVOLUTION_LOG"

        # 创建进化建议文件（Claude 会在下次读取）
        cat > "$CLAUDE_DIR/state/pending-evolution.md" << EOF
---
detected_at: $(date '+%Y-%m-%d %H:%M:%S')
dialogue_count: $DIALOGUE_COUNT
reason: $REASON
---

## 检测到的信号
$([ "$EVOLUTION_KEYWORDS" -ge 2 ] && echo "- 用户提到学习/记住/下次等关键词" || echo "- 已积累$SINCE_LAST轮对话未进化")
- 纠正模式需人工判断

## 建议行动
回顾最近 $SINCE_LAST 轮对话，识别：
1. 重复的解释 → 添加到 memory/
2. 重复的确认请求 → 优化 permissions 或 hooks
3. 用户的新偏好 → 添加到 feedback/
4. 流程瓶颈 → 更新 rules/

EOF

        echo "$DIALOGUE_COUNT" > "$LAST_EVOLUTION_FILE"
        echo "EVOLUTION_SUGGESTED"
        exit 0
    fi
fi

exit 0
