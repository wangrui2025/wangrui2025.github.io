# Design Page Redesign Implementation Plan

> **For agentic workers:** Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement.

**Goal:** Redesign `/design/` page from technical documentation to "designer's memoir" — first-person narrative explaining why each design decision was made.

**Architecture:** Single-page redesign of `astro/src/pages/design.astro` (1032 lines). Keep existing page structure but replace content style from technical/changelog to first-person narrative. Add new sections for Favicon, CV Design, Icon Selection. Reorganize TOC.

**Tech Stack:** Astro v6 + Tailwind CSS v4

---

## File Map

| File | Responsibility |
|------|----------------|
| `astro/src/pages/design.astro` | Main design page — all content |
| `astro/src/styles/global.css` | Design tokens (reference only, no changes) |
| `docs/superpowers/specs/2026-04-19-design-page-design.md` | Spec document (read-only reference) |

---

## Task 1: Redesign Hero Section

**File:** `astro/src/pages/design.astro:11-49`

- [ ] **Step 1: Update Hero badge**
  Change `v1.0 · 854 commits` to `Designer's Memoir` style badge

- [ ] **Step 2: Rewrite Hero headline**
  Change from "设计规范" to personal statement about this page's purpose

- [ ] **Step 3: Add memoir intro paragraph**
  New paragraph explaining: homepage = result for everyone, /design/ = explanation for those who want to understand

- [ ] **Step 4: Commit**
  ```bash
  git add astro/src/pages/design.astro
  git commit -m "feat(design): redesign hero to designer's memoir intro"
  ```

---

## Task 2: Update TOC Navigation

**File:** `astro/src/pages/design.astro:51-92`

- [ ] **Step 1: Replace TOC items**
  Old: Philosophy, Tokens, Pages, Components, Timeline, Notes, Maintenance
  New: Philosophy, Typography, Color, Spacing, Dark Mode, Tech Stack, Performance, Favicon, CV, Icons, Timeline

- [ ] **Step 2: Commit**
  ```bash
  git add astro/src/pages/design.astro
  git commit -m "feat(design): update TOC with new section names"
  ```

---

## Task 3: Redesign Philosophy Section (First-Person)

**File:** `astro/src/pages/design.astro:96-167`

- [ ] **Step 1: Rewrite Philosophy intro**
  First-person narrative: "我为什么要做这个网站？"

- [ ] **Step 2: Rewrite 3 principle cards in first-person**
  Each card:
  - Why I made this choice (not what it does)
  - Design motivation
  - Reference/source

  Card 1 (was: 学术性与个人风格的平衡):
  ```
  "我选择用 SVG icon 替换 emoji，是因为..."
  ```

  Card 2 (was: 性能优先，无 FOUC):
  ```
  "我遇到过 FOUC 问题，当时是这样的..."
  ```

  Card 3 (was: 内容即接口):
  ```
  "我不想手动维护引用数，因为..."
  ```

- [ ] **Step 3: Commit**
  ```bash
  git add astro/src/pages/design.astro
  git commit -m "feat(design): rewrite philosophy in first-person narrative"
  ```

---

## Task 4: Add Typography Section (NEW)

**File:** `astro/src/pages/design.astro` — insert after Philosophy section

- [ ] **Step 1: Create Typography section**
  Add section with id="typography"

  Content (first-person):
  - **标题字体**: 为什么选 Source Serif？（学术感但不死板，曲线柔和）
  - **正文字体**: 为什么选 Inter？（与 Source Serif 形成对比，一个有人文温度，一个干净现代）
  - **等宽字体**: 用什么？（JetBrains Mono 或 SF Mono）

  Style: Use quote boxes with serif font to show examples

- [ ] **Step 2: Commit**
  ```bash
  git add astro/src/pages/design.astro
  git commit -m "feat(design): add typography section with first-person narrative"
  ```

---

## Task 5: Add Color Section (NEW, replaces Tokens/Colors)

**File:** `astro/src/pages/design.astro` — replace color display in Tokens

- [ ] **Step 1: Rewrite Color section**
  First-person narrative for each color:

  **#c96442 accent 色**:
  ```
  "我选择这个橙褐色，是因为..."
  - 它足够醒目来标记重点
  - 但不像红色那么侵略性
  - 我在学术场合试过，面试官会注意到但不会觉得刺眼
  - Google Scholar 的链接也是类似的暖色调
  ```

  **#f5f4ed background**:
  ```
  "我选择这个米白背景，是因为..."
  - 不同于纯白，更温和
  - 配合 serif 字体有书卷气
  ```

  **Dark mode colors**:
  ```
  "暗黑模式的颜色选择，我参考了..."
  ```

- [ ] **Step 2: Commit**
  ```bash
  git add astro/src/pages/design.astro
  git commit -m "feat(design): rewrite color section with design rationale"
  ```

---

## Task 6: Add Spacing & Hierarchy Section (NEW)

**File:** `astro/src/pages/design.astro` — insert after Color

- [ ] **Step 1: Create Spacing section**
  id="spacing"

  Content:
  - **标题字号**: 为什么用大字号？（信息流里首先被扫过）
  - **段落间距**: 为什么留足够空间？（让读者有呼吸感）
  - **小标题作用**: 怎么引导视线？

  Use before/after comparison or problem-solution format

