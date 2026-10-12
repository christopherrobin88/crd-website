import { Leaf } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-crd-gold/20 px-6 py-10 md:px-12">
      <Leaf className="mx-auto mb-4 h-4 w-4 text-crd-moss" aria-hidden="true" />
      <p className="mb-5 flex flex-col items-center justify-center gap-x-3 gap-y-2 text-center font-sans text-[0.7rem] uppercase tracking-[0.2em] text-crd-forest/80 sm:flex-row">
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
