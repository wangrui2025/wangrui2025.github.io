#!/bin/bash
# autopush.sh - 自动 add → commit → push
# 使用方式:
#   autopush.sh "msg"     # 使用指定提交信息（必须由AI生成）
#   autopush.sh --stage   # 仅暂存，输出改动摘要（供AI分析）
#   autopush.sh --push-only  # 仅推送已存在的提交

set -e

# 仅暂存模式 - 供AI分析改动
if [ "$1" = "--stage" ]; then
    git add -A
    git reset .astro .astro/** 2>/dev/null || true

    if git diff --cached --quiet; then
        echo "【无改动】"
        exit 0
    fi

    echo "【改动文件】"
    git diff --cached --name-only | head -10

    echo ""
    echo "【改动统计】"
    git diff --cached --stat | tail -1

    exit 0
fi

# 仅推送模式
if [ "$1" = "--push-only" ]; then
    git pull --rebase 2>/dev/null || true
    if ! git push; then
        echo "Push failed, trying force push..."
        git push --force-with-lease
    fi
    echo "Pushed."
    exit 0
fi

# 暂存所有修改（排除 .astro 缓存）
git add -A
git reset .astro .astro/** 2>/dev/null || true

# 检查是否有更改
if git diff --cached --quiet; then
    echo "No changes to commit"
    exit 0
fi

# 必须提供提交信息
if [ -z "$1" ]; then
    echo "错误：请提供语义化的 commit message。"
    echo "用法: ./scripts/autopush.sh '<type>(<scope>): <description>'"
    echo "提示：请让 Claude 分析 diff 后调用本脚本。"
    exit 1
fi

commit_msg="$1"

git commit -m "$commit_msg"

git pull --rebase 2>/dev/null || {
    echo "Pull rebase failed, continuing..."
}

if ! git push; then
    echo "Push failed (remote diverged), force pushing..."
    git push --force-with-lease
fi

echo "Done: $commit_msg"
