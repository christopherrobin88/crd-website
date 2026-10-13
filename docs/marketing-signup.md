# CRD Studio notes signup

13 October 2026. Christopher specified `info@christopherrobindesign.com` for CRD enquiries, signup notifications and the marketing sender. The private email can remain the MailerLite account login. The notification route and MailerLite subscriber collection are separate: the private MailerLite plugin is saved, but its OAuth connection and account configuration are not yet verified.

## Studio inbox delivery draft

The CRD popup submits email, an unchecked required marketing-consent checkbox, the consent version and a honeypot to `POST /api/newsletter`. The Worker emails one notification to the existing `CONTACT_INBOX` through the `EMAIL` binding. It never accepts a visitor-supplied destination or sends a campaign. The notification records the address, UTC receipt time, source host and exact consent text/version. It explicitly says email ownership has not been verified. No subscriber addresses or consent records are stored in the public repository, browser storage or request logs.

Consent version: `crd-studio-notes-v1`. Consent text: `I'd like to receive CRD marketing emails. I can unsubscribe at any time.` The popup explains that the address and consent go to the studio inbox. It provides an email link for unsubscribe/removal requests. These requests must be handled manually before any later campaign. A Gmail notification is a signup request record, not a verified subscriber database or double-opt-in flow.

Server validation requires current explicit consent and a valid bounded address. The route checks same origin, JSON content type, a bounded 2 KB body including chunked requests, honeypot and per-IP rate limits. Newsletter keys have a separate prefix under the existing rate binding so they do not consume the project's enquiry key. Missing email/rate bindings fail closed. Email sending is awaited; a sending error returns failure and the visitor's entered fields are retained for retry. The browser prevents duplicate concurrent submissions. No addresses are currently collected by this draft on production.

## Verified access and remaining release checks

On 13 October, read-only Cloudflare API inspection confirmed that the configured Gmail destination is verified and the live `crd-portfolio` Worker has the expected email, recipient, sender and rate-limit bindings. The rate limit is five requests per minute per connecting IP. The domain's Email Routing setting reports disabled. Email Sending is a separate capability; the connector rejected reading its sending-domain status with Unauthorized. This audit proves the recipient and bindings exist, not successful delivery. No DNS, routing, account settings or production deployment were changed. A limited Gmail ID search found no messages from the configured sender in the previous 30 days; this is not proof that sending fails.

The current draft sets both `CONTACT_INBOX` and `ENQUIRY_FROM` to `info@christopherrobindesign.com`. The latest read-only audit found Google MX records, disabled Cloudflare Email Routing and no verified `info@` destination. An old Cloudflare forwarding rule exists but is not evidence of active receiving while Email Routing is disabled. The live Worker still has its previous recipient and sender, pending destination verification and delivery testing.

Cloudflare destination registration for `info@christopherrobindesign.com` succeeded on 13 October. A subsequent API read confirmed verification at `2026-10-13T05:30:03.461498Z`. This verifies ownership of the address, not end-to-end notification delivery. No live Worker settings or mailbox DNS were changed.

The exact-preserving live settings update was refused by Cloudflare with error `10214`: a newer uploaded Worker version is not currently deployed. The existing production version remains `2e34a1df-b57a-4055-99bf-82d42f1f4f27`. Apply the draft's email variables with the approved website release and verify delivery then. The local private integration directory holds the previous settings for rollback. Do not deploy an unreviewed staged version merely to change the inbox.

Christopher reports the CRD MailerLite connection as Connected. Its skill is installed, but no authenticated MailerLite account tools are available in this chat yet. No group, form, sender setting or campaign has been changed in that account by this agent.

Before activation, verify `info@christopherrobindesign.com` as a destination, domain sending and a controlled end-to-end notification arriving in that inbox, including Spam. Label any test clearly and do not create a subscriber or represent test data as genuine marketing consent. Check the subject, sender, reply-to, timestamps and consent text. Retain the private delivery evidence and remove test messages separately if requested. Preserve the existing Google MX records. For MailerLite, use `info@christopherrobindesign.com` as the sender and reply-to, and verify the address/domain in the connected account before sending any campaign.

## Activation and rollback

After the delivery check and approval of the review draft, set `VITE_NEWSLETTER_DELIVERY=gmail` in the existing Cloudflare build environment and rebuild/deploy the frontend and Worker together. Local development shows the native Gmail form for review. A plain Vite preview does not run the Worker; without a real endpoint it shows a truthful sending error. Browser validation uses stub responses only and does not send email.

Production stays hidden with no delivery mode and no existing hosted form URL. Set `VITE_NEWSLETTER_DELIVERY=off` and rebuild to hide every signup surface. Reverting the newsletter route removes the email notification endpoint. Neither action deletes Gmail records; manage retention and removals privately in the inbox. A previously configured MailerLite hosted URL remains supported for a future deliberate migration, but no new MailerLite account is required for the Gmail route.

Desktop automatic prompting still requires 45 seconds and 35% page scroll. It is suppressed on Contact, other dialogs, the Studio transition and hidden tabs. Mobile opens only through the footer. Closing suppresses automatic prompts for 90 days; manual opening remains available. Only a dismissal timestamp is stored locally.

## Validation

Workspace TypeScript checks and the Gmail-enabled production build passed, including the 19 prerendered routes. Six Worker tests cover owner-only delivery and consent records, invalid or stale consent/email, malformed/cross-origin/oversized requests, chunked body bounds, honeypot/rate/missing bindings and awaited send failure. Mini Chrome checks at 320, 390 and 1440 pixels passed: dialog fit, required unchecked consent, failure retaining fields, successful request acknowledgement, unsubscribe link, Escape and return focus. Six browser requests were intercepted fixtures, not real Gmail delivery.

Current Worker binding declarations are generated by Wrangler in `worker/env.d.ts` and checked against current `@cloudflare/workers-types`. Regenerate with `--include-runtime=false --strict-vars=false` so configured inbox values are not copied into this declaration. The Worker bundle also routes signup, existing project enquiries and static assets correctly with stub bindings. No schedules or background agents were introduced.

## References

- <https://developers.cloudflare.com/email-service/api/send-emails/workers-api/>
- <https://developers.cloudflare.com/email-service/configuration/send-bindings/>
- <https://developers.cloudflare.com/email-service/configuration/domains/>
- <https://developers.cloudflare.com/workers/best-practices/workers-best-practices/>
