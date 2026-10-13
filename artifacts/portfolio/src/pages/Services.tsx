import { useEffect } from "react";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { SiteNav } from "@/components/Navigation";
import { ProjectFlow } from "@/components/ProjectFlow";
import { PricingPackages } from "@/components/PricingPackages";
import { SiteFooter } from "@/components/SiteFooter";
import { usePageMeta } from "@/hooks/use-page-meta";
import { scrollNowTo } from "@/hooks/use-smooth-scroll";
import { contactHref, type ProjectType } from "@/lib/enquiry";

const services: { title: string; body: string; deliverables: string[]; enquiryType: ProjectType; work: string; example: string }[] = [
  { title: "Editorial design", body: "For publications that need a strong visual voice and a dependable production partner. From a single report to a recurring magazine, the design serves the content and holds together from cover to final page.", deliverables: ["Publication concept and visual direction", "Layout, typography and editorial systems", "Image treatment and print-ready artwork"], enquiryType: "Publication design", work: "/project/kruger-magazine", example: "Kruger Magazine" },
  { title: "Branding", body: "For businesses that need a distinct, coherent identity. A considered mark is the starting point; the typography, colour and applications give it a life beyond the logo.", deliverables: ["Identity direction and logo system", "Typography, colour and usage guidelines", "Print and digital brand applications"], enquiryType: "Brand identity", work: "/project/behelm", example: "Behelm logo system study" },
  { title: "Websites", body: "For artists, makers and businesses ready to present their work clearly online. Content, design and the visitor's path are considered together, with layouts that work across desktop and mobile.", deliverables: ["Site structure and content direction", "Responsive website design and build", "Portfolio, gallery or enquiry journeys"], enquiryType: "Website or portfolio", work: "/web", example: "Riette Gara & Made by Mike" },
];

export default function Services() {
  usePageMeta("/services");
  useEffect(() => scrollNowTo(0), []);
  return (
    <div className="min-h-screen text-crd-forest">
      <SiteNav />
      <main className="mx-auto max-w-7xl px-6 pb-24 pt-36 md:px-12 md:pt-44">
        <header className="mb-14 max-w-3xl md:mb-20">
          <p className="mb-5 text-xs uppercase tracking-[0.22em]">The CRD offer</p>
          <h1 className="font-serif text-5xl leading-[1.08] tracking-tight md:text-7xl">Editorial design.<br />Branding. Websites.</h1>
          <p className="mt-7 max-w-xl text-lg leading-relaxed text-crd-forest/85">Independent design support for publications, brands and agencies. Clear thinking, considered craft and the experience to get the work delivered.</p>
          <a href="#packages" className="mt-6 inline-flex min-h-11 items-center gap-2 border-b border-crd-gold text-sm font-medium">Explore packages & fees<ArrowRight className="h-4 w-4" aria-hidden="true" /></a>
        </header>
        <div>
          {services.map((service, index) => <section key={service.title} className="grid gap-8 border-t border-crd-forest/20 py-10 md:grid-cols-[1fr_1.5fr] md:gap-20 md:py-14">
            <div><p className="mb-4 text-xs tracking-widest">0{index + 1}</p><h2 className="font-serif text-4xl tracking-tight md:text-5xl">{service.title}</h2></div>
            <div>
              <p className="max-w-2xl text-lg leading-relaxed text-crd-forest/85">{service.body}</p>
              <ul className="mt-6 space-y-3 text-base leading-relaxed">{service.deliverables.map((item) => <li key={item} className="flex gap-3"><span aria-hidden="true" className="text-crd-forest">+</span>{item}</li>)}</ul>
              <div className="mt-7 flex flex-wrap items-center gap-x-7 gap-y-4">
                <Link href={contactHref(service.enquiryType)} className="inline-flex items-center gap-2 rounded-full bg-crd-forest px-6 py-3 text-sm font-medium text-crd-parchment">Discuss a project<ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
                <Link href={service.work} className="border-b border-crd-gold pb-1 text-sm">See {service.example}</Link>
              </div>
            </div>
          </section>)}
        </div>
        <PricingPackages />
        <section className="mt-16 grid gap-6 border-t border-crd-forest/20 pt-10 md:grid-cols-2 md:gap-16">
          <h2 className="font-serif text-3xl tracking-tight md:text-4xl">Craft, through to delivery.</h2>
          <p className="text-lg leading-relaxed text-crd-forest/85">The work begins with a conversation and a brief, then moves through direction, design and review to a considered handover. Print production, campaign rollout and ongoing editorial support can be included where the project needs them.</p>
        </section>
        <div className="-mx-6 md:-mx-12"><ProjectFlow /></div>
      </main>
      <SiteFooter />
    </div>
  );
}
