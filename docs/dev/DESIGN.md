# Why this gateway stays small

## Development and validation

The change surface is a handful of static HTML redirect files. A reviewer checks that each known route goes directly to the matching canonical route, the fallback goes to the canonical homepage, and no file redirects through another compatibility gateway. [`AGENTS.md`](../../AGENTS.md) owns the present review checklist; the HTML owns the behavior. This is different from building or testing the private Astro homepage.

The repository-owned [`python3 .github/scripts/validate_redirects.py`](../../.github/scripts/validate_redirects.py) command checks the six tracked redirect routes, and `.github/workflows/ci.yml` runs it for pull requests and `main` pushes. The strict `main` ruleset requires the exact-head `Repository validation` status from GitHub Actions App 15368. [`LATEST.md`](LATEST.md) owns the current mode and gate summary. These checks validate the public gateway contract; they do not build or deploy the separate homepage.

## Hosting choice and failure diagnosis

GitHub Pages already serves this public, static compatibility address from the repository. It needs no site framework, scheduled job, application server or extra build provider. Cloudflare Pages owns the real homepage through its own source repository. A gateway change should not change that site's production settings, DNS or private code. The shared [CI standard](https://github.com/mykcs/.agents/blob/main/docs/agents/CI_STANDARD.md) governs this repository's validation semantics.

If an old link fails, first distinguish the redirect HTML/path from GitHub Pages publication and the canonical site's availability. Check the live Pages source/status and the target site's live response before editing redirects. A future CI failure should be classified by whether its runner started and which validation step failed. Only change provider authority after proving the replacement on a real candidate with a rollback path.
