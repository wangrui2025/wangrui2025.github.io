# Current development direction

**CI mode: STANDARD_CI.**

The shared policy owner is [`.agents/docs/agents/CI_STANDARD.md`](https://github.com/mykcs/.agents/blob/main/docs/agents/CI_STANDARD.md). Its local CI implementation consists of the redirect-specific validator and workflow.

Maintain a small, public compatibility gateway for historical academic-homepage links. The complete homepage is developed in the private `mykcs/personal-homepage` repository; this repository holds only its redirect shell, public explanation and governance. [Wish](../wish/LATEST.md) owns the desired visitor experience.

GitHub owns source and pull requests. GitHub Pages publishes the tracked static HTML from `main` at the old academic address. The canonical site is served separately by Cloudflare Pages; this repository neither builds nor publishes that site. Vercel, CircleCI and a Cloudflare Worker have no role in this gateway. Project Pages under `/osa/`, `/GDKVM/` and `/sprites-gallery/` remain with their own repositories.

[`python3 .github/scripts/validate_redirects.py`](../../.github/scripts/validate_redirects.py) checks every tracked gateway route. The `.github/workflows/ci.yml` workflow runs it on pull requests and `main` pushes; the active strict `main` ruleset requires the exact-head `Repository validation` check from GitHub Actions App 15368. [`AGENTS.md`](../../AGENTS.md) retains the human review checklist. The redirect files and Pages settings, not this document, determine what is served.

GitHub Pages publishes `main:/`, so tracked files added outside the six redirect routes are also public after merge. Review that publication surface before merging CI-only files.
