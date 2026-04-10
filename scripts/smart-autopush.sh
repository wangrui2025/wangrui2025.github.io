#!/bin/bash
# Smart Auto-Push: 分析 git diff 生成描述性 commit message
# 支持 debounce 合并 + 智能 scope

set -e

REPO_DIR="${1:-$(pwd)}"
DEBOUNCE_FILE="$HOME/.autopush.debounce.$(echo "$REPO_DIR" | tr '/' '_')"
DEBOUNCE_SEC=5

cd "$REPO_DIR" 2>/dev/null || { echo "❌ 目录不存在: $REPO_DIR"; exit 1; }

# ============ Debounce ============
check_debounce() {
    local now=$(date +%s)
    local last_run=0

    if [ -f "$DEBOUNCE_FILE" ]; then
        last_run=$(cat "$DEBOUNCE_FILE" 2>/dev/null || echo 0)
    fi

    local elapsed=$((now - last_run))
    if [ $elapsed -lt $DEBOUNCE_SEC ]; then
        echo "⏳ Debounce: ${elapsed}s/${DEBOUNCE_SEC}s，等待中..."
        sleep $((DEBOUNCE_SEC - elapsed))
    fi

    echo $(date +%s) > "$DEBOUNCE_FILE"
    trap "rm -f $DEBOUNCE_FILE" EXIT
}

# ============ 0. 过滤 ============
check_debounce

IGNORE_PATTERNS="\.omc/state/|\.omc/sessions/|\.json\.wakatime|node_modules/|\.DS_Store|\.env$|\.cache/|session-stats\.json|usage-cache\.json|projects/.*\.jsonl|history\.jsonl|\.autopush\.lock|\.autopush\.debounce\."

ALL_CHANGES=$(git status --porcelain | grep -Ev "$IGNORE_PATTERNS" || true)
if [ -z "$ALL_CHANGES" ]; then
    echo "⏭️  无有效改动，跳过"
    rm -f "$LOCK_FILE"
    exit 0
fi

CHANGED_FILES=$(echo "$ALL_CHANGES" | grep "^.M" | awk '{print $2}')
NEW_FILES=$(echo "$ALL_CHANGES" | grep "^??" | awk '{print $2}')

# ============ 1. 智能 Scope ============
infer_scope() {
    local files="$1"
    local scope=""
    local priority=0

    # 优先级：更具体的路径优先
    for f in $files; do
        case "$f" in
            cv/*|*/cv/*)    scope="cv"; priority=60 ;;
            zh/*|*/zh/*)    [ $priority -lt 55 ] && scope="cv" priority=55 ;;
            en/*|*/en/*)    [ $priority -lt 55 ] && scope="cv" priority=55 ;;
            components/*)   [ $priority -lt 50 ] && scope="components" priority=50 ;;
            layouts/*)      [ $priority -lt 50 ] && scope="layouts" priority=50 ;;
            pages/*)        [ $priority -lt 50 ] && scope="pages" priority=50 ;;
            hooks/*)        [ $priority -lt 45 ] && scope="hooks" priority=45 ;;
            scripts/*)      [ $priority -lt 45 ] && scope="scripts" priority=45 ;;
            rules/*)        [ $priority -lt 40 ] && scope="rules" priority=40 ;;
            memory/*)       [ $priority -lt 40 ] && scope="memory" priority=40 ;;
            knowledge/*)     [ $priority -lt 40 ] && scope="knowledge" priority=40 ;;
            plugins/*)      [ $priority -lt 30 ] && scope="plugins" priority=30 ;;
        esac
    done

    [ -z "$scope" ] && scope="misc"
    echo "$scope"
}

# ============ 2. Type ============
infer_type() {
    local changed="$1"
    local new="$2"

    if [ -n "$new" ]; then
        echo "$new" | grep -qE '\.(ts|tsx|js|jsx)$' && echo "feat" || echo "chore"
    elif echo "$changed" | grep -qE 'package\.json|\.config'; then
        echo "chore"
    elif echo "$changed" | grep -qE 'fix|bug|patch'; then
        echo "fix"
    else
        echo "chore"
    fi
}

# ============ 3. Description ============
generate_description() {
    local changed="$1"
    local new="$2"
    local descriptions=()

    for f in $changed $new; do
        local basename=$(basename "$f")
        local ext="${basename##*.}"
        case "$ext" in
            astro) descriptions+=("update $(echo "$f" | sed 's|.*/||')") ;;
            ts|tsx|js|jsx) descriptions+=("update $(basename "$f")") ;;
            css|scss) descriptions+=("update styles") ;;
            md) descriptions+=("update docs") ;;
            sh) descriptions+=("update scripts") ;;
            *) descriptions+=("update $(basename "$f")") ;;
        esac
    done

    printf '%s\n' "${descriptions[@]}" 2>/dev/null | sort -u | head -3 | tr '\n' ' '
}

# ============ 4. 组装 ============
SCOPE=$(infer_scope "$CHANGED_FILES $NEW_FILES")
TYPE=$(infer_type "$CHANGED_FILES" "$NEW_FILES")
DESCRIPTION=$(generate_description "$CHANGED_FILES" "$NEW_FILES")

if [ -n "$DESCRIPTION" ]; then
    COMMIT_MSG="${TYPE}(${SCOPE}): ${DESCRIPTION}"
else
    FIRST_FILE=$(echo "$CHANGED_FILES $NEW_FILES" | head -1)
    if [ -n "$FIRST_FILE" ]; then
        COMMIT_MSG="${TYPE}(${SCOPE}): update $(basename "$FIRST_FILE")"
    else
        echo "⏭️  无有效文件"
        rm -f "$LOCK_FILE"
        exit 0
    fi
fi

# ============ 5. 执行 ============
echo "📝 Commit: $COMMIT_MSG"

# 只添加已跟踪且非忽略的修改
git add -u
git commit -m "$COMMIT_MSG"

if git remote get-url origin &>/dev/null; then
    git push origin HEAD 2>&1 | head -3
    echo "✅ Pushed"
else
    echo "✅ Committed (no remote)"
fi

rm -f "$LOCK_FILE"
