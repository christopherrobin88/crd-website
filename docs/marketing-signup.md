# CRD Studio notes signup

13 October 2026. Requested by Christopher for marketing email collection, separate from project enquiries. Recommended provider: MailerLite. Christopher confirmed a new account is needed.

## Current state

The local draft includes a CRD popup and a footer entry point. With no form configured, development shows disabled design-preview fields and an explicit preview notice. Production renders neither the popup nor its footer button. No addresses are currently collected. Account creation, email verification, provider configuration and a real confirmation test remain outstanding.

Desktop automatic prompting requires 45 seconds on the site and 35% page scroll. It is suppressed on contact pages, while another dialog or the Studio channel transition is active, and while the tab is hidden. Mobile uses the footer button only. Dismissal suppresses automatic prompts for 90 days on that browser; explicit footer opening still works. If storage is blocked, suppression lasts for the current page session. No email addresses are stored in browser storage.

## Connect the form

1. Create the account at <https://accounts.mailerlite.com/signup>, using Christopher's chosen business login. Complete verification and any provider account approval.
2. Create a group named `CRD Studio notes`, then an embedded signup form assigned to it. Leave double opt-in enabled. Use email only, an unchecked required marketing-consent checkbox and the purpose below. Include a privacy statement explaining that MailerLite processes the signup for CRD and how to request removal. Enable the provider's spam protection.
3. Match the form to forest `#0E2320` on parchment `#F4ECD9`, DM Sans for fields, with no duplicate heading above the fields. Suggested consent: `I'd like to receive CRD marketing emails. I can unsubscribe at any time.` Suggested purpose: occasional CRD project updates, design notes and studio news. Make the success message request email confirmation, rather than claiming the subscription is complete.
4. Copy the form's public Share URL, normally `https://preview.mailerlite.io/forms/ACCOUNT/FORM/share`. Set `VITE_NEWSLETTER_FORM_URL` to that URL in the Mini development environment and the existing Cloudflare build environment. This is a public form URL, not an API key. Other origins and malformed URLs fail closed. If MailerLite supplies a different official URL shape, verify it before extending the allowlist.
5. Rebuild the review draft. The provider form loads in an iframe only when the dialog is open, with a new-tab fallback. Inspect the actual provider form on desktop and mobile, including any iframe restrictions, consent, validation, CAPTCHA, keyboard navigation, success message and confirmation flow. Replace the embed with MailerLite's supplied HTML if its Share page refuses embedding. A provider fixture is not proof of a working live signup.
6. With Christopher's own controlled test address, verify that the submission is persisted to the correct MailerLite group as unconfirmed, receives a confirmation email, becomes active only after confirmation, and can unsubscribe from a test campaign. Do not use visitor addresses for tests. Do not send campaigns without Christopher's instruction. Remove test data afterwards through the provider.

The account login and verification must be completed by Christopher. The platform was not available among the discovered connected plugins in this session; account management is not claimed to be automated. No Cloudflare DNS, email routing, enquiry Worker or launchd jobs are changed by this frontend integration.

## Rollback

Unset `VITE_NEWSLETTER_FORM_URL` and rebuild to disable the public signup surfaces. The existing enquiry form continues independently. Removing the popup does not delete provider subscriber records; manage retention and removal in MailerLite.

## Draft validation

Workspace type checks and the production build passed, including all 19 prerendered routes. Mini Chrome checks passed at 320, 390 and 1440 pixels: dialog fit and internal scrolling, focus trapping and return, Escape, background scroll lock, desktop delay/scroll gating, mobile automatic-prompt suppression, contact-page exclusion and dismissal across reload. Invalid provider URLs fail closed. A stubbed configured provider form loaded only on opening, unloaded on closing and retained a new-tab fallback with reduced motion. The unconfigured production build showed no signup surfaces after hydration. No live provider submission, confirmation or unsubscribe has been tested yet.

Production checks exposed a reduced-motion hydration mismatch in the existing BrowserPreview and ProjectFlow controls. Their preference now uses a shared external-store hook with a deterministic server snapshot, so initial hydration matches the prerender and then applies the visitor's setting. The footer entry point is also mounted after hydration.

## Provider references

- <https://www.mailerlite.com/pricing>
- <https://www.mailerlite.com/help/how-to-create-an-embedded-form>
- <https://www.mailerlite.com/help/how-to-use-double-opt-in-when-collecting-subscribers>
