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