- [ ] **Step 2: Commit**
  ```bash
  git add astro/src/pages/design.astro
  git commit -m "feat(design): add spacing and hierarchy section"
  ```

---

## Task 7: Add Dark Mode Section (NEW)

**File:** `astro/src/pages/design.astro` — insert after Spacing

- [ ] **Step 1: Create Dark Mode section**
  id="dark-mode"

  Content:
  - **Why 自建**: "我为什么不用系统暗黑模式？"
  - **FOUC 处理**: "当时遇到了什么问题？我是这么解决的"
  - **Reference**: 借鉴了哪些设计系统？

- [ ] **Step 2: Commit**
  ```bash
  git add astro/src/pages/design.astro
  git commit -m "feat(design): add dark mode section with FOUC story"
  ```

---

## Task 8: Add Tech Stack Section (NEW)

**File:** `astro/src/pages/design.astro` — insert after Dark Mode

- [ ] **Step 1: Create Tech Stack section**
  id="tech-stack"

  Content:
  - **Astro v6**: 为什么选 Astro？（静态生成、零 JS、GitHub Pages 原生支持）
  - **Tailwind v4**: 为什么从 v3 升级到 v4？迁移遇到了什么问题？
  - **CSS 变量方案**: 为什么用 CSS 变量而不是 Tailwind config？

- [ ] **Step 2: Commit**
  ```bash
  git add astro/src/pages/design.astro
  git commit -m "feat(design): add tech stack section with migration story"
  ```

---

## Task 9: Add Performance Section (NEW)

**File:** `astro/src/pages/design.astro` — insert after Tech Stack

- [ ] **Step 1: Create Performance section**
  id="performance"

  Content:
  - **CDN 策略**: 为什么用固定 SHA 而不是 @latest？
  - **Critical CSS**: 为什么要内联？怎么做的？
  - **字体加载**: @font-face 怎么处理 FOUC？

- [ ] **Step 2: Commit**
  ```bash
  git add astro/src/pages/design.astro
  git commit -m "feat(design): add performance section with CDN strategy"
  ```

---

## Task 10: Add Favicon Section (NEW)

**File:** `astro/src/pages/design.astro` — insert after Performance

- [ ] **Step 1: Create Favicon section**
  id="favicon"

  Content:
  - **灵感来源**: 宝可梦画廊的 idea
  - **为什么是 Smeargle**: 800+ 精灵里怎么选中的？
  - **技术实现**: fixedFavicon prop 怎么工作的？

  Include visual: show Smeargle favicon

- [ ] **Step 2: Commit**
  ```bash
  git add astro/src/pages/design.astro
  git commit -m "feat(design): add favicon section with Smeargle story"
  ```

---

## Task 11: Add CV Design Section (NEW)

**File:** `astro/src/pages/design.astro` — insert after Favicon

- [ ] **Step 1: Create CV section**
  id="cv"

  Content:
  - **模板选择**: 为什么选这个 CV 模板？
  - **结构化数据**: 为什么用 JSON 而非数据库？
  - **Zod schema**: 为什么要验证？

- [ ] **Step 2: Commit**
  ```bash
  git add astro/src/pages/design.astro
  git commit -m "feat(design): add CV design section"
  ```

---

## Task 12: Add Icons Section (NEW)

**File:** `astro/src/pages/design.astro` — insert after CV

- [ ] **Step 1: Create Icons section**
  id="icons"

  Content:
  - **图标选择**: 我怎么选图标的？
  - **参考设计系统**: 我参考了哪些？（Lucide, Heroicons, Feather）
  - **为什么不用 emoji**: 学术场合的考量

- [ ] **Step 2: Commit**
  ```bash
  git add astro/src/pages/design.astro
  git commit -m "feat(design): add icons section with design rationale"
  ```

---

## Task 13: Restructure Timeline Section

**File:** `astro/src/pages/design.astro` Timeline section

- [ ] **Step 1: Rewrite Timeline intro**
  Change from commit log style to design decision history style

  Old style: "commit SHA — commit message"
  New style: "2024-W17: 字体系统 — 我把标题从 Inter 换成了 Source Serif，因为..."

- [ ] **Step 2: Reorganize entries**
  Group by design decision, not by commit date

- [ ] **Step 3: Commit**
  ```bash
  git add astro/src/pages/design.astro
  git commit -m "feat(design): restructure timeline as design decision history"
  ```

---

## Task 14: Final Build Verification

- [ ] **Step 1: Run astro check**
  ```bash
  cd astro && npx astro check
  ```
  Expected: 0 errors

- [ ] **Step 2: Run build**
  ```bash
  cd astro && npm run build
  ```
  Expected: Build successful

- [ ] **Step 3: Commit final state**
  ```bash
  git add -A
  git commit -m "feat(design): complete designer's memoir page redesign"
  ```

---

## Self-Review Checklist

- [ ] All 11 modules present (Hero, Philosophy, Typography, Color, Spacing, Dark Mode, Tech Stack, Performance, Favicon, CV, Icons, Timeline)
- [ ] First-person narrative throughout
- [ ] Each design decision answers: Why? + Reference? + What problem does it solve?
- [ ] No "what" only descriptions — all have "why"
- [ ] Build passes
- [ ] All commits follow conventional commits format

---

**Plan saved to:** `docs/superpowers/plans/2026-04-19-design-page-redesign.md`
