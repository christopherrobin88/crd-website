# Brief: site copy update, October 2026

Approved by Christopher on 15 October 2026. Apply exactly as written. Copy decisions are final; do not reword.

## Setup

1. `git fetch origin && git switch feat/sitewide-copy-rewrite && git pull`
2. Merge `origin/main` into the branch. On conflicts in copy, keep the branch wording, then apply this brief on top.
3. Work only in `artifacts/portfolio`. No layout, styling or dependency changes beyond the code fixes listed here.
4. Commit in logical groups. Open one PR to `main`. Do not merge it.

## House rules for every line you touch

- British English.
- No em dashes or en dashes used as dashes.
- No comma before "and", in lists or between clauses. Split into two sentences instead.
- Colons only to introduce lists. No parentheses in body copy.
- First person ("I") in all copy, including case studies. Replace "the studio" with "I" where it describes the work.
- Write "Christopher Robin Design" in full once in the opening copy of each main page. Never use "CRD" alone as the first mention.

## 1. Project data (`src/data/projects.ts`)

Card summaries (these also feed the meta descriptions):

- kruger-magazine: `Several years of issues for a specialist wildlife magazine, from layout and image correction to press-ready files.`
- checkers-retail: `High-volume campaign design for one of South Africa's largest grocery chains, built for tight, repeating deadlines without losing brand consistency.`
- playboy-south-africa: `Art direction for a national lifestyle magazine, giving a global brand a distinctly South African voice.`
- boutique-essentials: `Labels and packaging for a Cape Town supplier of guest amenities to boutique hotels, designed to sit quietly in a guest bathroom.`
- uncut-magazine: `Issue 94 of LoveLife's youth music and culture magazine, art-directed from cover to press-ready spreads.`
- real-estate-investor: `Covers and features for South Africa's property investment magazine, making finance-led content work on the newsstand.`
- leisure-boating: `Layout and a reusable visual system for a specialist boating magazine, making technical content clear and enjoyable to read.`
- behelm: `A logo system study for a private security consultancy: shield monogram, colour rules and applications.`
- aios: `Identity routes and dashboard design for a self-initiated workflow software concept. Process work, not a shipped product.`
- agriprobe: no change.

Body copy:

- Kruger, process: replace the image-correction sentence with `Image correction and colour grading were central. Contributor photography varied in quality and colour profile, so I retouched each frame in Photoshop for consistent ink density across coated and uncoated stock.` Replace `…platform-ready formats, and a pre-press pass checked…` with `…platform-ready formats. A final pre-press pass checked…`
- Behelm, process: `The mark is constructed on a 16-unit grid. Spine width, shield rise and watch line are fixed relationships, so it reproduces identically at any size. The system sets how the mark scales down to a 24px favicon, with the gold accent removed below 80px. It also includes reverse lockups for navy and paper grounds plus a stationery and digital-avatar set.` Keep the following "Usage rules…" sentence.
- Boutique Essentials, brief: `Boutique Essentials supplies guest amenities, including shampoo, conditioner and room sprays, to boutique hotels…` (rest unchanged).
- Boutique Essentials, process: `The label system runs across the range from a single layout. Product name, range descriptor and volume hold fixed positions, so new products drop in without redesign.` Keep the "finish" sentence.
- Checkers, brief: `…across print, digital and in-store. It called for creative judgement and production discipline under tight, repeating deadlines.`
- Playboy, process: first sentence becomes `I worked closely with the editorial team on each issue, matching the visual storytelling to the writing.`
- AgriProbe, brief: replace the second sentence with `Across several volumes I designed the covers, feature layouts and research articles, bringing a clear editorial standard to scientific and departmental content for specialists and the wider farming community.`
- AgriProbe, process: `…while holding the magazine's recognisable masthead system. Bilingual content was set with equal typographic care.`
- Real Estate Investor, brief: `…across multiple issues, including cover stories on Christo Wiese, Siya Kolisi and Trevor Noah. A confident, business-led visual identity kept financial content approachable.`
- AIOS, brief: `AIOS is a self-initiated concept for workflow software: one place that routes jobs, tracks approvals and keeps a shared record of every project. The brief was to take the systems behind my own production workflow and design them as a product: identity, application surfaces and the dashboard itself. These are conceptual renders shown as process work, not a shipped product.`
- AIOS: move it to the last position in the projects array / Work grid.

