# Decision: Canonical Production Domain

**Date:** 10 July 2026

## Decision

`https://christopherrobindesign.com` is the canonical production domain for the Christopher Robin Design website.

## Applies to

- Canonical tags
- Open Graph URLs
- Twitter card images
- Sitemap entries
- Robots sitemap reference
- Public project links
- Documentation
- Implementation briefs
- Claude Project memory and instructions

## Notes

`www.christopherrobindesign.com` and `christopherrobin.design` may remain available as secondary domains or redirect sources, but they are not the canonical public domain.

On 19 July 2026, the canonical host changed from `www.christopherrobindesign.com` to the apex `.com` domain. The `www` `.com` host should permanently redirect to the apex `.com`, and `.design` hosts should permanently redirect to the matching apex `.com` path.

Canonical-domain uncertainty is no longer an open Phase 0 decision. Future sessions must not reopen this unless Christopher explicitly changes the domain strategy.

## Required implementation pattern

Use:

`https://christopherrobindesign.com`

Do not use these as canonical values:

- `https://www.christopherrobindesign.com`
- `https://christopherrobin.design`
- `https://www.christopherrobin.design`

Secondary domains should redirect to the canonical apex `.com` domain where possible.
