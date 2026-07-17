import { motion } from "framer-motion";
import { useEffect } from "react";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { SiteNav } from "@/components/Navigation";
import { SiteFooter } from "@/components/SiteFooter";
import { Fleck, QuoteBand, Sprig } from "@/components/EditorialAtmosphere";
import { ProcessTimeline, type TimelineStep } from "@/components/diagrams/ProcessTimeline";
import { AutomationArchitecture } from "@/components/diagrams/AutomationArchitecture";
import { usePageMeta } from "@/hooks/use-page-meta";
import { contactHref, type ProjectType } from "@/lib/enquiry";
import { scrollNowTo } from "@/hooks/use-smooth-scroll";

const services = [
  {
    title: "Editorial Design",
    body: "Magazine design, publication systems, page layouts, covers, feature design, templates and production-ready editorial files.",
    enquiryType: "Publication design",
  },
  {
    title: "Brand Identity",
    body: "Logo design, identity systems, colour palettes, typography, usage rules, brand applications and visual refreshes.",
    enquiryType: "Brand identity",
  },
  {
    title: "Packaging & Retail",
    body: "Packaging concepts, retail marketing, POS, shopper-facing layouts, campaign artwork and product communication.",
    enquiryType: "Packaging or POS",
  },
  {
    title: "DTP & Production",
    body: "Rollout, layout adaptation, pre-press, artwork preparation, corrections, file setup and technical production support.",
    enquiryType: "Campaign / rollout design",
  },
  {
    title: "Creative Direction",
    body: "Concept development, visual direction, design refinement, campaign thinking and brand system development.",
    enquiryType: "Creative direction",
  },
  {
    title: "Production Systems",
    body: "Templates, workflow improvement, automated document systems and AI design tools that improve consistency, reduce manual production drag and speed up delivery.",
    enquiryType: "Automation / workflow system",
  },
] satisfies { title: string; body: string; enquiryType: ProjectType }[];

const systemSteps: TimelineStep[] = [
  {
    title: "Define",
    body: "Strategy, brief clarity, positioning and brand direction.",
    deliverables: ["Structured brief", "Positioning notes", "Scope and schedule"],
  },
  {
    title: "Design",
    body: "Identity, publication design, campaign concepts and layouts.",
    deliverables: ["Concept routes", "Approved layouts", "Design system foundations"],
  },
  {
    title: "Produce",
    body: "DTP, rollout, packaging, POS and production-ready artwork.",
    deliverables: ["Print-ready files", "Rollout adaptations", "Pre-press checks"],
  },
  {
    title: "Systemise",
    body: "Templates, workflows, automation and repeatable design systems.",
    deliverables: ["Working templates", "Automated workflows", "Usage rules"],
  },
  {
    title: "Support",
    body: "Refinement, updates, handover and ongoing creative support.",
    deliverables: ["Updates and refinements", "Handover documentation", "Ongoing support"],
  },
];

const entryPoints = [
  { label: "I need a brand built", enquiryType: "Brand identity" },
  { label: "I need a publication designed", enquiryType: "Publication design" },
  { label: "I need campaign material rolled out", enquiryType: "Campaign / rollout design" },
  { label: "I need a website or portfolio system", enquiryType: "Website or portfolio" },
  { label: "I need my design process cleaned up", enquiryType: "Automation / workflow system" },
] satisfies { label: string; enquiryType: ProjectType }[];

