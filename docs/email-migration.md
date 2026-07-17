# Email migration and enquiry-form runbook

Written 17 July 2026 during the enquiry-form workstream. Two separate Cloudflare capabilities are involved; do not conflate them:

- **Email Routing** (receiving): forwards mail addressed to `@christopherrobindesign.com` addresses to a verified destination inbox. Free on all plans. Replaces the Wix/Google mailboxes for receiving once (and only once) the MX records are switched.
- **Email Sending** (the enquiry email): the Worker's `send_email` binding emails form submissions to the studio. Sending to a **verified destination address on the account is free on all plans, even when only Email Routing is configured** (confirmed against developers.cloudflare.com/email-service, 17 July 2026). Full Email Sending to arbitrary recipients is beta and needs a Workers Paid plan; this project does not use it.

## Audited state, 17 July 2026 (read-only; nothing changed)

- Nameservers: Cloudflare (`meiling`/`julio.ns.cloudflare.com`) — the zone is ready for Email Routing.
- MX: five Google records (`aspmx.l.google.com` and alternates) — receiving currently runs through the Wix-managed Google mailboxes.
- SPF: `v=spf1 include:_spf.google.com ~all` (Google only). No DMARC record. No `google._domainkey` DKIM selector visible.
- Cloudflare account (chrisgara@gmail.com, account `94fc7fa5…`): Email Routing not enabled on any zone; **no verified destination addresses**; Email Sending API returned Unauthorized for the current CLI token (scopes) — dashboard is the path for setup.
- Repo email references: exactly one, `CONTACT_EMAIL` (now in `artifacts/portfolio/src/lib/site.ts`, displayed as `christopher@christopherrobindesign.com`). The Worker's addresses live in `wrangler.toml` `[vars]`.

## What the repo now contains (no DNS impact)

- `worker/index.ts`: `POST /api/enquiry` with server-side validation, honeypot, per-IP rate limiting (5/min), same-origin check and structured errors; sends via the `EMAIL` binding to `CONTACT_INBOX`, `replyTo` set to the visitor. All email machinery is server-side; the browser only POSTs JSON.
- `wrangler.toml`: `main` worker, `ASSETS` binding, `[[send_email]]`, `[[ratelimits]]`, and `[vars]` `CONTACT_INBOX` / `ENQUIRY_FROM`.
- The contact form submits to the endpoint, announces success/failure accessibly, and on failure offers the old mailto handoff with the composed message — the fallback stays until the production flow is verified.

## Owner setup steps (in order)

**Phase A — enable the enquiry email (no MX change, no risk to current mail):**
1. Dashboard → Email → Email Routing → the christopherrobindesign.com zone → add destination address (e.g. chrisgara@gmail.com) and click the verification email. This is the address that qualifies for free sending; it must match `CONTACT_INBOX` in wrangler.toml.
2. Enable Email Routing on the zone but **decline/skip the MX record change when offered** — routing rules can wait; the enabled zone is what lets the Worker send from `enquiries@christopherrobindesign.com`.
3. Merge the branch; Workers Builds deploys the Worker alongside the assets.
4. Production verification: submit the live form, confirm the email arrives at the destination inbox and that Reply goes to the visitor's address. Only after this passes, remove the mailto fallback (one small follow-up change).

**Phase B — move receiving off Wix/Google (the MX cutover; do this deliberately):**
1. Preconditions: Phase A verified; export/backup anything needed from the Google mailboxes; pick the public addresses to keep (`christopher@`, and `info@`/`hello@` if wanted — each is one custom-address rule).
2. In Email Routing, create custom addresses `christopher@…` (and `info@…` if kept) → forward to the verified destination.
3. Accept Email Routing's MX/SPF records. From this moment Google stops receiving; Cloudflare forwards to Gmail. Rollback: restore the five Google MX records and the Google-only SPF exactly as recorded above — the audit section is the rollback reference.
4. Confirm delivery with an external test email to `christopher@…`, then cancel the Wix email subscription.
5. Recommended: add a DMARC record (none exists today), e.g. `v=DMARC1; p=none; rua=mailto:<destination>` to start monitoring.

## Replying as christopher@ (Email Routing is not a mailbox)

Email Routing only forwards; replies from Gmail would otherwise come from chrisgara@gmail.com. To reply from the studio address: Gmail → Settings → Accounts → "Send mail as" → add `christopher@christopherrobindesign.com` via Gmail's own SMTP for the alias flow. Note Gmail's alias verification email must be receivable — do this **after** Phase B step 3 (or while Google mail still works, before cancelling Wix, which is the smoother order: set up Send-mail-as first, verify while the Google mailbox still receives, then cut over MX). Deliverability caveat: SPF for `~all` with Gmail sending is imperfect; if replies land in spam, the fix is DKIM via a proper sending setup, or replying less formally from the Gmail address.

## Open decision

The public display address is currently `christopher@…` per the latest instruction; the earlier idea of switching the site to `info@`/`hello@` remains one line in `site.ts` plus one custom-address rule whenever decided.
