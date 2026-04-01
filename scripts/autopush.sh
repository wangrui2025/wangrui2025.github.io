#!/bin/bash
# autopush.sh - 自动 add → commit → push

# 仅推送模式（用于 hooks）
if [ "$1" = "--push-only" ]; then
    git pull --rebase 2>/dev/null
    git push
    echo "Pushed."
    exit 0
fi

# 检查是否有更改
if [ -z "$(git status --porcelain)" ]; then
    echo "No changes to commit"
    exit 0
fi

# 根据修改的文件生成 commit message
generate_commit_msg() {
    local files=$(git diff --cached --name-only | head -20)
    local msg_parts=()

    # 检查关键文件修改
    if echo "$files" | grep -q "honors"; then
        msg_parts+=("Update honors data")
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

    # 如果没有匹配到具体类型，使用通用消息
    if [ ${#msg_parts[@]} -eq 0 ]; then
        # 从文件路径提取关键词
        local first_file=$(echo "$files" | head -1)
        local basename=$(basename "$first_file" .json .ts .astro .css 2>/dev/null || echo "$first_file")
        msg_parts=("Update $basename")
    fi

    # 用分号连接
    local IFS=';'
    echo "${msg_parts[*]}"
}

# 获取 commit message（如果提供了参数则使用参数，否则自动生成）
if [ -z "$1" ]; then
    commit_msg=$(generate_commit_msg)
else
    commit_msg="$1"
fi

# 执行 git add
git add -A

# 执行 git commit
git commit -m "$commit_msg"

# 执行 git pull --rebase 并 push
git pull --rebase 2>/dev/null
git push

echo "Done: $commit_msg"
