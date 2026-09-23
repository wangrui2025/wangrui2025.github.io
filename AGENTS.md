# Repository Agent instructions

This repository is the public, redirect-only compatibility gateway for the historical academic homepage URL `https://wangrui2025.github.io`. It is **not** the complete personal-homepage source repository.

## Product wish authority

Before changing redirect behavior, public copy, route ownership, or the role of this repository, read `docs/wish/LATEST.md`.

- For route topology, identity/hosting boundaries, or product-direction changes, also read `docs/wish/DESIGN.md`.
- Do not read `docs/wish/ARCHIVE.md` by default; use it only for historical intent.
- Shared Wish lifecycle/update rules are owned by https://github.com/mykcs/.codex/blob/main/website-governance/WISH_PROTOCOL.md.
- Current owner instructions, executable truth, privacy/security boundaries, and live hosting state outrank the Wish.

## Repository boundary

- Keep this repository small and public-safe.
- Do not copy the complete Astro homepage, private DEV tooling, internal documents, credentials, or unpublished/private assets here.
- The full homepage source of truth lives in the private development repository `mykcs/personal-homepage`.
- The current canonical/indexable homepage is `https://wangrui92.pages.dev`.
- This gateway should redirect directly to the canonical serving host; do not route through `https://mykcs.github.io`.
- Known homepage routes may preserve their matching path.
- Project Pages sites such as `/osa/`, `/GDKVM/`, and `/sprites-gallery/` remain owned by their own repositories.

## Validation

For redirect changes, inspect every tracked HTML redirect file and verify:

- no legacy `mykcs.github.io` target remains;
- root points to the canonical root;
- known language/CV routes preserve the intended path;
- fallback does not expose or duplicate private site source.
