#!/bin/bash
# autopush.sh - 自动 add → commit → push

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

# 根据修改的文件生成 commit message
generate_commit_msg() {
    local files=$(git diff --cached --name-only | head -20)
    local changes=()

    if echo "$files" | grep -q "honors"; then
        changes+=("Update honors")
    fi
    if echo "$files" | grep -q "education"; then
        changes+=("Update education")
    fi
    if echo "$files" | grep -q "content.ts"; then
        if echo "$files" | grep -q "en.json\|zh.json"; then
            changes+=("Update homepage content")
        else
            changes+=("Update content")
        fi
    fi
    if echo "$files" | grep -q "papers"; then
        changes+=("Update publications")
    fi
    if echo "$files" | grep -q "global.css\|tailwind"; then
        changes+=("Update styles")
    fi
    if echo "$files" | grep -q "navigation\|sidebar\|masthead"; then
        changes+=("Update navigation")
    fi
    if echo "$files" | grep -q "AuthorProfile"; then
        changes+=("Update profile")
    fi
    if echo "$files" | grep -q "PaperCard"; then
        changes+=("Update paper card")
    fi
    if echo "$files" | grep -q "ScholarBadge"; then
        changes+=("Update scholar badge")
    fi
    if echo "$files" | grep -q "BaseLayout"; then
        changes+=("Update layout")
    fi
    if echo "$files" | grep -q "en.json"; then
        if ! echo "$files" | grep -q "content.ts\|papers"; then
            changes+=("Update English content")
        fi
    fi
    if echo "$files" | grep -q "zh.json"; then
        if ! echo "$files" | grep -q "content.ts\|papers"; then
            changes+=("Update Chinese content")
        fi
    fi
    if echo "$files" | grep -q "autopush"; then
        changes+=("Improve autopush script")
    fi
    if echo "$files" | grep -q "settings.json"; then
        changes+=("Update settings")
    fi

    if [ ${#changes[@]} -eq 0 ]; then
        local first_file=$(echo "$files" | head -1)
        local basename=$(basename "$first_file" .json .ts .astro .css .mjs 2>/dev/null || echo "$first_file")
        changes=("Update \$basename")
    fi

    printf '%s\n' "${changes[@]}" | sort -u | paste -sd ',' -
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
