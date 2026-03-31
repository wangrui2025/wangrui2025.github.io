#!/bin/bash
# autopush.sh - 自动 add → commit → push

# 获取 commit message（如果没有提供参数，使用默认消息）
if [ -z "$1" ]; then
    commit_msg="update"
else
    commit_msg="$1"
fi

# 检查是否有更改
if [ -z "$(git status --porcelain)" ]; then
    echo "No changes to commit"
    exit 0
fi

# 执行 git add
git add -A

# 执行 git commit
git commit -m "$commit_msg"

# 执行 git push
git push

echo "Done: $commit_msg"
