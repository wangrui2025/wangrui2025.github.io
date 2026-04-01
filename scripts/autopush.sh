#!/bin/bash
# autopush.sh - 自动 add → commit → push
# Follows Conventional Commits: <type>(<scope>): <description>

set -e

# 仅推送模式（用于 hooks）
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

# 根据修改的文件生成 Conventional Commit message
generate_commit_msg() {
    local files=$(git diff --cached --name-only | head -20)
    local type="chore"
    local scope=""
    local description=""
    local body=""

    # 确定 type 和 scope
    if echo "$files" | grep -qE "\.css$|\.scss$|tailwind"; then
        type="style"
        scope="global"
        description="update styles"
    elif echo "$files" | grep -qE "(honors|education|content\.ts|papers|en\.json|zh\.json)"; then
        type="content"
        if echo "$files" | grep -q "honors"; then
            scope="honors"
            description="update honors data"
        elif echo "$files" | grep -q "education"; then
            scope="education"
            description="update education data"
        elif echo "$files" | grep -q "papers"; then
            scope="publications"
            description="update publications"
        elif echo "$files" | grep -q "homepage"; then
            scope="homepage"
            description="update homepage content"
        else
            scope="content"
            description="update content"
        fi
    elif echo "$files" | grep -qE "(navigation|sidebar|masthead|AuthorProfile|PaperCard|ScholarBadge|BaseLayout)"; then
        type="feat"
        if echo "$files" | grep -q "navigation|sidebar|masthead"; then
            scope="navigation"
            description="update navigation components"
        elif echo "$files" | grep -q "AuthorProfile"; then
            scope="profile"
            description="update author profile"
        elif echo "$files" | grep -q "PaperCard"; then
            scope="publications"
            description="update paper card component"
        elif echo "$files" | grep -q "ScholarBadge"; then
            scope="scholar"
            description="update scholar badge"
        elif echo "$files" | grep -q "BaseLayout"; then
            scope="layout"
            description="update base layout"
        fi
    elif echo "$files" | grep -qE "(autopush\.sh|\.github/workflows|\.claude)"; then
        type="ci"
        if echo "$files" | grep -q "autopush"; then
            scope="automation"
            description="improve autopush script"
        elif echo "$files" | grep -q "\.github/workflows"; then
            scope="workflows"
            description="update CI workflows"
        else
            scope="config"
            description="update configuration"
        fi
    else
        # 默认处理
        type="chore"
        local first_file=$(echo "$files" | head -1)
        local ext="${first_file##*.}"
        local basename=$(basename "$first_file" ".$ext" 2>/dev/null || echo "$first_file")
        scope="$ext"
        description="update $basename"
    fi

    # 如果有多个不同的 scope，使用通用 scope
    local unique_files=$(echo "$files" | wc -l)
    if [ "$unique_files" -gt 3 ]; then
        scope="site"
        if [ -z "$description" ]; then
            description="update multiple components"
        fi
    fi

    echo "${type}(${scope}): ${description}"
}

commit_msg=$(generate_commit_msg)
git commit -m "$commit_msg"

git pull --rebase 2>/dev/null || {
    echo "Pull rebase failed, continuing..."
}

if ! git push; then
    echo "Push failed (remote diverged), force pushing..."
    git push --force-with-lease
fi

echo "Done: $commit_msg"
