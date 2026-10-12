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

On 13 October Christopher requested four pricing cards and asked for suggested amounts in South African rand. The services draft now proposes Editorial from R8,500, Brand identity from R15,000, Website from R18,000 and Brand + website from R30,000, each a once-off project fee. Editorial comes first; the Website card uses forest ink to highlight web work. The cards retain the parchment and pencil presentation, with one column on phones, two at medium widths and four on wide screens.

These are proposed CRD fees for Christopher to review before production, not approved quotations or a claim about market averages. Pricing was informed by current published examples checked on 13 October: [Lucky Duck](https://www.luckyduckdesigns.co.za/services-pricing) lists a full identity at R13,500 and a brand plus web UI package at R36,000; [Juicy Designs](https://www.juicydesigns.co.za/pricing/rate-card/) lists identity from R15,000, website design from R12,000 and development separately from R18,000. Scopes differ, particularly web design versus a completed build. The editorial amount is a proposed starting fee for one supplied-content brochure or report of up to 12 pages including the cover; it is not a benchmark for an entire magazine.

The identity package offers two initial directions and development of one, a logo suite, colour, typography and a concise guide. The website package covers a responsive portfolio or business site of up to five pages, an enquiry form, basic page metadata and launch handover. The combined package includes both scopes. Each allows two consolidated refinement rounds. Supplied copy and images, separate paid assets/printing, and separately agreed domains, hosting and maintenance are stated. Ecommerce, bookings and custom integrations require a separate scope. Package links carry the service selection and an editable package-specific message into the existing enquiry form; arbitrary query text is not copied into the form.

Christopher supplied his invoice HTML template during this pricing work. Its colour tokens and typography match the approved CRD presentation. The template is used as a styling reference only; its business, client and tax details are not published in the site or repository. Before publishing prices, Christopher should review the final amounts against the scoped effort and confirm the public VAT wording. Current work remains a review draft and has not been deployed to production.

## Release

Christopher subsequently chose Gmail for marketing signup notifications. The native Studio notes form and separate `/api/newsletter` route send a private consent record to the existing configured inbox, without creating a new MailerLite account. Gmail and the Worker bindings are verified; domain sending and real delivery remain unverified because the connector cannot read Email Sending status. Production signup stays gated until a successful delivery check. Server security tests, workspace type checks and configured production-browser form checks passed. See `docs/marketing-signup.md` for activation, consent handling and rollback. This change does not send campaigns or modify DNS.

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
- Four proposed pricing cards checked at 320px, 390px, 768px and 1440px in development and the production build: correct starting amounts, no clipping or horizontal overflow, and usable touch targets. All four enquiry links carry their service and editable package message through client navigation and direct prerendered page loads. Unknown package/type values are ignored. Final portfolio TypeScript and production build passed with no browser errors in the pricing checks.
