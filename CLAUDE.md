# CLAUDE.md: Christopher Robin Design Portfolio Site

Project instructions for Claude Code sessions on the Christopher Robin Design portfolio site. Read this file in full before touching the repo.

---

## Project instruction reference

Claude Project "CRD Website" governs session behaviour, tone, working assumptions and brief writing. This file governs codebase architecture and implementation conventions. If the two ever conflict, this file wins for code-related decisions and the Claude Project instructions win for process and communication style.

---

## 1. Project overview and scope

**What this is:** A portfolio website for Christopher Robin Design, a Cape Town-based design studio. Christopher is a Senior Art Director and Creative Director with approximately 17 years' experience. The site serves two purposes simultaneously:

1. Positions Christopher Robin Design as a studio available for client and agency work.
2. Showcases Christopher's personal credentials for employment consideration.

Both audiences are served by the same content. There is no separate "hire me" versus "hire the studio" split. The site leads with work, not biography.

**Canonical production domain:** `https://www.christopherrobindesign.com`

This is the primary public domain as of 10 July 2026. All canonical tags, Open Graph URLs, sitemap entries, robots references, documentation and implementation briefs should use the `www.christopherrobindesign.com` domain unless Christopher explicitly changes the decision.

`christopherrobin.design` may remain available as a secondary domain, test domain or redirect target, but it is no longer the canonical public domain.

**Live project scope (verified against `src/data/projects.ts`, 17 July 2026):**

| Project | Client / publisher | Layout variant | Notes |
|---|---|---|---|
| Kruger Magazine | MLP Media | editorial | Issue 29. Spread handling documented in `docs/known-issues.md`. |
| Behelm | Behelm Consulting | identity | Identity system, presentation boards. |
| Checkers Retail Campaigns | Ninety9Cents, Cape Town | campaign | Retail marketing. |
| Playboy South Africa | Chapel Lane Media | editorial | March 2015 cover confirmed genuine; April 2015 cover asset still missing. |
| Boutique Essentials | Boutique Essentials, Cape Town | identity | Packaging and label system. |
| AgriProbe | MLP Media | editorial | Re-scoped into launch after the original five-project table. |
| UNCUT Magazine | LoveLife | editorial | Real commissioned editorial work, not spec. Credit LoveLife as client in copy. |
| Real Estate Investor | SA Real Estate Investor Magazine | editorial | Re-scoped into launch after the original five-project table. |
| Leisure Boating Magazine | Caravan Publications | editorial | Asset is still a 3D mockup render. Flat cover still desirable. |
| AIOS | Self-initiated | identity | Conceptual systems-design work, presented as process boards. |

**Scope history note:** CRD as a studio-identity project was removed from the launch `/work` grid and detail route (2026-07-04). Do not reintroduce it without a fresh explicit decision from Christopher. AgriProbe and Real Estate Investor, originally deferred, were later added along with Behelm, Boutique Essentials and AIOS.

**Still deferred unless explicitly re-scoped:** CaravanSA, the 2010 print advertising cluster, KWV and any experimental tools.

---

## 2. Tech stack and environment

Verify this section against the actual repo before relying on it.

- **Repo layout:** pnpm workspace monorepo. The site lives in `artifacts/portfolio/`, package `@workspace/portfolio`.
- **Framework:** React 19 and Vite.
- **Routing:** wouter. Do not assume TanStack Start unless the actual package files change.
- **Styling:** Tailwind CSS v4.
- **Animation:** Framer Motion. GSAP may appear in project history or future briefs, but confirm current usage before making implementation claims.
- **Image pipeline:** vite-imagetools, WebP with JPEG fallback.
- **Typography:** Playfair Display for headlines, DM Sans for body and UI.
- **Colour system:** forest blue-green, parchment, moss green and muted gold. Confirm current tokens before changing colours.
- **Hosting and deploy:** Cloudflare, auto-deploy from `main`.
- **Source control:** GitHub repo `christopherrobin88/portfolio-showcase`.
- **Previous platforms:** Wix and Replit are deprecated. Do not reintroduce platform-specific tooling from either.
- **Package manager:** pnpm only. The workspace root rejects npm and yarn.

Known file locations, relative to `artifacts/portfolio/`:

- `src/data/projects.ts`: project data, image references and spread pairing.
- `src/pages/ProjectDetail.tsx`: case study page.
- `src/components/Navigation.tsx`: shared site nav.
- `src/components/SiteBackground.tsx`: fixed composited brand-background layer.
- `src/assets/images/`: static image assets.
- `public/logos/`: CRD logo files.
- `index.html`: metadata, canonical URL and social cards.
- `public/robots.txt`: robots policy and sitemap reference.
- `public/sitemap.xml`: canonical sitemap.

---

## 3. Core development principles

- **Verify before claiming.** Never say something is fixed, live or confirmed unless you checked it in the current session.
- **Source of truth first.** Read the relevant docs before implementation. Do not work from chat memory alone.
- **Surface conflicts.** If current files, old briefs, Drive assets or project memory disagree, stop and flag the conflict.
- **Small, reviewable phases.** Keep changes scoped. Do not bundle unrelated fixes.
- **Feature branches only.** Do not recommend direct commits to `main`.
- **No stale platform assumptions.** Wix and Replit are historical. Cloudflare plus GitHub is the active production pipeline.
- **No hidden internal systems in public copy.** Do not expose APIs, automation tools, n8n, internal client systems or proprietary workflow details in copy, alt text, file names or metadata.
- **No public AI positioning by default.** Avoid mentioning AI in public-facing marketing copy unless Christopher explicitly asks for it.
- **No em dashes.** This applies to copy, comments, docs and commit messages.

