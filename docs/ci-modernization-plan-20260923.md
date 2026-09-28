# CI modernization plan — 2026-09-23

Status: **implementation in progress in PR #3**

Repository: `wangrui2025/wangrui2025.github.io`  
Integration branch: `main`

## Objective

Keep this public academic-account homepage intentionally tiny: validate only the redirect/gateway contract to `https://wangrui92.pages.dev/`, then protect `main` with one small repository-owned PR gate.

## Current state verified before this PR

- The repository is public and uses `main`.
- It currently has no GitHub Actions workflow and no repository ruleset.
- Its intended role is a stable academic-account entry point/redirect, not a second full website implementation.
- GitHub Pages currently publishes `main:/`; the six tracked HTML routes are the public gateway surface.
- `main` has no active repository ruleset or legacy branch-protection rule at implementation start.

## Local CI owner

- CI mode: `STANDARD_CI` (one deterministic Python standard-library validator and a GitHub Actions exact-head gate).
- Local command: `python3 .github/scripts/validate_redirects.py`.
- Provider authority: GitHub Actions check `Repository validation`, bound to GitHub Actions app ID `15368`.
- Active `main` ruleset: `CI rollout main protection` (ID `24135896`), strict required-check freshness, no bypass actors; requires PRs, `Repository validation`, deletion protection, and non-fast-forward protection.
- Scope: tracked gateway HTML only. The workflow has read-only repository permissions, checks out the event SHA, and does not deploy.
- Publication boundary: Pages remains the existing `main:/` publisher, and tracked `.nojekyll` means new repository files are part of its static output. This PR adds a workflow, validator, and plan document that will be retrievable from the Pages host after merge. Those files contain no secrets, but this extends public site content beyond the six gateway routes; the existing gateway publication scope does not itself authorize that extension. Keep merge pending until the user separately approves this public exposure, or revise the artifact layout under an approved approach. The six HTML route files remain unchanged.

## Implementation checklist

- [x] Open this plan-only PR before changing CI/provider behavior.
- [x] 1. Inspect the current redirect implementation and freeze the canonical destination and compatibility behavior.
- [x] 2. Add one tiny repository-owned redirect-integrity validation command; keep it independent from any hosting provider.
- [x] 3. Add a pinned GitHub Actions PR workflow named `Repository validation` that runs only the redirect-integrity checks.
- [x] 4. Create a `main` ruleset requiring PRs, app-bound `Repository validation`, deletion protection, and non-fast-forward protection.
- [ ] 5. Verify a clean PR and a main update without reintroducing a full site build/deployment stack.
- [ ] 6. Update this plan with exact check identity, ruleset evidence, and final verification.

## Acceptance criteria

- [ ] The redirect target `https://wangrui92.pages.dev/` cannot drift silently.
- [ ] A PR cannot merge without repository-owned redirect validation.
- [ ] No Astro/full-site CI, second content authority, or unnecessary hosting provider is introduced.
- [ ] The academic/public identity role of this repository remains unchanged.
- [ ] Every tracked HTML route is covered; redirects preserve query/hash and do not route through `mykcs.github.io`.
- [ ] User approval covers publication of new CI implementation and plan files through Pages, or the implementation is adjusted so they are not published.

## Rollout discipline

- Implement this plan in **this same PR**, one phase at a time, and check items only after fresh evidence exists.
- Refresh `main` immediately before ruleset changes and again before merge.
- Bind required checks to the exact provider/app when GitHub supports it.
- Keep deterministic correctness in repository-owned commands; workflow/provider configuration executes that authority.
- A local PASS is not hosted-CI proof. Exercise a clean hosted checkout before declaring completion.

## Non-goals

- No redesign of the academic site.
- No migration of `wangrui92.pages.dev`.
- No duplication of the real site source.
- No unrelated profile/content changes.
