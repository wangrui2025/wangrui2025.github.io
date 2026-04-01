#!/bin/bash
# autopush.sh - 自动 add → commit → push
# 使用方式:
#   autopush.sh           # 自动暂存、生成提交信息、提交并推送
#   autopush.sh --stage   # 仅暂存，输出改动摘要（供AI分析）
#   autopush.sh "msg"     # 使用指定提交信息

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

# 如果有传入参数，使用作为提交信息
if [ -n "$1" ]; then
    commit_msg="$1"
else
    # 基础自动检测（备用）
    files=$(git diff --cached --name-only | head -5)
    type="chore"
    scope="site"
    description="同步改动"

    if echo "$files" | grep -q "\.css$"; then
        type="style"; scope="global"
    elif echo "$files" | grep -q "\.md$"; then
        type="docs"; scope="readme"
    elif echo "$files" | grep -qE "(honors|education|papers)"; then
        type="content"; scope="data"
    elif echo "$files" | grep -q "autopush"; then
        type="ci"; scope="automation"
    fi

    commit_msg="${type}(${scope}): ${description}"
fi

git commit -m "$commit_msg"

git pull --rebase 2>/dev/null || {
    echo "Pull rebase failed, continuing..."
}

if ! git push; then
    echo "Push failed (remote diverged), force pushing..."
    git push --force-with-lease
fi

echo "Done: $commit_msg"
