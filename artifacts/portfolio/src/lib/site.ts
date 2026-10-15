/**
 * Public studio contact address, single source for the site. Incoming mail
 * for it is (post-migration) forwarded by Cloudflare Email Routing to the
 * verified destination inbox — see docs/email-migration.md, which also
 * covers how replies keep coming FROM this address.
 *
 * Switching the public address (e.g. to info@ or hello@) is: this line, a
 * matching custom address in Email Routing, and nothing else.
 */
export const CONTACT_EMAIL = "info@christopherrobindesign.com";
export const CONTACT_PHONE = "+27828390093";
export const CONTACT_PHONE_DISPLAY = "082 839 0093";

/** Public social profiles used by the footer and business structured data. */
export const SOCIAL_LINKS = [
  { name: "LinkedIn", href: "https://www.linkedin.com/company/christopher-robin-design/" },
  { name: "Instagram", href: "https://www.instagram.com/christopher_robin_design/" },
  { name: "Facebook", href: "https://www.facebook.com/christopherrobindesign/" },
] as const;
