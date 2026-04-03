# Global Context (Static Preferences)
# 低频变动 + 全局适用的事实与偏好
# 此文件为只读上下文，严禁在交互中覆写

---

## 用户身份

- **姓名**：王锐
- **身份**：深圳大学计算机与软件学院硕士研究生
- **研究方向**：超声心动图视频分割、医学影像分析、计算机视觉、深度学习
- **GitHub**：wangrui2025（科研）/ mykcs（开发）
- **语言**：简体中文，专有名词用英文

---

## 输出格式偏好

- 单行布局，时间右对齐
- 教育经历：合并为单行，学校+专业+学位，时间单独右对齐
- 荣誉奖项：奖项名称在前，时间放后面并右对齐
- 移动端自适应：使用 flex-wrap 确保不溢出
- 时间用浅灰色淡化（opacity: 0.5）

---

## 工作流偏好

- **测试改动**：无需确认，直接执行
- **Git push**：必须先 `git pull --rebase` 同步远程，再 push
- **reset 后**：立即 add + commit，防止远程覆盖
- **配置变更**：主动提醒同步到 chezmoi
- **autopush**：每次改动后自动执行 git add → commit → push

---

## 内容同步

- **中英文同步**：任何页面改动必须同时更新 zh 和 en 两个版本
- **分隔符对齐**：中文用 `·`，英文也用 `·`，顺序一致
- **翻译地道**：英文不逐字翻译，要用地道表达

---

## 文档规范

- **能做到/做不到**：所有文档必须明确列出能力边界
- **命令可复制**：关键步骤提供可直接粘贴的命令，不跳步
- **外部依赖说明**：如涉及 GitHub CLI，写清登录方式

---

## 代码/提交规范

- **Commit 规范**：Conventional Commits，`<type>(<scope>): <description>`
- **禁止罗列扩展名**：不写 `.astro,.css,.json,.ts,Update...`
- **描述实质内容**：`style(theme): update global CSS variables` 而非 `update en.json and zh.json`

---

## 问题处理

- **路径/配置问题**：发现一个后主动搜索整个代码库是否存在同类问题
- **Bug 修复**：禁止提前宣告，必须通过真实终端输出验证
- **重复失败（>=2次）**：触发 [MODE: SELF_EVOLUTION] 元认知协议

---

## Git 工作流（wangrui2025.github.io 专用）

- 远程有自动更新 workflow (Scholar stats) 会自动 commit 和 push
- **Push 前**：必须先 `git pull --rebase`，否则会报 `cannot lock ref` 或 `fetch first`
- **同步失败时**：`git fetch origin && git reset --hard origin/main` 强制同步
- **reset 后必须立即**：执行 `git add` 和 `git commit`，防止远程覆盖本地改动
- **开始工作前**：先 `git fetch && git reset --hard origin/main` 确保本地最新
