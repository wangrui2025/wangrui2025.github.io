# Why this gateway stays small

## Development and validation

The change surface is a handful of static HTML redirect files. A reviewer checks that each known route goes directly to the matching canonical route, the fallback goes to the canonical homepage, and no file redirects through another compatibility gateway. [`AGENTS.md`](../../AGENTS.md) owns the present review checklist; the HTML owns the behavior. This is different from building or testing the private Astro homepage.

The proposed [redirect-integrity plan](https://github.com/wangrui2025/wangrui2025.github.io/pull/3) would turn the deterministic checks into one local command and a small PR gate. It remains a proposal while that PR contains only a plan and no workflow or ruleset. Future implementation should validate the same route and privacy contract in a clean checkout before making a check required. A green badge cannot be inferred from this plan.

## Hosting choice and failure diagnosis

GitHub Pages already serves this public, static compatibility address from the repository. It needs no site framework, scheduled job, application server or extra build provider. Cloudflare Pages owns the real homepage through its own source repository. A gateway change should not change that site's production settings, DNS or private code. The [shared CI standard](https://github.com/mykcs/.codex/blob/main/engineering/CI_STANDARD.md) applies if a future gate or provider migration is considered.

If an old link fails, first distinguish the redirect HTML/path from GitHub Pages publication and the canonical site's availability. Check the live Pages source/status and the target site's live response before editing redirects. A future CI failure should be classified by whether its runner started and which validation step failed. Only change provider authority after proving the replacement on a real candidate with a rollback path.
