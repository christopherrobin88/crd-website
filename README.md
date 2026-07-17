# Christopher Robin Design Website

Portfolio website for Christopher Robin Design, a Cape Town-based design studio led by Christopher.

## Production

Canonical production domain:

`https://www.christopherrobindesign.com`

Secondary domains, including `christopherrobin.design`, may exist as redirects or test domains, but they are not canonical.

## Repository

`christopherrobin88/portfolio-showcase`

This repo is the source of truth for implementation, documentation and project state.

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
