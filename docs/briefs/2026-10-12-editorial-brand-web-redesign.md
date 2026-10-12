# CRD: editorial, branding and websites

Christopher requested a redesign of christopherrobindesign.com on 12 October 2026. This explicitly supersedes the earlier restriction to production refinements. The existing canonical domain, Cloudflare deployment pipeline and client enquiry endpoint remain in place.

## Offer and presentation

Editorial design leads. Branding and websites are the other two primary services. Production experience supports those services rather than competing with them as a separate homepage offer. Christopher reviewed the first draft and specifically requested the moving botanical laptop back. The approved hand-drawn SVG is restored in the hero. Editorial work remains prominent in the selected projects. Web projects use browser-window presentations with gently scrolling supplied screenshots and individual pause controls. Previews pause off-screen, in hidden tabs and for reduced-motion visitors.

Use CRD's approved forest, parchment, moss and gold palette, Playfair Display and DM Sans. Christopher particularly likes the restraint of the supplied Behelm PDF presentation. Real project material, clear hierarchy and generous space carry the redesign. Both fonts are served locally.

## Web portfolio

- Riette Gara: artist website, live at https://www.riettegara.com/. Desktop, mobile, gallery and enquiry presentations supplied by Christopher.
- Made by Mike: maker website prototype built, primary domain registration pending. Christopher subsequently supplied the exact prototype 6 HTML. Desktop, mobile and motion captures now use that source, with its pendant logo, pale header and orange accents. The source includes labelled concept imagery. Do not link madebymike.com as a live site or substitute the older v07 prototype.
- Behelm: website design presentation. Christopher confirmed the compass-style website mark is the latest identity. The existing BH monogram PDF presentation is retained and labelled as the earlier logo system study, not the current identity.

The added routes are /web, /project/riette-gara, /project/made-by-mike and /project/behelm-web. They are included in the same metadata, prerender and sitemap flow as the existing projects. The web cards are also present on /work.

Do not publish the supplied PDF's example business-card contact details or confidential letterhead as new portfolio assets. Existing approved brand gallery assets remain unchanged.

## Systems and the Studio

Christopher requested the project workflow here as public proof of systems thinking. The hand-drawn demonstration automatically cycles from Brief through Assign, Design, Review, Approve and Deliver while visible. A labelled pause/resume control appears directly above the cards. There is no Run/Reset bar. It pauses off-screen, while reading with a mouse pointer and in hidden tabs; reduced motion shows all six stages without cycling. It is explicitly a sample, uses no client data and explains which routine updates can be automated while design decisions and approvals stay with people. It appears on the homepage and services page.

The homepage includes a visitor link to https://christopherrobin.studio/ labelled "Step into the Studio". An ordinary click plays a short TV-static distortion and reveals the existing neon room before navigating. Reduced-motion and modified clicks use the direct link. The overlay mounts outside the distorted page and clears on browser return.

## Fees

Christopher asked whether price should be on the site. The recommendation is a concise services-page guide with genuine starting prices and a clearly defined scope. No amounts have been supplied or approved. This draft therefore explains project scope, agreed fees and separately agreed website hosting/support without fabricating prices or public placeholder amounts. Add numerical guide prices when Christopher chooses them.

## Release

Feature branch: feat/editorial-brand-web-portfolio. Build and review the draft before considering production. This task does not change the Studio, public calendar, private services, trading dashboard, recorder, launchd jobs or DNS.

## Late review, 13 October

Christopher asked for more of the hand-drawn look: loose browser frames, pencil underlines, sketched arrows and small serif annotations are added without a new typeface. He supplied a 36-second recording of Riette's moving gallery. A silent 10.5-second excerpt, ending before the context menu, now supplies the actual gallery motion in the browser preview and a controllable recording on the case study. Made by Mike has a silent recording of the supplied prototype 6, scrolling through the hero and lighting collection. Behelm retains a gently scrolling screenshot preview.

Christopher also asked about developing Riette's gallery further. Suggested direction: a guided entrance, movement between paintings, distinct collection rooms, artwork detail/enquiry views and simple mobile navigation. This is a potential separate Riette website update, not an implemented feature or a claim in the CRD case study.

## Mobile review

Christopher said the mobile changes were not prominent enough. The phone opening now places the animated laptop directly beneath the headline, before the introduction and actions. Web cards use the supplied portrait mobile screenshots in taller browser frames with gentle scrolling. Desktop cards retain the actual interaction recordings. All preview motion has pause controls and respects reduced motion. Hidden desktop video previews stay paused on phones.

## Footer and review release

The footer slogan retains complete phrases: “Design with purpose.” and “Crafted with care.” stack cleanly on phones and stay intact on larger screens.

Automatic approval review initially rejected publishing the Riette gallery recording to the public CRD repository. Christopher subsequently explicitly approved including that supplied recording in the public repository for the review PR on 13 October 2026. The complete local feature branch is ready for the same review. Production has not been merged or replaced.

## Local validation, 13 October 2026

- Workspace TypeScript checks passed; the portfolio check passed again after the final footer and workflow changes.
- Production build passed, including content validation, hero validation, 19 prerendered routes and sitemap generation.
- Eight affected routes were checked in Mini Chrome at desktop 1440px and mobile 390px: one H1 per page, correct canonical URLs, no broken images or horizontal overflow.
- The phone opening shows the laptop immediately beneath the headline. Riette and Mike use their supplied portrait layouts on phones; desktop interaction recordings remain paused when hidden on a phone.
- Preview movement, pause/resume and off-screen suspension passed for both sites at desktop and mobile widths. Reduced motion uses static images.
- Mobile navigation closes on Escape and returns focus. Website enquiry links select the correct service. Returning from a web case study restores Work scroll position and link focus.
- Studio navigation was checked with a stub destination: the overlay covers the viewport, the link targets the public Studio, and browser Back clears distortion. This is a navigation check, not a production Studio deployment.
- The final automatic workflow reaches all six stages, resets and loops, pauses on request and off-screen, and shows all six stages statically with reduced motion.
- Footer phrase wrapping and horizontal overflow were checked at 320px, 390px, 768px and 1440px.
