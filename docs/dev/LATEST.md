# Current development direction

Maintain a small, public compatibility gateway for historical academic-homepage links. The complete homepage is developed in the private `mykcs/personal-homepage` repository; this repository holds only its redirect shell, public explanation and governance. [Wish](../wish/LATEST.md) owns the desired visitor experience.

GitHub owns source and pull requests. GitHub Pages publishes the tracked static HTML from `main` at the old academic address. The canonical site is served separately by Cloudflare Pages; this repository neither builds nor publishes that site. Vercel, CircleCI and a Cloudflare Worker have no role in this gateway. Project Pages under `/osa/`, `/GDKVM/` and `/sprites-gallery/` remain with their own repositories.

Today, this repository has **no automatic CI workflow or required PR check**. Redirect review follows the checks in [`AGENTS.md`](../../AGENTS.md) against every tracked redirect file. [PR #3](https://github.com/wangrui2025/wangrui2025.github.io/pull/3) is a plan to add a small repository-owned gate; treat it as pending until implemented, run on a real candidate and made required by the live ruleset. The redirect files and Pages settings, not this document, determine what is served.
