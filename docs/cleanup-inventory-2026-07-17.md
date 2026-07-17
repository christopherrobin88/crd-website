# Repository cleanup inventory — 17 July 2026

Deletion inventory for the production-refinement pass (`feat/production-refinement`). Each entry records why the item was judged unused and how that was verified. Verification method throughout: exhaustive `grep` over `src/`, `scripts/`, `index.html`, `public/` and build configuration for static imports, dynamic imports, CSS references, convention-based paths and public URLs, followed by a clean `pnpm typecheck` and a full production build (`pnpm build`, all 15 routes prerendered) after removal.

## Removed

### `src/components/ui/` (56 shadcn components)
Why: scaffolding from the original Replit template. The only consumer outside the directory itself was `not-found.tsx` (Card), which was restyled on-brand at the same time — the old 404 carried developer-facing copy ("Did you forget to add the page to the router?") and off-palette grey/red styling in production.
Verified: `grep -rl '@/components/ui/' src` returned only `not-found.tsx` and `use-toast.ts` (both handled below); typecheck and build pass after removal.

### `src/hooks/use-toast.ts`, `src/hooks/use-mobile.tsx`, `src/lib/utils.ts`
Why: consumed only by the removed ui kit (`toaster`/`sonner`, `sidebar`, and the `cn()` helper respectively).
Verified: grep for `use-toast`, `use-mobile`, `@/lib/utils`, `clsx`, `twMerge`, `cn(` outside `components/ui/` returned nothing (the `use-mobile-menu-a11y` hook is a different, live module).

### Superseded hero rasters
`web_hero_laptop.png`, `web_hero_laptop.webp`, `web_hero_laptop_cropped.png`, `web_hero_laptop_cropped.webp`
Why: the pre-14-July raster hero, superseded when Christopher supplied `web_hero_laptop.svg` (see `docs/known-issues.md`, resolved entry). Nothing references them; they remain recoverable from git history.
Verified: grep for each filename across src/scripts/index.html/public returned zero; `validate-hero.ts` checks only the SVG.
Kept deliberately: `web_hero_laptop_source.png` (original source artwork).

### Replit vite plugins and dead alias (`vite.config.ts`)
Why: `@replit/vite-plugin-cartographer`, `-dev-banner`, `-runtime-error-modal` ran only when `REPL_ID` was set; Replit is a deprecated platform per CLAUDE.md. The `@assets` alias pointed at `attached_assets/` with zero imports.
Verified: grep for `@assets` in src returned zero; plugins were conditional dev-only code.

### Unused GSAP plugin registrations (`src/lib/motion.ts`)
Why: `ScrollSmoother`, `DrawSVGPlugin`, `MotionPathPlugin` were registered and re-exported but never imported anywhere. `ScrollTrigger` stays (HeroLaptop parallax, Lenis sync).
Verified: grep for each plugin name returned only `motion.ts` itself.

### 48 npm dependencies (`artifacts/portfolio/package.json`)
27 `@radix-ui/*` packages (all but `react-dialog`, kept for `ProjectLightbox`), `react-hook-form`, `@hookform/resolvers`, `cmdk`, `embla-carousel-react`, `input-otp`, `react-day-picker`, `react-icons`, `react-resizable-panels`, `recharts`, `sonner`, `vaul`, `next-themes`, `date-fns`, `class-variance-authority`, `clsx`, `tailwind-merge`, `@tanstack/react-query`, `zod`, `@tailwindcss/typography` (with its `@plugin` line in `index.css` — no `prose` classes exist), and the three `@replit/*` plugins.
Why: consumed only by the removed ui kit, or by nothing at all (`zod`, `react-query`, `embla` had zero imports anywhere).
Verified: per-package grep across src/scripts/css/html; `pnpm install` lockfile refresh; typecheck and full build pass.
Kept deliberately: `tw-animate-css` (ProjectLightbox uses `animate-in/out` classes), `sharp` (used by `scripts/extract-foliage.ts`), `@radix-ui/react-dialog`, and everything else with live imports.

### `public/sitemap.xml` (static)
Why: replaced by build-time generation in `scripts/prerender.ts` from the same route list as the prerendered pages, so it now includes all ten `/project/*` URLs and cannot drift.
Verified: production build emits `dist/public/sitemap.xml` with 15 URLs.

### Staging source drop
`src/assets/new images/` (143 MB, 173 files) was removed from the repository after owner confirmation that this cleanup should happen offline before publishing. These files were staging/source artwork only, already curated into `src/assets/images/` where needed, and remain recoverable from Drive/local backup. Future raw drops should be local-only and are now ignored by Git.

### Root Replit metadata
`.replit`, `.replitignore` and `replit.md` were removed after owner confirmation that the cleaned folder is the source for GitHub publishing. Replit is deprecated for this project and Cloudflare/GitHub is the active production path.

### Retired archive and source uploads
`archive/` and `attached_assets/` were removed during the offline cleanup before GitHub publishing. They contained retired Replit/API scaffold and superseded source uploads that are not referenced by the live site. Authentic source material should live in Drive, not in the website repository.

### Local agent metadata
`.agents/` and `.claude/` were removed from the repository. They are local tooling metadata, not website source.

## Kept and flagged for owner review

- **`crd_background_top.png`, `crd_background_bottom.png`, `web_background.png`, `web_hero_laptop_source.png`** — unreferenced, but they are the source artwork behind the shipped `web_background.webp` and hero SVG. Kept as source artwork.
- **`public/opengraph.jpg`** — unreferenced in the repo (metadata uses `og-image.png`), but the URL may be cached by social platforms from earlier shares. Kept; safe to delete after confirming no external links depend on it.
- **`scripts/src/hello.ts`** — workspace scaffold smoke-test wired to the `hello` npm script; kept as the package's minimal example.

## Other hygiene

- `.gitignore` now covers `.pnpm-store/`, `.claude/`, `.agents/`, raw source drops and retired archive folders.
- Case-sensitivity check: `git ls-files` lowercased and deduplicated found no collisions, so Linux hosting will not break on case.
