# Development Workflow

> This file extends [common/git-workflow.md](./git-workflow.md) with the full feature development process that happens before git operations.

The Feature Implementation Workflow describes the development pipeline: research, planning, TDD, code review, and then committing to git.

## Research-First Protocol (强制顺序)

**在写任何新代码之前，必须按此顺序调研：**

1. **GitHub search first** — `gh search repos` / `gh search code` 找现有实现和模式
2. **Library docs second** — 用 Context7 或官方文档确认 API 行为、版本细节
3. **Exa only when insufficient** — 前两步无法解决时再用网络搜索
4. **Package registries** — 搜索 npm/PyPI/crates.io，优先用经过验证的库而非手写
5. **Adapt over write** — 能 fork/port/改写的开源方案就不要从头写

**Why:** 避免重复造轮子，确保使用经过实战检验的方案，减少 bug 率。

**How to apply:** 每个新功能/组件开始前，先执行调研步骤并产出结论，再进入 Plan 阶段。

1. **Plan First**
   - Use **planner** agent to create implementation plan
   - Generate planning docs before coding: PRD, architecture, system_design, tech_doc, task_list
   - Identify dependencies and risks
   - Break down into phases

2. **TDD Approach**
   - Use **tdd-guide** agent
   - Write tests first (RED)
   - Implement to pass tests (GREEN)
   - Refactor (IMPROVE)
   - Verify 80%+ coverage

3. **Code Review**
   - Use **code-reviewer** agent immediately after writing code
   - Address CRITICAL and HIGH issues
   - Fix MEDIUM issues when possible

4. **Commit & Push**
   - Detailed commit messages
   - Follow conventional commits format
   - See [git-workflow.md](./git-workflow.md) for commit message format and PR process

5. **Pre-Review Checks**
   - Verify all automated checks (CI/CD) are passing
   - Resolve any merge conflicts
   - Ensure branch is up to date with target branch
   - Only request review after these checks pass
