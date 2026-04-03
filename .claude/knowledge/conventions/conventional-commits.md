---
name: conventional-commits
name: Use Conventional Commits for commit messages
type: feedback
---

All commit messages must follow the Conventional Commits specification: `<type>(<scope>): <description>`

**Rules:**
- **Never** list file extensions in the subject line (e.g., `.astro,.css,.json,.mjs,.ts,Update...` is forbidden)
- Subject line should describe the *substance* of the change, not the files modified
- Use appropriate type: `feat`, `fix`, `style`, `refactor`, `docs`, `chore`, etc.
- If multiple logical changes, list them in the commit body with bullet points

**Examples:**
- ❌ Bad: `.astro,.css,.json,.mjs,.ts,Update global.css`
- ✅ Good: `style(theme): update global CSS variables and styles`
- ✅ Good: `refactor(config): update project build and styling configurations`

**How to apply:**
When generating commit messages, summarize the actual change being made. If asked to commit changes to multiple files, ask what the logical change is (e.g., "feat: add bilingual support" not "update en.json and zh.json").
