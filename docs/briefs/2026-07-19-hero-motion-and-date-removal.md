# Brief: Animated hero illustration and removal of project dates

Paste everything below this line into a Claude Code (Sonnet) session at the repo root.

---

Read `CLAUDE.md`, `docs/scope.md` and `docs/known-issues.md` before starting. Work on a feature branch, for example `feat/hero-motion-and-date-removal`. Do not commit to `main`. British English, no em dashes, in code comments and commit messages included.

This brief has two independent parts. Implement them as two separate commits on the same branch.

## Part 1: Replace the static hero image with the animated version

### Current state

- `artifacts/portfolio/src/components/HeroLaptop.tsx` renders the static asset `@/assets/images/web_hero_laptop.svg` twice: a base `<img>` plus an overlay `<img>` that GSAP reveals with a radial mask on load.
- It also runs three GSAP behaviours: an idle float loop, scroll parallax, and cursor tilt, all gated behind `prefers-reduced-motion: no-preference` via `gsap.matchMedia()`.
- The component is used once, in `src/pages/Landing.tsx`.

### New asset

`docs/briefs/assets/laptop_motion_preview-v3.html` contains the approved animation: a single self-contained inline SVG (viewBox `0 0 576 687.6`) in which the botanical linework draws itself out of the laptop using CSS keyframe animations on mask paths. It already:

- honours `prefers-reduced-motion` internally (falls back to the fully drawn static image),
- uses the brand moss green fill `rgb(107, 122, 61)`,
- needs no JavaScript to play.

Ignore the surrounding HTML, body styling and any replay button in that file. Only the `<svg>` element is the deliverable.

### Required changes

1. Extract the `<svg>` from the preview file into a React component, for example `src/components/HeroLaptopArt.tsx`, converting attributes to JSX as needed. Keep the SVG's internal `<style>` block intact (a `<style>` tag inside SVG is valid JSX inside the svg element; use a template literal if needed). Preserve the `role="img"` and `aria-label`. Scope or rename the mask id and class names if there is any risk of collision, and note the mask id is referenced internally as `url(#...)` so keep them in sync.
2. In `HeroLaptop.tsx`:
   - Replace the two `<img>` elements with the new inline SVG component.
   - Remove the GSAP radial-mask intro entirely (the `overlay` ref, the `intro` tween and the mask-image styles). The SVG now owns the intro.
   - Keep the idle float, scroll parallax and cursor tilt exactly as they are, wrapping the new SVG. Adjust the idle float delay if needed so it starts after the SVG draw-on completes (the last animation delays end around 2.4s, so a delay of roughly 2.75s is sensible).
3. Do not delete `web_hero_laptop.svg` from assets in this pass. Leave it in place and note it as a follow-up cleanup once the new hero is verified in production.
4. Sizing: the new SVG has a slightly different aspect ratio (576 x 687.6) from the old asset (1148 x 1370, effectively the same ratio). Confirm the hero column in `Landing.tsx` still lays out correctly at mobile, tablet and desktop widths. Do not change the `Landing.tsx` sizing classes unless the layout visibly breaks.
5. Motion rules from `CLAUDE.md` apply: no bounce or elastic easing, nothing added beyond what is in the asset, `prefers-reduced-motion` must show the complete static illustration with no drawing animation and no GSAP motion.

### Verification for Part 1

- `pnpm --filter @workspace/portfolio typecheck` and `build` pass.
- In the dev server: animation plays once on load, then idle float, parallax and cursor tilt behave as before.
- With reduced motion enabled in the OS or devtools: static fully drawn illustration, no motion of any kind.
- Check there is no flash of unstyled or unmasked artwork on first paint.

## Part 2: Remove all dates from project titles and descriptions

### Current state

Dates only appear via the `year` field on projects. Verified 19 July 2026:

- `src/data/projects.ts`: `year` on the `Project` type (line 19) and per-project values (`"2026"`, `"2023–2025"`, `"2015"`, `"2019–2020"`, several already empty).
- `src/components/Work.tsx` line 93: renders `{project.year} — {project.category}`.
- `src/pages/ProjectDetail.tsx` lines 110 and 157: renders `{project.publicationName} — {project.year}`.

No dates appear in project titles, descriptions, overviews or content JSON display strings, so no copy editing is required.

### Required changes

1. Remove the `year` field from the `Project` type and delete every `year:` line from the project objects in `projects.ts`.
2. In `Work.tsx`, render only `{project.category}` (remove the year and its separator).
3. In `ProjectDetail.tsx`, render only `{project.publicationName}` in both places (remove the year and its separator). Note the standing quarantine on the nav and hero overlap bug in this file: touch only these two text expressions, nothing else.
4. Leave untouched: the footer copyright year in `SiteFooter.tsx` and `Landing.tsx`, "seventeen years" in copy, "Issue 94" and issue numbers, and all date-stamped asset filenames.

### Verification for Part 2

- Typecheck and build pass.
- Grep the built copy paths (`Work.tsx`, `ProjectDetail.tsx`, `projects.ts`) for `year` and four-digit years to confirm nothing renders.
- Spot-check the work grid and two project detail pages (one that had a year, one that did not) in the dev server.

## Reporting

Finish with a plain report: what changed, what was verified, what remains open (including the `web_hero_laptop.svg` cleanup follow-up). Update `docs/known-issues.md` only if you find something new; do not reopen resolved issues.
