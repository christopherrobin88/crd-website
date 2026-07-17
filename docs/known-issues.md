# Known Issues

Tracked bugs and asset problems for the CRD portfolio site. Update this file directly when an issue is fixed or a new one is confirmed — don't let it drift from actual repo state. See `CLAUDE.md` Section 4, Step 1 for the audit discipline this file depends on.

Each entry below was verified against the live codebase (render-checked via local preview, not just read from source) on the date noted. If you're picking this up later, re-verify rather than trusting the "confirmed" status blindly — the file it describes may have changed since.

**Last verified:** 17 July 2026, against `artifacts/portfolio/` (production-refinement pass).

---

## Open issues

### 1. Leisure Boating asset is a 3D mockup render, not a flat file
**Status: confirmed, still broken — deliberately accepted for now.**

The active cover (`src/assets/images/leisure-boating/cover-01.png`, historically curated from the staging source drop) is still a glossy, angled 3D mockup of the magazine cover on a grey studio background, with dead space and perspective distortion baked in — same defect as the old `leisure-boating-cover-01.jpg`, just resourced from the new asset drop rather than fixed. Its two `Spread_01`/`Spread_02` files are confirmed mockup renders too (not real page exports), and per Christopher's direction (2026-07-03) render as independent pages rather than being forced through `DoubleSpread`.

Christopher explicitly chose to proceed with the mockup rather than block on sourcing a flat file — still needs the real flat front-cover file eventually, sourced from Drive.

---

## Resolved

### Systemic nav-bar / hero-image overlap on project detail pages
**Resolved by 17 July 2026** (verified during the production-refinement pass; the fix itself landed in an earlier workstream).

The `ProjectDetail.tsx` fixed nav now carries a parchment scrim (`bg-crd-parchment/85`), `backdrop-blur-md` and a bottom hairline, so the hero art and scrolling title pass cleanly beneath it. Verified in the rendered dev build on `/project/kruger-magazine` at 1280×800: computed style shows the 85% background and 12px backdrop blur while scrolled into the hero. The 9 July quarantine on this bug is lifted — the production-refinement brief explicitly scoped `ProjectDetail.tsx` changes (heading hierarchy, prev/next navigation, enquiry CTA, layout variants), all of which landed without regressing the nav.

### Homepage hero became pixelated and drifted from the approved artwork
**Superseded 14 July 2026** (Christopher supplied a replacement SVG hero asset).

The previous raster hero has been replaced by
`src/assets/images/web_hero_laptop.svg`, supplied by Christopher. `HeroLaptop`
now uses the SVG for both the primary image and animated reveal overlay, and the
prebuild guard checks that the asset exists and remains wired into the component.

### Responsive WebP sources were skipped in production
**Resolved 13 July 2026** (production image hotfix).

`Picture.tsx` passed vite-imagetools source keys such as `webp` directly to the
HTML `type` attribute. Browsers require the full MIME type, `image/webp`, so
they skipped the valid WebP source and requested the JPEG fallback. Cloudflare
served the SPA fallback document for those JPEG URLs, which left the homepage
cover frames blank. The shared component now normalises source keys to valid
image MIME types. The production build emits `type="image/webp"` for the
Kruger, Behelm and Boutique Essentials covers.

### Playboy SA hero image was an interior page, not the cover
**Resolved 3 July 2026** (content-flow system, Phase 5).

`coverImage` now comes from the reviewed `playboy-south-africa.json` manifest (`2015_PlayboySouthAfrica_March2015_EditorialDesign_Cover_01.jpg`) — a genuine flat magazine cover, confirmed visually. Note the manifest currently only has a cover for the March 2015 issue; April 2015 (also in scope per Christopher, 2026-07-03) has no cover asset yet — add one when available.

Re-verified 9 July 2026 (homepage Phase 1 extension): after the Phase 2 asset restructure the same file lives at `src/assets/images/playboy/march-2015-cover-01.jpg` (byte-identical to the Drive original, checked by MD5) and remains the manifest cover. The new homepage featured-work card renders this cover via the same pipeline; no interior page is referenced as a Playboy hero anywhere.

### Kruger Magazine source files were merged double-page spreads, and no DoubleSpread component existed
**Resolved 3 July 2026** (content-flow system, Phases 4–5).

The source asset drop contained Kruger Issue 29 pre-split into individual `Spread01`–`Spread10` `PageL`/`PageR` files (not merged DPS exports) — the split-export problem was resolved upstream of this codebase. `DoubleSpread` now exists (`src/components/DoubleSpread.tsx`), composites left/right pages at render time per the standing rule below, and is wired in via `ProjectContentFlow`. Verified visually: Kruger's spreads render as continuous two-page images, mobile stacking works.

### Kruger Magazine cover was from a different issue than the interior pages
**Resolved 3 July 2026** (content-flow system, Phase 5).

`coverImage` now comes from `2024_KrugerMagazine_Issue29_EditorialDesign_Cover_01.jpg` — the same Issue 29 as the interior spreads, both sourced from the same reviewed manifest. No more Issue 29/32 mismatch.

---

## Investigated, not a bug

### "Selected Work" intro line reported as clipped
**Investigated 9 July 2026** — not a real issue, no code change made.

An external AI-generated design review of a stitched full-page screenshot flagged the homepage "Selected Work" section intro line as having its top half sliced off, implying a CSS overflow/clipping bug. Investigated and traced to a screenshot-capture artifact (a stitching seam in the reviewer's own capture tool), not a rendering issue in the site. Re-verified directly in the live dev build at desktop width during the landing-page diagram/copy workstream — the line renders whole. Logged here so it doesn't get re-chased in a future session; if genuine clipping shows up on this element later, treat it as a new finding, not a recurrence of this one.

---

## Standing rule

`DoubleSpread` compositing happens in code at render time, always — never as pre-merged flat files. This was tried once, reversed, and should not recur. `DoubleSpread` (`src/components/DoubleSpread.tsx`) now exists, with per-publication aspect ratios (measured from real sample page dimensions, not guessed) and a mobile-stacking fallback, and is used by Uncut, Kruger, Playboy SA, and Checkers via `ProjectContentFlow`.