---

## 4. Motion and visual rules

- Motion must remain restrained and editorial.
- Honour `prefers-reduced-motion`.
- No bounce or elastic easing.
- No sparkle effects.
- Avoid decorative effects that feel generic or template-like.
- Do not touch quarantined visual bugs unless the brief explicitly scopes them in.

Do not physically stitch page images into one merged spread. Spreads are composited in code.

### Asset rules


## 5. Known issue discipline

Tracked issues live in `docs/known-issues.md`. Update that file when an issue is fixed, reopened or newly verified.

Current standing notes:

- The project-detail nav and hero overlap bug has been quarantined in previous workstreams. Do not touch `ProjectDetail.tsx` for that issue unless explicitly briefed.
- Leisure Boating still needs a better flat cover asset when available.
- DoubleSpread compositing happens in code at render time. Do not pre-merge spreads as flat files.

---

## 6. Implementation workflow

Use this sequence for non-trivial tasks:

1. Audit the current state against the specific claim or brief.
2. Confirm scope against this file and relevant docs.
3. Plan the change.
4. Implement on a feature branch.
5. Verify the specific change.
6. Report what changed, what was not changed and what remains open.
7. Update documentation if the change affects durable project state.

---

## 7. Commands

Run these from `artifacts/portfolio/`, or prefix with `pnpm --filter @workspace/portfolio` from the repo root.

```bash
# Install from repo root
pnpm install

# Local dev server
pnpm dev

# Type check
pnpm typecheck

# Production build
pnpm build

# Preview production build locally
pnpm serve

# Git workflow
git push origin feat/<branch-name>
# Open a PR against main
# Cloudflare builds a PR preview
# Merge to main to deploy production
```

---

## 8. Standing instructions for Claude sessions

- British English.
- Direct tone.
- No filler.
- Do not explain basic concepts unless asked.
- Do not claim verification without checking.
- Do not silently resolve scope conflicts.
- Christopher is not a beginner. Get to the specific technical decision, trade-off or implementation step.
- Prefer flat originals over 3D mockups.
- Do not use interior pages as cover/hero images unless explicitly intended.
- `Cover` means actual front cover with masthead.
- `CoverStory` means an interior article about a cover subject.
- Leisure Boating's current 3D mockup limitation is known and accepted for now, but should be replaced when flat source files are available.

### Motion and brand texture

- Motion must stay restrained, editorial and performance-aware.
- Respect `prefers-reduced-motion`.
- GSAP, Lenis and Framer Motion are all present, so check the existing implementation before adding another animation pattern.
- Site background texture should come from approved assets or existing implementation, not generic AI-generated clipart.

### Scope discipline

When a request contradicts current repo state or a more recent explicit decision, surface the contradiction rather than silently following an older brief.

---

## 5. Known issues and status files

Use these documents before beginning implementation:

- `docs/scope.md` — current phase and status notes.
- `docs/known-issues.md` — confirmed bugs and resolved issues.
- `docs/adding-a-project.md` — content-flow/project addition process, if still present.

Do not copy old known issues back into the current plan without re-verifying them. Some older issues were later resolved by the content-flow migration.

Current important status notes:

- Site is live and in iteration, not pre-launch planning.
- Nav/hero overlap on project detail pages was still listed as open in `docs/known-issues.md`; re-check before touching `ProjectDetail.tsx`.
- Leisure Boating flat-cover replacement remains a content/asset task, not a layout bug.
- Homepage selected-work count may still need a strategic decision.

---

## 6. Working workflow for Claude Code

1. **Read current files first.** Start with this file, `docs/scope.md`, `docs/known-issues.md` and the directly relevant source files.
2. **Audit the claim.** State whether the issue is confirmed fixed, still broken, not built or unclear.
3. **Plan the change.** Keep the plan scoped to the actual issue.
4. **Implement.** Keep commits focused. Do not bundle unrelated fixes.
5. **Verify.** Run typecheck/build where relevant. For visual work, inspect the rendered result.
6. **Report plainly.** State what changed, what was verified and what remains open.

Use concise status reports. Christopher does not need beginner explanations.

---

## 7. Commands

From repo root:

```bash
pnpm install
pnpm --filter @workspace/portfolio dev
pnpm --filter @workspace/portfolio typecheck
pnpm --filter @workspace/portfolio build
pnpm --filter @workspace/portfolio serve
```

From `artifacts/portfolio/`:

```bash
pnpm dev
pnpm typecheck
pnpm build
pnpm serve
```

Deploy flow:

```bash
git checkout -b feat/<clear-branch-name>
# make scoped changes
git push origin feat/<clear-branch-name>
# open PR into main
# merge to main triggers Cloudflare production deploy
```

---

## 8. Standing communication instructions

- British English.
- Direct, practical tone.
- No filler, hype or generic praise.
- No em dashes.
- Do not claim something is fixed unless verified in the current session.
- Do not hide scope conflicts.
- Do not treat Christopher as a beginner.
  