export default function Services() {
  usePageMeta("/services");
  useEffect(() => {
    scrollNowTo(0);
  }, []);

  return (
    <div className="min-h-screen text-foreground">
      <SiteNav />

      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-40 md:pt-52 pb-32">
        <motion.h1
          className="font-serif text-6xl md:text-8xl lg:text-9xl tracking-tighter leading-[0.9] mb-8 md:mb-10 flex items-start gap-5 md:gap-8"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          Services
          <span aria-hidden="true" className="relative mt-2 shrink-0 md:mt-3">
            <Sprig
              variant="corner"
              className="w-16 -scale-x-100 rotate-[14deg] opacity-90 md:w-24"
            />
            <Fleck className="absolute -right-2 -top-1 h-2.5 w-2.5 md:h-3 md:w-3" />
          </span>
        </motion.h1>

        <motion.p
          className="font-sans text-lg md:text-xl text-foreground/70 leading-relaxed max-w-xl mb-16 md:mb-24"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Strategic, creative and production solutions for brands, publications,
          packaging and retail environments.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {services.map((svc, i) => (
            <div
              key={svc.title}
              className="border-t border-border py-10 md:py-14 md:pr-24"
            >
              <div className="font-sans text-xs font-medium uppercase tracking-widest text-crd-forest/70 mb-4">
                0{i + 1}
              </div>
              <h2 className="font-serif text-3xl md:text-4xl tracking-tight mb-4">
                {svc.title}
              </h2>
              <p className="font-sans text-base md:text-lg text-foreground/60 leading-relaxed max-w-md">
                {svc.body}
              </p>
              <Link
                href={contactHref(svc.enquiryType)}
                className="group mt-6 inline-flex items-center gap-2 font-sans text-[0.7rem] uppercase tracking-[0.22em] text-crd-forest/70 transition-colors hover:text-crd-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crd-gold focus-visible:ring-offset-2 whitespace-nowrap"
              >
                Start an enquiry
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          ))}
        </div>

        {/* The CRD Creative System — the connective idea behind the services */}
        <section className="mt-28 md:mt-40" aria-labelledby="crd-system-heading">
          <h2
            id="crd-system-heading"
            className="font-serif text-4xl md:text-5xl tracking-tight mb-6"
          >
            The CRD Creative System
          </h2>
          <p className="font-sans text-base md:text-lg text-foreground/70 leading-relaxed max-w-2xl mb-14 md:mb-16">
            Most projects do not fail because of one bad design decision. They
            become messy when the thinking, design, production and handover are
            disconnected. CRD is built to keep those parts moving together —
            one working system from idea to finished output.
          </p>

          {/* Connective flow — the timeline diagram draws its gold thread
              through the five stages; each stage expands to its handover. */}
          <ProcessTimeline steps={systemSteps} />
        </section>

        {/* Inside the automation — how the Production Systems service
            actually moves a job from client to delivery */}
        <section className="mt-24 md:mt-32" aria-labelledby="automation-arch-heading">
          <h2
            id="automation-arch-heading"
            className="font-serif text-4xl md:text-5xl tracking-tight mb-6"
          >
            From client to delivery, one connected line.
          </h2>
          <p className="font-sans text-base md:text-lg text-foreground/70 leading-relaxed max-w-2xl mb-12 md:mb-14">
            Automation at CRD is not a black box. Every job moves along the
            same line, and nothing ships without passing the checkpoint.
          </p>
          <AutomationArchitecture />
        </section>

        {/* Entry points — quick client self-recognition, each leading to contact */}
        {/* The label stays here: it is an instruction for the buttons below,
            not decoration, and it is this section's actual heading. */}
        <section className="mt-24 md:mt-32" aria-labelledby="entry-points-heading">
          <h2
            id="entry-points-heading"
            className="font-sans text-xs uppercase tracking-[0.22em] text-crd-gold mb-8 flex items-center gap-4"
          >
            <span className="w-12 h-[1px] bg-crd-gold block" aria-hidden="true" />
            Choose your entry point
          </h2>
          <div className="flex flex-wrap gap-3 md:gap-4">
            {entryPoints.map(({ label, enquiryType }) => (
              <Link
                key={label}
                href={contactHref(enquiryType)}
                className="group crd-lift inline-flex items-center gap-3 border border-crd-gold/40 bg-crd-parchment/60 px-5 py-3.5 font-sans text-sm text-crd-forest hover:border-crd-gold hover:bg-crd-parchment/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crd-gold focus-visible:ring-offset-2"
              >
                {label}
                <ArrowRight className="h-4 w-4 text-crd-gold transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        </section>

        {/* Closing editorial moment — quote over the misty treeline */}
        <QuoteBand className="mt-24 md:mt-32">
          <blockquote className="mx-auto max-w-lg text-center">
            <p className="font-serif text-xl italic leading-relaxed text-crd-forest md:text-2xl">
              &ldquo;Design is not just what it looks like and feels like.
              <br className="hidden md:block" /> Design is how it works.&rdquo;
            </p>
            <cite className="mt-4 block font-sans text-xs font-medium not-italic uppercase tracking-widest text-crd-forest/70">
              Steve Jobs
            </cite>
          </blockquote>
        </QuoteBand>
      </div>
      <SiteFooter />
    </div>
  );
}
