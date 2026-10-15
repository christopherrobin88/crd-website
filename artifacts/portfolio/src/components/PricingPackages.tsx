import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { SketchLine } from "@/components/SketchLine";
import { servicePackages } from "@/data/service-packages";
import { contactHref } from "@/lib/enquiry";

export function PricingPackages() {
  return (
    <section id="packages" className="mt-12 scroll-mt-32 border-t border-crd-forest/20 pt-10 md:pt-14" aria-labelledby="packages-title">
      <div className="mb-9 grid gap-6 md:grid-cols-2 md:gap-16">
        <div>
          <p className="mb-4 text-xs uppercase tracking-[0.2em]">Packages & starting fees</p>
          <h2 id="packages-title" className="font-serif text-4xl leading-tight tracking-tight md:text-5xl">A place to start.</h2>
          <SketchLine className="mt-3 w-40 text-crd-forest" />
        </div>
        <p className="self-center text-base leading-relaxed text-crd-forest/85 md:text-lg">Four ways to work together. Choose a starting point and I’ll shape the scope around your brief, with a clear project fee agreed before work begins.</p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {servicePackages.map((item, index) => {
          const web = item.id === "website";
          return (
            <article key={item.id} aria-labelledby={`package-${item.id}`} className={`flex min-w-0 flex-col rounded-[3px_8px_4px_6px] border p-6 ${web ? "border-crd-forest bg-crd-forest text-crd-parchment" : "border-crd-forest/25 bg-crd-parchment/60"}`}>
              <p className="mb-6 text-xs uppercase tracking-[0.18em]">0{index + 1} / {web ? "Design & build" : "Project package"}</p>
              <h3 id={`package-${item.id}`} className="font-serif text-[1.75rem] leading-tight tracking-tight">{item.title}</h3>
              <p className="mt-4 text-sm">Starting from<span className="mt-1 block whitespace-nowrap font-serif text-4xl leading-tight tracking-tight">{item.price}</span><span className="mt-1 block text-xs">Once-off project fee</span></p>
              <p className="mt-5 text-base leading-relaxed xl:min-h-[4.5rem]">{item.description}</p>
              <ul className={`mb-8 mt-6 space-y-4 border-t pt-6 text-sm leading-relaxed ${web ? "border-crd-parchment/25" : "border-crd-forest/20"}`}>
                {item.includes.map((detail) => <li key={detail} className="flex gap-2"><span aria-hidden="true">+</span><span>{detail}</span></li>)}
              </ul>
              <Link href={`${contactHref(item.enquiryType)}&package=${item.id}`} className={`mt-auto inline-flex min-h-11 items-center justify-between gap-2 border-t pt-4 text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 ${web ? "border-crd-parchment/40" : "border-crd-forest/30"}`}>{item.action}<ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" /></Link>
            </article>
          );
        })}
      </div>
      <div className="mt-7 grid gap-4 text-sm leading-relaxed text-crd-forest/85 md:grid-cols-2 md:gap-16">
        <p>Prices are in South African rand. Each package includes two consolidated rounds of refinements to the agreed direction. Final fees depend on your content, complexity and timeline. Larger publications and recurring editorial work are quoted individually.</p>
        <p>You supply the copy and images. Copywriting, photography, printing and paid assets are quoted separately. Website packages cover portfolio and business sites; shops, bookings and custom integrations need a separate scope. Domains, hosting and ongoing maintenance are separate.</p>
      </div>
      <Link href="/contact" className="mt-6 inline-flex min-h-11 items-center gap-2 border-b border-crd-gold text-sm font-medium">Have something else in mind? Let’s talk<ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
    </section>
  );
}
