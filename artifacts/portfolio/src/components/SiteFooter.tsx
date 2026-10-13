import { Leaf } from "lucide-react";
import { useEffect, useState } from "react";
import { newsletterAvailable, newsletterOpenEvent } from "@/lib/newsletter";

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
      <p className="mx-auto max-w-md whitespace-nowrap text-center font-sans text-[0.7rem] leading-relaxed text-crd-forest/70 md:text-xs">
        © 2026 Christopher Robin Design. Cape Town.
      </p>
    </footer>
  );
}
