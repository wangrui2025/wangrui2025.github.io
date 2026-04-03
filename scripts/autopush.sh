#!/bin/bash
# autopush.sh - 自动 add → commit → push
# 增强版：强制执行语义化 Commit Message 校验

set -e

# ================= 配置区 =================
# 禁止出现的敷衍词汇（正则匹配，不区分大小写）
FORBIDDEN_WORDS="auto-update|file change|updated files|update site|test hook"
# 最小字符长度
MIN_LENGTH=12
# ==========================================

retry_cmd() {
    local max_attempts=3
    local attempt=1
    local delay=5
    while [ $attempt -le $max_attempts ]; do
        if "$@"; then return 0; fi
        echo "命令失败，${delay}秒后重试 (${attempt}/${max_attempts})..."
        sleep $delay
        attempt=$((attempt + 1))
        delay=$((delay * 2))
    done
    echo "命令在 ${max_attempts} 次尝试后仍然失败: $*"
    return 1
}

# 校验函数：核心防错逻辑
validate_msg() {
    local msg="$1"
    
    # 1. 检查是否为空
    if [ -z "$msg" ]; then
        echo "❌ 错误：必须提供 commit message。"
        return 1
    fi

    # 2. 检查黑名单
    if echo "$msg" | grep -iqE "$FORBIDDEN_WORDS"; then
        echo "❌ 错误：禁止使用敷衍的描述（如: auto-update, file change）。"
        echo "   当前消息: \"$msg\""
        return 1
    fi

    # 3. 检查常规格式 (type: message 或 type(scope): message)
    if [[ ! "$msg" =~ ^[a-z]+(\([a-z0-9_-]+\))?:[[:space:]].+ ]]; then
        echo "❌ 错误：请遵循 Conventional Commits 格式。"
        echo "   正确示例: feat(cv): add export button 或 fix(style): adjust padding"
        return 1
    fi

    # 4. 检查长度
    if [ ${#msg} -lt $MIN_LENGTH ]; then
        echo "❌ 错误：commit message 太短了（当前 ${#msg} 字符，要求至少 $MIN_LENGTH）。请详细描述改动。"
        return 1
    fi

    return 0
}

# 打印当前改动上下文（供 AI 纠错使用）
print_diff_context() {
    echo ""
    echo "💡 提示：检测到以下改动，请基于此重新生成具体的 commit message："
    echo "-----------------------------------"
    git diff --cached --name-only
    echo "-----------------------------------"
    git diff --cached --stat | tail -1
}

# --- 模式处理 ---

if [ "$1" = "--stage" ]; then
    git add -A
    if git diff --cached --quiet; then
        echo "【无改动】"
    else
        echo "【改动统计】"
        git diff --cached --stat
    fi
    exit 0
fi

if [ "$1" = "--push-only" ]; then
    retry_cmd git pull --rebase
    retry_cmd git push
    exit 0
fi

# --- 主流程 ---

git add -A

if git diff --cached --quiet; then
    echo "No changes to commit"
    exit 0
fi

commit_msg="$1"

# 执行校验
if ! validate_msg "$commit_msg"; then
    print_diff_context
    exit 1
fi

# 校验通过，执行提交
git commit -m "$commit_msg"

retry_cmd git pull --rebase || {
    echo "错误: git pull --rebase 失败，可能存在冲突。"
    exit 1
}
retry_cmd git push

echo "✅ Success: $commit_msg"