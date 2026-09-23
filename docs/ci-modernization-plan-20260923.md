# CI modernization plan — 2026-09-23

Status: **plan accepted for implementation; implementation pending**

Repository: `wangrui2025/wangrui2025.github.io`  
Integration branch: `main`

## Objective

Keep this public academic-account homepage intentionally tiny: validate only the redirect/gateway contract to `https://wangrui92.pages.dev/`, then protect `main` with one small repository-owned PR gate.

## Current state verified before this PR

- The repository is public and uses `main`.
- It currently has no GitHub Actions workflow and no repository ruleset.
- Its intended role is a stable academic-account entry point/redirect, not a second full website implementation.

## Implementation checklist

- [x] Open this plan-only PR before changing CI/provider behavior.
- [ ] 1. Inspect the current redirect implementation and freeze the canonical destination and compatibility behavior.
- [ ] 2. Add one tiny repository-owned redirect-integrity validation command; keep it independent from any hosting provider.
- [ ] 3. Add a pinned GitHub Actions PR workflow named `Repository validation` that runs only the redirect-integrity checks.
- [ ] 4. Create a `main` ruleset requiring PRs, app-bound `Repository validation`, deletion protection, and non-fast-forward protection.
- [ ] 5. Verify a clean PR and a main update without reintroducing a full site build/deployment stack.
- [ ] 6. Update this plan with exact check identity, ruleset evidence, and final verification.

## Acceptance criteria

- [ ] The redirect target `https://wangrui92.pages.dev/` cannot drift silently.
- [ ] A PR cannot merge without repository-owned redirect validation.
- [ ] No Astro/full-site CI, second content authority, or unnecessary hosting provider is introduced.
- [ ] The academic/public identity role of this repository remains unchanged.

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
