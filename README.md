# Christopher Robin Design Website

Portfolio website for Christopher Robin Design, a Cape Town-based design studio led by Christopher.

## Production

Canonical production domain:

`https://christopherrobindesign.com`

Secondary domains, including `www.christopherrobindesign.com` and `christopherrobin.design`, may exist as redirects or test domains, but they are not canonical.

## Repository

`christopherrobin88/crd-website`

This repository is the source of truth for implementation, documentation and project state.

`christopherrobin88/portfolio-showcase` is deprecated and disconnected from the production deployment. Do not use it for new work.

## Stack

- pnpm workspace monorepo
- React 19
- Vite
- wouter
- Tailwind CSS 4
- Framer Motion
- Cloudflare deployment from `main`

The site package lives in:

`artifacts/portfolio/`

## Documentation

Read these before meaningful project work:

1. `CLAUDE.md`
2. `docs/scope.md`
3. `docs/known-issues.md`
4. `docs/decisions/`
5. `docs/briefs/`
6. `docs/crd-brand-bible.html` — Brand Bible v1.0, source of truth for colour, type and component rules
7. `docs/crd-editorial-engine.html` — prototype publication layout tool (not part of the production build)

## Working rules

- Use British English.
- Never use em dashes.
- Verify before claiming.
- Use feature branches.
- Do not commit directly to `main` unless explicitly instructed.
- Update documentation when durable project state changes.
- Do not expose internal tooling, APIs, automation systems or proprietary workflows in public copy.
- Do not reintroduce Wix, Replit or stale platform assumptions.

## Commands

Run from the repo root unless noted.

```bash
pnpm install
pnpm --filter @workspace/portfolio dev
pnpm --filter @workspace/portfolio typecheck
pnpm --filter @workspace/portfolio build
```

Or run from `artifacts/portfolio/`:

```bash
pnpm dev
pnpm typecheck
pnpm build
pnpm serve
```
