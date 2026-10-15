import { useEffect } from "react";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { SiteNav } from "@/components/Navigation";
import { SiteFooter } from "@/components/SiteFooter";
import { HeroLaptop } from "@/components/HeroLaptop";
import { StudioPortal } from "@/components/StudioPortal";
import { SketchLine, SketchArrow } from "@/components/SketchLine";
import { ProjectFlow } from "@/components/ProjectFlow";
import { SelectedWorkSection, ContactCloseSection } from "@/components/home/HomeSections";
import { WebWorkSection } from "@/components/WebProjects";
import { usePageMeta } from "@/hooks/use-page-meta";
import { scrollNowTo } from "@/hooks/use-smooth-scroll";
import { contactHref } from "@/lib/enquiry";

const offers = [
  { title: "Editorial design", body: "Magazines, reports and publications. A clear hierarchy, careful image treatment and layouts built to carry the story.", href: "/project/kruger-magazine", proof: "Explore the editorial work" },
  { title: "Branding", body: "Distinctive identities with the typography, colour and application rules to hold together across print and digital.", href: "/project/behelm", proof: "Explore the brand work" },
  { title: "Websites", body: "Considered websites for artists, makers and businesses. The same attention to content and craft, made for the screen.", href: "/web", proof: "Explore the web work" },
];

export default function Landing() {
  usePageMeta("/");
  useEffect(() => scrollNowTo(0), []);
  return (
    <div className="min-h-screen text-crd-forest">
      <SiteNav />
      <main>
        <section data-hero-zone className="mx-auto grid max-w-7xl items-center gap-6 px-6 pb-12 pt-28 md:grid-cols-[1.15fr_1fr] md:gap-x-16 md:gap-y-8 md:px-12 md:pb-24 md:pt-44">
          <div className="order-0 md:col-start-1 md:row-start-1 md:self-end">
            <p className="mb-5 text-[0.65rem] font-medium uppercase tracking-[0.2em] md:mb-7 md:text-xs">Independent design studio / Cape Town</p>
            <h1 className="font-serif text-[clamp(2.7rem,5.6vw,5.5rem)] font-semibold leading-[1.05] tracking-[-0.035em]">
              Editorial.<br />Branding.<br /><span className="relative inline-block font-normal italic text-crd-moss">Websites.<SketchLine className="absolute -bottom-4 left-0 w-full" /></span>
            </h1>
          </div>
          <div className="order-2 md:col-start-1 md:row-start-2 md:self-start">
            <p className="max-w-lg text-base leading-relaxed text-crd-forest/85 md:text-lg">Seventeen years designing magazines, brands and retail campaigns. Now the same eye goes into websites for businesses that want to look as good as their work.</p>
            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-4 md:mt-8 md:gap-x-7">
              <Link href="/work" className="inline-flex items-center gap-3 crd-pencil-button rounded-full bg-crd-forest px-5 py-3 text-[0.8rem] md:px-7 md:py-4 md:text-sm font-medium text-crd-parchment focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-crd-forest">View selected work<ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
              <Link href="/contact" className="border-b border-crd-gold pb-1 text-sm font-medium">Start a conversation</Link>
            </div>
          </div>
          <div className="order-1 mx-auto w-full max-w-[230px] md:col-start-2 md:row-span-2 md:row-start-1 md:max-w-[430px]">
            <HeroLaptop className="w-full" />
            <p className="mt-2 flex items-center justify-center gap-2 font-serif text-sm italic md:gap-3 md:text-lg">Now designing websites.<SketchArrow className="w-16" /></p>
            <Link href="/web" className="mt-1 flex items-center justify-center gap-2 text-xs font-medium md:text-sm">Explore the web work<ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
          </div>
        </section>

        <section className="px-6 py-14 md:px-12 md:py-20" aria-labelledby="approach-title">
          <div className="mx-auto grid max-w-7xl gap-8 border-y border-crd-forest/20 py-12 md:grid-cols-2 md:gap-20 md:py-16">
            <h2 id="approach-title" className="font-serif text-3xl leading-tight tracking-tight md:text-4xl">Why a magazine designer makes better websites.</h2>
            <p className="max-w-xl text-lg leading-relaxed text-crd-forest/85">A magazine has to make sense of a lot of content, fast: what to lead with, what to cut and where to let a picture breathe. A website has the same job. I bring that discipline and years of print production to every publication, brand and site.</p>
          </div>
        </section>

        <SelectedWorkSection />
        <WebWorkSection />

        <section className="px-6 py-16 md:px-12 md:py-24" aria-labelledby="offer-title">
          <div className="mx-auto max-w-7xl">
            <h2 id="offer-title" className="mb-10 font-serif text-4xl tracking-tight md:text-5xl">Three ways to work together.</h2>
            <div className="grid gap-8 md:grid-cols-3">
              {offers.map((offer, index) => <article key={offer.title} className="border-t border-crd-forest/20 pt-6">
                <p className="mb-4 text-xs uppercase tracking-widest">0{index + 1}</p>
                <h3 className="font-serif text-3xl">{offer.title}</h3>
                <p className="mt-5 text-base leading-relaxed text-crd-forest/85 md:text-lg">{offer.body}</p>
                <Link href={offer.href} className="mt-6 inline-flex items-center gap-2 text-sm font-medium underline decoration-crd-gold underline-offset-4">{offer.proof}<ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
              </article>)}
            </div>
            <div className="mt-12 flex flex-wrap items-center gap-5">
              <Link href="/services" className="rounded-full border border-crd-forest/30 px-6 py-3 text-sm font-medium">Services & project scope</Link>
              <Link href={contactHref("Not sure yet")} className="border-b border-crd-gold pb-1 text-sm">Not sure where to start? Let's talk.</Link>
            </div>
          </div>
        </section>
        <ProjectFlow />
        <ContactCloseSection />
        <StudioPortal />
      </main>
      <SiteFooter />
    </div>
  );
}
