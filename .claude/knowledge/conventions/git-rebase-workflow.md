---
name: git rebase workflow
description: Repo has auto-update workflow that pushes automatically — always fetch/reset before push
type: feedback
---

## Rule: Push 前必须同步远程

**Why:** 远程有自动更新 workflow (Scholar stats) 会自动 commit 和 push，导致远程始终领先本地，常见两种错误：
1. `cannot lock ref` — 远程 ref 指针冲突
2. `fetch first` — 远程有新提交

**How to apply:**
1. 每次 push 前：先 `git pull --rebase origin main` 再 `git push`
2. 如果 rebase 后仍报错（`fetch first`）：用 `git fetch origin && git reset --hard origin/main` 强制同步到远程最新状态
3. **不要直接 `git push`** — 必须先同步

**进化：** 这个 repo 改动频繁，开始工作前应该先 `git fetch && git reset --hard origin/main` 确保本地是最新的。

## 关键陷阱：reset 后必须立即提交

**Why:** 远程 auto-update 会频繁推送 `.astro,.css,.json` 等文件的 commit。执行 `git reset --hard` 后，本地改动会被远程版本覆盖，且 git 会显示 "nothing to commit"。

**How to apply:**
1. 执行 `git reset --hard origin/main` 后，**立即**执行 `git add` 和 `git commit`
2. 中间不能有 Read/grep 等读取操作，不能有延迟
3. 正确顺序：`git fetch` → `git reset --hard` → `git add <files>` → `git commit` → `git push`
4. 如果中间被打断（读取了文件），重复上述步骤
