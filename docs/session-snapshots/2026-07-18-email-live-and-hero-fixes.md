# Handover — CRD Portfolio Site
**Date:** 18 July 2026 | **For:** next Claude session (or any engineer picking this up)

This snapshot supersedes `2026-07-17-handover.md` on repo identity and email status — both changed today. Read this one first; fall back to the 17 July file only for anything not mentioned here.

---

## Project in one paragraph

Christopher Robin Design is a Cape Town creative studio (Senior AD / CD, 17 years). The portfolio at `https://www.christopherrobindesign.com` serves both studio and employment audiences from the same content. React 19 / Vite SPA in a pnpm workspace monorepo (`artifacts/portfolio/`), deployed to a Cloudflare Worker (`crd-portfolio`, static assets + a thin Worker for the enquiry endpoint). Routing is wouter, styling Tailwind v4, animation Framer Motion (GSAP/Lenis also present, check before adding a new pattern). Deploy is auto on `main` via Cloudflare Workers Builds.

---

## Read these files first

1. `CLAUDE.md` — now corrected to name `crd-website` as the live repo (see below)
2. `docs/scope.md`
3. `docs/known-issues.md`
4. `docs/email-migration.md` — historical runbook; Phase A is now done, see status below

---

## Repo identity — this changed today, read carefully

- **Live repo:** `christopherrobin88/crd-website`, branch `main`. This is what Cloudflare's `crd-portfolio` Worker builds from.
- **Deprecated repo:** `christopherrobin88/portfolio-showcase`. Was the connected repo until today; disconnected from Cloudflare and now orphaned. Do not push to it, branch from it, or trust docs that still reference it as current.
- CLAUDE.md has been updated to reflect this. If you find other docs (including older session snapshots) referencing `portfolio-showcase` as live, that reference is stale.

---

## Email migration — Phase A and DMARC are DONE, not just planned

Contrary to the 17 July handover, the enquiry email backend is live and verified, not pending:

