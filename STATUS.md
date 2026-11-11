# CRD website status

Updated: 2026-10-16
Repository: `/Users/user/Documents/GitHub/crd-website/`

## Verified in this chat

- PR #8 head is `d1163b6f060a699875d55d1c165468eb32dcb125` on `feat/sitewide-copy-rewrite`.
- Cloudflare Workers build `d0e4f101-993e-4645-b722-853afb56bb6a` reports success for that commit. Its log names version `74acdf38-2c9b-4312-9b4b-a9eed10e7062`, a version preview URL and the branch preview alias.
- Christopher supplied Home HTML and identified its source URL as the branch preview alias. That HTML has the old meta description, old Selected Work and Behelm copy, and no `sameAs`; it predates commit `4e3eab4` content. We could not independently fetch the preview HTML because Cloudflare Access redirects unauthenticated requests.
- The public Home fetched in this chat also has the old meta description and no `sameAs`, but its Selected Work and Behelm copy differ from Christopher's pasted branch HTML.
- Local repository source at PR head has the new meta description and `ProfessionalService` JSON-LD with `sameAs`. No site code, deployment or access settings were changed here.

## Preview check resolved on 2026-10-16

- Christopher opened the exact `d1163b6` version preview in his authenticated browser and reported that `sameAs` appears in its source.
- Christopher then opened the branch preview alias with `?check=d1163b6` and reported that the new markers are present. The latest branch content is reachable through both preview URLs by his browser inspection.
- The earlier old HTML came from a stale response. This chat did not establish whether browser cache or Cloudflare cache supplied it. No deployment, cache, site code or access setting was changed.
- Christopher authorised merging PR #8 on 2026-10-16, superseding the earlier no-merge hold in the October copy brief.

## Release verified on 2026-10-16

- PR #8 merged into `main` as `992fdf61b71f7a4e9d09590967696444405df403`. The final branch check and production Workers build passed. Cloudflare reported version `069cee0a-586c-4213-830f-614a03390fc0` active at 100%.
- The plain public Home URL initially returned old cached HTML while a fresh query returned the new Home description and `sameAs`. Purged only the 19 page URLs in the generated sitemap.
- Re-fetched all 19 public page URLs. Every page returned HTTP 200 and matched the local production HTML after accounting for Cloudflare's injected beacon and the generated JavaScript asset hash. This verifies the published page content, not external enquiry delivery or analytics.
- The October copy brief and this status file were committed. The local repository was clean on `main` after the merge.

## Footer social links released on 2026-10-16

- PR #10 (`feat/footer-social-links`, commit `9a0140a`) adds LinkedIn, Instagram and Facebook icons to the shared footer. Footer links and Home business `sameAs` now consume one URL constant; the founder's personal `sameAs` remains separate.
- `pnpm build` and `pnpm typecheck` passed. Generated Home HTML has all three links with the requested labels, target, rel and 44px minimum tap area, and its business `sameAs` matches their URLs. PR #10 merged as `0a97384`. Its Cloudflare main build passed and the public Home returned all three links on plain and fresh URLs. Christopher-supplied footer screenshot showed the icons centred and unclipped.

## Contact WhatsApp review branch on 2026-10-16

- `feat/contact-whatsapp` adds the user-supplied phone number and WhatsApp link to Contact, plus `telephone` and `priceRange` to Home JSON-LD. `pnpm build`, `pnpm typecheck` and generated HTML checks passed. No production deployment is claimed.

## Next action

- Review the contact WhatsApp branch and PR before any merge or deployment.

## Botanical logo preview, 2026-10-19

- Christopher approved the enlarged green botanical logo concept and authorised publication.
- New versioned 1200x630 social image keeps the square logo artwork centred for square comment crops; default Open Graph and Twitter image references updated. Original image retained.
- Publication verification pending. WhatsApp profile derivative prepared separately in the CRD workspace.

## Homepage refresh and living tree released on 2026-11-12

- Four pull requests merged to `main` at Christopher's request ("go live"), in this order: #15 hero twinkle loops pause off screen, #16 deposit terms line on Services, #14 homepage (page-to-screen showpiece, contents strip, prices on offers, "More of the work." index, four-step project flow), #17 living tree nav logo plus the credit kit at `/credit/`.
- Production build for `444f116` reported success. Verified on the public site in a browser with a fresh query and with a no-store fetch of the plain Home URL: new Home sections present, living logo inlined, four flow cards, three "Starting from" prices, the deposit line on `/services`, and all four `/credit/` files returning 200.
- Mobile check on the live site by viewport emulation at 375x812 only: the pinned stage fits and there is no horizontal overflow. No real device, Safari or Firefox check was done.

### Open items

- The living tree uses underdamped springs (damping 0.28 on the trunk, 0.4 on leaves). Codex flagged this on #17 against the "no bounce or elastic easing" rule. Left as supplied because Christopher authored the motion and asked for it. Needs his decision: keep as an agreed exception, or damp it.
- The hero illustration's sparkles and pop-in easing sit against the "no sparkle effects" and "no bounce" rules. Untouched.
- Deposit wording ("balance is due on handover") was drafted in chat and published on his go-live instruction. He should confirm it matches his terms.
- New Home copy is unreviewed in detail: the four flow cards, "Vol. 17", the stage labels.
- No pay link exists yet. The Yoco account on his email appears to have been set up for another business in 2020; he needs to confirm the business name and payout bank before any client deposit goes through it.
- The credit kit is not yet on any client site. Each needs the owner's agreement.
