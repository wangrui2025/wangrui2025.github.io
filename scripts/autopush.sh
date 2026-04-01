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

# 检查是否有更改（排除 .astro 缓存目录）
if [ -z "$(git status --porcelain | grep -v ".astro/")" ]; then
    echo "No changes to commit"
    exit 0
fi

# 根据修改的文件生成 commit message
generate_commit_msg() {
    local files=$(git diff --cached --name-only | head -20)
    local msg_parts=()

    if echo "$files" | grep -q "honors"; then
        msg_parts+=("Update honors")
    fi
    if echo "$files" | grep -q "content"; then
        msg_parts+=("Update content")
    fi
    if echo "$files" | grep -q "education"; then
        msg_parts+=("Update education")
    fi
    if echo "$files" | grep -q "papers"; then
        msg_parts+=("Update publications")
    fi
    if echo "$files" | grep -q "global.css\|tailwind"; then
        msg_parts+=("Update styles")
    fi
    if echo "$files" | grep -q "navigation\|sidebar\|masthead"; then
        msg_parts+=("Update navigation")
    fi
    if echo "$files" | grep -q "AuthorProfile\|PaperCard\|ScholarBadge"; then
        msg_parts+=("Update components")
    fi
    if echo "$files" | grep -q "en.json\|zh.json"; then
        msg_parts+=("Update i18n")
    fi
    if echo "$files" | grep -q "autopush\|settings.json"; then
        msg_parts+=("Update config")
    fi

    if [ ${#msg_parts[@]} -eq 0 ]; then
        local first_file=$(echo "$files" | head -1)
        local basename=$(basename "$first_file" .json .ts .astro .css .mjs 2>/dev/null || echo "$first_file")
        msg_parts=("Update $basename")
    fi

    local IFS=';'
    echo "${msg_parts[*]}"
}

# 生成 commit message
commit_msg=$(generate_commit_msg)

# 执行 git add（排除 .astro 缓存）
git add -A
git reset .astro .astro/** 2>/dev/null || true

# 如果有要提交的内容则 commit
if git diff --cached --quiet; then
    echo "No changes to commit"
    exit 0
fi

git commit -m "$commit_msg"

# 处理远程分叉：pull --rebase 然后 push
git pull --rebase 2>/dev/null || {
    echo "Pull rebase failed, continuing with push..."
}

if ! git push; then
    echo "Push failed (remote diverged), force pushing..."
    git push --force-with-lease
fi

echo "Done: $commit_msg"
