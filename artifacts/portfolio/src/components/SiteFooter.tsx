import { Leaf } from "lucide-react";
import { useEffect, useState } from "react";
import { newsletterAvailable, newsletterOpenEvent } from "@/lib/newsletter";
import { SOCIAL_LINKS } from "@/lib/site";

function SocialIcon({ name }: { name: (typeof SOCIAL_LINKS)[number]["name"] }) {
  switch (name) {
    case "LinkedIn":
      return <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
        <path d="M20.45 2H3.55C2.69 2 2 2.68 2 3.52v16.96c0 .84.69 1.52 1.55 1.52h16.9c.86 0 1.55-.68 1.55-1.52V3.52c0-.84-.69-1.52-1.55-1.52ZM7.93 18.75H4.98V9.2h2.95v9.55ZM6.45 7.9a1.71 1.71 0 1 1 0-3.42 1.71 1.71 0 0 1 0 3.42Zm12.3 10.85H15.8V14.1c0-1.11-.02-2.54-1.55-2.54-1.55 0-1.78 1.21-1.78 2.46v4.73H9.52V9.2h2.83v1.3h.04a3.1 3.1 0 0 1 2.79-1.53c2.98 0 3.57 1.96 3.57 4.5v5.28Z" />
      </svg>;
    case "Instagram":
      return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>;
    case "Facebook":
      return <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
        <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.51 1.5-3.89 3.78-3.89 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.77l-.44 2.89h-2.33v6.99A10 10 0 0 0 22 12Z" />
      </svg>;
  }
}

export function SiteFooter() {
  // Hydrate before showing a configured signup or a development preview.
  // Build-time HTML must not advertise an unconnected form.
  const [signupAvailable, setSignupAvailable] = useState(false);
  useEffect(() => setSignupAvailable(newsletterAvailable), []);
  return (
    <footer className="border-t border-crd-gold/20 px-6 py-10 md:px-12">
      <Leaf className="mx-auto mb-4 h-4 w-4 text-crd-moss" aria-hidden="true" />
      {signupAvailable && <div className="mb-6 text-center"><button type="button"
        onClick={() => window.dispatchEvent(new Event(newsletterOpenEvent))}
        className="border-b border-crd-forest/40 pb-1 text-sm text-crd-forest focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-crd-forest">
        Get occasional studio notes
      </button></div>}
      <p className="mx-auto mb-5 flex flex-col items-center justify-center gap-x-3 gap-y-2 text-center font-sans text-[0.7rem] uppercase tracking-[0.2em] text-crd-forest/80 sm:flex-row">
        <span className="whitespace-nowrap">Design with purpose.</span>
        <span className="hidden text-crd-gold sm:inline" aria-hidden="true">•</span>
        <span className="whitespace-nowrap">Crafted with care.</span>
      </p>
      <nav aria-label="Social media" className="mb-4 flex items-center justify-center gap-2">
        {SOCIAL_LINKS.map(({ name, href }) => (
          <a key={name} href={href} aria-label={name} target="_blank" rel="me noopener"
            className="inline-flex min-h-11 min-w-11 items-center justify-center text-crd-forest/70 transition-colors hover:text-crd-forest focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crd-forest">
            <SocialIcon name={name} />
          </a>
        ))}
      </nav>
      <p className="mx-auto max-w-md whitespace-nowrap text-center font-sans text-[0.7rem] leading-relaxed text-crd-forest/70 md:text-xs">
        © 2026 Christopher Robin Design. Cape Town.
      </p>
    </footer>
  );
}
