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