Outcomes (currently empty):

- boutique-essentials: `One label layout now covers the whole range, so new products are added without a redesign. The amber-and-olive finish reads as premium in guest bathrooms and in product photography.`
- agriprobe: `Seven issues delivered across several volumes, each with its own cover identity inside the established masthead system. Research written for specialists stayed readable for the wider farming community in both languages.`
- real-estate-investor: `Twelve editions with covers built around some of South Africa's best-known business and public figures, plus a Master Investor series with its own recognisable treatment. Data-heavy investment content became clear, structured reading.`

Voice pass: across all case studies switch "the studio" to "I" where it describes Christopher's work (Checkers, Playboy and Leisure Boating were in-house roles). List every changed sentence in the PR description.

## 2. Pages and components

- `components/Work.tsx` H1: `Selected work across print, brand and screen.`
- `components/Work.tsx` closing paragraph: `Christopher Robin Design makes publications, brands and websites for agencies, publishers and small businesses. Every job is seen through to finished files.`
- `components/PricingPackages.tsx`: `we'll shape the scope` becomes `I'll shape the scope`.
- `pages/Landing.tsx` approach paragraph: `I bring that discipline and years of print production to every publication, brand and site.`
- `pages/Contact.tsx` intro: `Christopher Robin Design makes websites, brands and publications for businesses. Agencies can also bring me in for senior creative support.`
- `pages/Contact.tsx` form footnote: `Your enquiry goes straight to the studio inbox. Nothing is stored on this site.`
- Keep the branch versions of: Contact H1, second paragraph, step 3, budget bands, Made by Mike status, all About page copy.
- Do not touch the honeypot "website" field.

## 3. Code fixes

- `lib/enquiry.ts` `enquiryTypeForProject`: change `category.includes("Systems")` to `category.includes("Systems Design")` so Leisure Boating ("Publication Design & Layout Systems") preselects Publication design.
- `pages/ProjectDetail.tsx`: give AIOS its own enquiry prompt, `Designing a production workflow or automation system?`, via a per-project override. Other identity projects keep the current prompt.

## 4. SEO (`src/lib/meta.ts` and prerender)

- Home description: `Website design, branding and editorial design in Cape Town. Seventeen years of magazine and brand work, now carried from page to screen.`
- About title: `Christopher Gara, Designer and Creative Director | Christopher Robin Design`
- About description: `Christopher Robin Design is a Cape Town studio led by Christopher Gara, designing publications, brands and websites for businesses and agencies.`
- Services description: `Websites from R18,000, brand identity from R15,000 and editorial design from R8,500. Fixed fees agreed before work starts, from a Cape Town design studio.`
- Add JSON-LD on the Home route only, baked in by `scripts/prerender.ts`: `@type` `ProfessionalService`, `name` Christopher Robin Design, `alternateName` CRD, `url` https://christopherrobindesign.com, `founder` Person Christopher Gara, `address` with `addressLocality` Cape Town and `addressCountry` ZA only (no street address), `areaServed` Cape Town and South Africa, `email` and `telephone` taken from what the site already displays, `image` the default OG image. Leave out `sameAs` unless profile URLs already exist in the codebase.
- Fix the dev fallback head in `index.html` to use `https://christopherrobindesign.com` (no www) so it matches `SITE_ORIGIN`.

## 5. Checks before opening the PR

- `pnpm build` passes, including typecheck and prerender.
- Grep the copy files for `, and ` and for `—` and `–`. Report any left in user-facing copy.
- Confirm the built `dist/public/index.html` contains the JSON-LD and the new Home description.
- PR description: summary, the voice-pass sentence list and anything you could not apply.
