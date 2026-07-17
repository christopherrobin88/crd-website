import { useEffect } from "react";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { SiteNav } from "@/components/Navigation";
import { SiteFooter } from "@/components/SiteFooter";

export default function NotFound() {
  useEffect(() => {
    document.title = "Page not found | Christopher Robin Design";
  }, []);

  return (
    <div className="min-h-screen text-foreground flex flex-col">
      <SiteNav />
      <div className="flex-1 flex items-center px-6 md:px-12">
        <div className="max-w-7xl mx-auto w-full py-40">
          <p className="font-sans text-xs uppercase tracking-[0.22em] text-crd-forest/70 mb-6">
            404
          </p>
          <h1 className="font-serif text-5xl md:text-7xl tracking-tight leading-[1.05] max-w-2xl">
            This page isn't part of the collection.
          </h1>
          <p className="mt-6 max-w-md font-sans text-base md:text-lg leading-relaxed text-foreground/70">
            The address may have changed or never existed. The work, on the
            other hand, is exactly where it should be.
          </p>
          <Link
            href="/work"
            className="group crd-lift mt-10 inline-flex items-center gap-3 whitespace-nowrap bg-crd-forest px-8 py-4 font-sans text-[0.7rem] uppercase tracking-[0.24em] text-crd-parchment hover:bg-crd-moss focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crd-gold focus-visible:ring-offset-2"
          >
            View Selected Work
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
