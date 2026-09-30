# Agent documentation router

This repository is the public compatibility gateway for the historical academic-homepage URL. It is not the full personal-homepage source.

## Read order

1. [`AGENTS.md`](../../AGENTS.md) — public-safe boundary and redirect rules.
2. [`../wish/LATEST.md`](../wish/LATEST.md) — current gateway intent; add `DESIGN.md` for route/product-direction changes.
3. [`../dev/LATEST.md`](../dev/LATEST.md) — development/hosting direction; add `DESIGN.md` for provider changes.
4. Tracked redirect HTML and live GitHub Pages state — executable/live truth.

## Boundaries

- Private full homepage source: `mykcs/personal-homepage`.
- This repository owns only its compatibility redirect surface.
- Project Pages sub-sites remain owned by their own repositories.
- Wish/Dev archives are history-only.

Validate redirect changes against every tracked HTML redirect and refresh live Pages state before provider-side claims.

Shared lifecycle owners: [`WISH_PROTOCOL.md`](https://github.com/mykcs/.agents/blob/main/docs/agents/WISH_PROTOCOL.md) and [`DEV_PROTOCOL.md`](https://github.com/mykcs/.agents/blob/main/docs/agents/DEV_PROTOCOL.md).
