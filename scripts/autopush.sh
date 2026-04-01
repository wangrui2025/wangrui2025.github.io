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

# 分析 README 修改内容生成具体描述（中文）
analyze_readme_changes() {
    local diff=$(git diff --cached README.md 2>/dev/null || echo "")
    local added=$(echo "$diff" | grep "^+" | grep -v "^+++" | wc -l)
    local deleted=$(echo "$diff" | grep "^-" | grep -v "^---" | wc -l)

    # 检测具体修改类型（关键词匹配中文和英文）
    if echo "$diff" | grep -qE "(自动化架构|architecture|三层|layer)"; then
        echo "补充自动化架构说明"
    elif echo "$diff" | grep -qE "(功能特性|功能|Features|feature)"; then
        echo "更新功能特性说明"
    elif echo "$diff" | grep -qE "(安装|install|setup|开始|quick start)"; then
        echo "完善安装与起步指南"
    elif echo "$diff" | grep -qE "(部署|deploy|构建|build|开发|dev)"; then
        echo "更新部署与开发流程"
    elif echo "$diff" | grep -qE "(TODO|FIXME|待办|roadmap|路线图)"; then
        echo "更新路线图与待办事项"
    elif echo "$diff" | grep -qE "(译为中文|translate|中文|i18n|international)"; then
        echo "将文档译为中文"
    elif [ "$added" -gt 10 ] && [ "$deleted" -lt 5 ]; then
        echo "新增文档章节"
    elif [ "$deleted" -gt 10 ] && [ "$added" -lt 5 ]; then
        echo "清理过时文档内容"
    else
        echo "润色文档细节"
    fi
}

# 分析 CSS 修改内容（中文）
css_change_description() {
    local diff=$(git diff --cached -- "*.css" 2>/dev/null || echo "")
    if echo "$diff" | grep -qE "(tabular-nums|font-variant|@font-face|等宽数字)"; then
        echo "优化排版与数字等宽显示"
    elif echo "$diff" | grep -qE "(--[a-z-]+:|color|background|#|主题|theme)"; then
        echo "调整配色方案与主题"
    elif echo "$diff" | grep -qE "(margin|padding|gap|flex|grid|display|布局)"; then
        echo "改进布局间距与结构"
    elif echo "$diff" | grep -qE "(@media|max-width|min-width|responsive|响应式)"; then
        echo "增强响应式设计"
    else
        echo "润色视觉样式"
    fi
}

# 分析 JSON 内容修改（中文）
json_change_description() {
    local file="$1"
    local diff=$(git diff --cached -- "$file" 2>/dev/null || echo "")

    if echo "$diff" | grep -qE '"period"|"date"|"year"|时间|日期'; then
        echo "更新时间与日期数据"
    elif echo "$diff" | grep -qE '"title"|"description"|"text"|标题|描述|内容'; then
        echo "润色文案表述"
    elif echo "$diff" | grep -qE '"url"|"link"|"href"|链接|引用'; then
        echo "更新链接与引用"
    else
        echo "调整配置数值"
    fi
}

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
        description=$(css_change_description)
    elif echo "$files" | grep -qE "(honors|education|content\.ts|papers|en\.json|zh\.json)"; then
        type="content"
        if echo "$files" | grep -q "honors"; then
            scope="honors"
            description="update honors and awards section"
        elif echo "$files" | grep -q "education"; then
            scope="education"
            description="update academic background"
        elif echo "$files" | grep -q "papers"; then
            scope="publications"
            local paper_file=$(echo "$files" | grep "papers" | head -1)
            description=$(json_change_description "$paper_file")
            description="add publication metadata"
        elif echo "$files" | grep -q "homepage"; then
            scope="homepage"
            description="refresh homepage copy"
        else
            scope="content"
            description="update site content"
        fi
    elif echo "$files" | grep -qE "(navigation|sidebar|masthead|AuthorProfile|PaperCard|ScholarBadge|BaseLayout)"; then
        type="feat"
        if echo "$files" | grep -q "navigation|sidebar|masthead"; then
            scope="navigation"
            description="enhance site navigation"
        elif echo "$files" | grep -q "AuthorProfile"; then
            scope="profile"
            description="update author profile card"
        elif echo "$files" | grep -q "PaperCard"; then
            scope="publications"
            description="improve publication display"
        elif echo "$files" | grep -q "ScholarBadge"; then
            scope="scholar"
            description="update citation metrics badge"
        elif echo "$files" | grep -q "BaseLayout"; then
            scope="layout"
            description="refine page layout structure"
        fi
    elif echo "$files" | grep -qE "(autopush\.sh|\.github/workflows|\.claude)"; then
        type="ci"
        if echo "$files" | grep -q "autopush"; then
            scope="automation"
            description="enhance commit automation logic"
        elif echo "$files" | grep -q "\.github/workflows"; then
            scope="workflows"
            description="adjust CI/CD pipeline"
        else
            scope="config"
            description="update tool configuration"
        fi
    elif echo "$files" | grep -q "README"; then
        type="docs"
        scope="readme"
        description=$(analyze_readme_changes)
    elif echo "$files" | grep -qE "\.md$"; then
        type="docs"
        scope="docs"
        description="update documentation"
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
            description="synchronize multiple components"
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
