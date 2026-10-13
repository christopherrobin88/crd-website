/** Public form URL only. Never put an email-platform API key in VITE variables. */
export function newsletterFormUrl(value: unknown): string | null {
  if (typeof value !== "string" || !value.trim()) return null;
  try {
    const url = new URL(value.trim());
    if (url.protocol !== "https:" || url.hostname !== "preview.mailerlite.io" ||
        url.username || url.password || url.port || !/^\/forms\/[^/]+\/[^/]+\/share\/?$/.test(url.pathname)) return null;
    return url.href;
  } catch {
    return null;
  }
}

export const newsletterUrl = newsletterFormUrl(import.meta.env.VITE_NEWSLETTER_FORM_URL);
export const newsletterGmail = import.meta.env.VITE_NEWSLETTER_DELIVERY === "gmail" || (import.meta.env.DEV && !newsletterUrl && import.meta.env.VITE_NEWSLETTER_DELIVERY !== "off");
export const newsletterAvailable = import.meta.env.VITE_NEWSLETTER_DELIVERY !== "off" && (newsletterGmail || Boolean(newsletterUrl) || import.meta.env.DEV);
export const newsletterConsentVersion = "crd-studio-notes-v1";
export const newsletterConsentText = "I'd like to receive CRD marketing emails. I can unsubscribe at any time.";
export const newsletterOpenEvent = "crd:open-studio-notes";
