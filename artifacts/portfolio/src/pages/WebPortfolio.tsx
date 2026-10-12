import { useEffect } from "react";
import { Link } from "wouter";
import { SiteNav } from "@/components/Navigation";
import { SiteFooter } from "@/components/SiteFooter";
import { WebProjects } from "@/components/WebProjects";
import { usePageMeta } from "@/hooks/use-page-meta";
import { scrollNowTo } from "@/hooks/use-smooth-scroll";
import { contactHref } from "@/lib/enquiry";

export default function WebPortfolio() {
  usePageMeta("/web");
  useEffect(() => scrollNowTo(0), []);
  return (
    <div className="min-h-screen text-crd-forest">
      <SiteNav />
      <main className="mx-auto max-w-7xl px-6 pb-24 pt-36 md:px-12 md:pt-44">
        <header className="mb-14 max-w-3xl md:mb-20">
          <p className="mb-5 text-xs uppercase tracking-[0.22em]">Web design</p>
          <h1 className="font-serif text-5xl leading-[1.08] tracking-tight md:text-7xl">An editorial eye.<br /><span className="italic text-crd-moss">A digital canvas.</span></h1>
          <p className="mt-7 max-w-xl text-lg leading-relaxed text-crd-forest/80">Websites for artists, makers and businesses. Each shaped around the work, the people behind it and the way visitors need to move through it.</p>
        </header>
        <WebProjects />
        <section className="mt-20 border-t border-crd-forest/20 pt-12">
          <h2 className="font-serif text-3xl md:text-4xl">A website with a clear point of view.</h2>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-crd-forest/80">Tell me what you do, who you want to reach and what the site needs to make possible.</p>
          <Link href={contactHref("Website or portfolio")} className="mt-7 inline-block rounded-full bg-crd-forest px-7 py-4 text-sm font-medium text-crd-parchment">Discuss your website</Link>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