- Cloudflare Email Routing is **enabled** on `christopherrobindesign.com`.
- Destination address `chrisgara@gmail.com` is added and verified.
- Routing rules live: `info@christopherrobindesign.com` and `christopher@christopherrobindesign.com` both forward to `chrisgara@gmail.com`.
- MX cut over from Wix/Google to Cloudflare (5 old Google MX records deleted, Cloudflare's 3 MX + DKIM TXT added).
- SPF record **merged** (not replaced): `v=spf1 include:_spf.google.com include:_spf.mx.cloudflare.net ~all` — keeps Google-side sending authenticated too.
- DMARC added: `_dmarc.christopherrobindesign.com` → `v=DMARC1; p=none; rua=mailto:chrisgara@gmail.com` (monitor-only, no enforcement).
- End-to-end verified: manual test emails to both addresses arrived (though see Known Issue below), and a live contact-form submission was confirmed delivered to `chrisgara@gmail.com` with correct fields and `replyTo`.
- `CONTACT_EMAIL` in `src/lib/site.ts` changed from `christopher@` to `info@christopherrobindesign.com` — this is the single source used sitewide for display/mailto links.
- The mailto fallback in `Contact.tsx` was **kept deliberately** (not removed) — it now exists purely as a genuine-error fallback (rate limit, transient Worker failure), not as a "backend unverified" placeholder. Copy was updated accordingly. Do not remove it without a specific reason; Christopher was asked and chose to keep it.

**Still open, owner action:** Christopher pays ~R400/month for Google Workspace mailboxes via Wix for `@christopherrobindesign.com`. That's now redundant for receiving mail (Cloudflare Email Routing → his personal Gmail replaces it), but he has NOT yet cancelled it. He was told to run a Google Takeout export of the Workspace mailbox first (mbox format) and confirm it's safely saved before cancelling. Status of that export/cancellation is unknown — ask him.

**Do not** re-run the MX cutover steps or touch Email Routing settings without checking current state first (`Cloudflare dashboard → Email Routing → christopherrobindesign.com`) — this is live production mail, not a draft.

---

## Hero heading — word-break bug, two fix attempts, believed resolved

`artifacts/portfolio/src/pages/Landing.tsx` + `.hero-title` in `index.css`.

Sequence of what happened, in case the bug resurfaces:

1. Original bug: "experience." split mid-word (`experie` / `nce.`) on mobile. Root cause: `.hero-title` font-size used `clamp(3.5rem, 8vw, 7rem)` with an 8vw floor too large for narrow phones.
2. First fix: added a `max-width: 640px` media query with a smaller clamp. Verified fixed on phone width, but the *same bug reappeared* at tablet/desktop widths ("experie" / "nce." again, this time at ~1200px+ viewports).
3. Root cause #2, found by computing actual column width: past the `md:` breakpoint (768px) the hero switches to a two-column grid (`md:grid-cols-12`, headline in `md:col-span-6`), so the headline column caps around 580px regardless of how wide the browser window gets (the outer container is `max-w-7xl`). The original 7rem ceiling (and even a later 5.5rem attempt) was still too large for that ~580px column at very wide/high-DPI screens, where the vw-based clamp had already hit its ceiling. Fixed by lowering the desktop clamp ceiling to `4.5rem` with an explicit computed safety margin (~460px word width against ~580px column).
4. **Belt-and-suspenders addition:** `.hero-title` now also explicitly sets `overflow-wrap: normal; word-break: normal;`, overriding the global `h1–h6` rule (which was `overflow-wrap: anywhere` — also fixed to `break-word`, the safer default for headings generally). This means even if the sizing math is ever wrong again, the worst case is a whole word wrapping to the next line, never a character-level split. Christopher was explicit that a mid-word break is never acceptable, treat this as a hard constraint, not just a nice-to-have, if touching this CSS again.

Current values as of this snapshot (`index.css`, search for `.hero-title`):
- `≤640px`: `clamp(2.5rem, 10vw, 3.25rem)`
- `≥641px`: `clamp(2.75rem, 3.6vw, 4.5rem)`

**Not yet re-verified after the final 4.5rem change** — worth checking at phone, ~800px, and a genuinely wide monitor before considering this fully closed.

---

## Secondary heading rebalanced

`PositioningSection` in `artifacts/portfolio/src/components/home/HomeSections.tsx` ("Good design is half the job...") was sized `text-4xl md:text-6xl` — after the hero shrink above, this secondary heading started reading *larger* than the primary H1 at plenty of widths, a hierarchy inversion. Reduced to `text-3xl md:text-5xl`. Not deeply verified beyond one screenshot; worth a visual pass if revisiting hero sizing again, the two are now coupled.

---

## Known issue — NOT fixed, deliberately left alone

**Awkward blank gaps between homepage sections on mobile Safari (real device, not reproducible in desktop Chrome).**

Christopher saw large blank vertical gaps between the hero illustration and the next section heading, and between other section boundaries, on his iPhone (Safari), on both `christopherrobin.design` and (presumably) `www.christopherrobindesign.com` — confirmed both domains serve byte-identical current output, so it's not a caching/stale-domain issue.

Investigated and ruled out:
- `min-h-[100dvh]` theory — this class is on the whole-page outer wrapper (header + hero + all sections + footer), not scoped to the hero, so it cannot be inserting space specifically after the hero. Ruled out by direct measurement.
- Simple padding math (`py-24` etc.) — accounts for at most ~192px of intentional gap between adjacent sections, nowhere near what was visible in the screenshots.
- Stale/cached build on the secondary domain — ruled out, both domains return identical DOM/layout.

Leading (unverified) hypothesis: `index.css` has a scroll-driven reveal animation on every `main > section` using `animation-timeline: view()` (a newer CSS feature), sections start `opacity: 0` and fade/rise in as scrolled into view. This has known interaction quirks with iOS Safari's dynamic toolbar (the address bar that shrinks/grows during scroll), which can throw off the scroll-timeline's viewport calculations and leave a section invisible (`opacity: 0`) for a stretch — which would read visually as a blank gap, when the content is actually a rendered-but-invisible section waiting for its animation to trigger correctly.

This could not be verified from this session (no real iOS Safari access; desktop Chrome doesn't replicate Safari's dynamic-viewport-height scroll behaviour, and Chrome's own `animation-timeline: view()` support differs). **Christopher was offered three options (remove the effect entirely, disable on mobile only, or investigate further) and explicitly chose to leave it alone for now.** Do not "fix" this preemptively without him raising it again — he may want to test on his own device via Safari's Web Inspector (Settings → Safari → Advanced → Web Inspector, connect to a Mac) first.

If picking this up: the animation lives in `index.css` under the comment `/* ---- Native scroll-driven reveals ... ---- */`, scoped via `@supports (animation-timeline: view())` to `main > section` and `.case-study-card`. It's explicitly a progressive-enhancement effect (browsers without support just render fully visible, no JS fallback needed), so removing it is low-risk if it comes to that.

---

## What NOT to do

- Do not touch Cloudflare Email Routing / MX / DNS records without checking current state first — mail is live now, not a draft in progress.
- Do not remove the `Contact.tsx` mailto fallback — Christopher chose to keep it as a genuine-error safety net, not a placeholder.
- Do not "fix" the mobile section-gap issue without Christopher raising it — he explicitly deferred it.
- Do not push to or branch from `portfolio-showcase` — it's disconnected and orphaned.
- Do not reintroduce a mid-word break in `.hero-title` — treat `overflow-wrap: normal` there as a hard constraint per Christopher's explicit instruction.
- No em dashes anywhere (code, copy, comments, commit messages, docs). British English throughout.

---

## Quick-reference commands

```bash
# From artifacts/portfolio/
pnpm dev
pnpm typecheck
pnpm build
pnpm serve

# From repo root
pnpm --filter @workspace/portfolio dev
```

Deploy: push to `main` on `christopherrobin88/crd-website`. Cloudflare Workers Builds runs automatically.
