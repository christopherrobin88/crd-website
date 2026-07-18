import { motion } from "framer-motion";
import { useEffect } from "react";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { SiteNav } from "@/components/Navigation";
import { SiteFooter } from "@/components/SiteFooter";
import { QuoteBand } from "@/components/EditorialAtmosphere";
import { Picture } from "@/components/Picture";
import portrait from "@/assets/images/about/christopher-gara-portrait.webp?format=webp;jpg&as=picture";
import { usePageMeta } from "@/hooks/use-page-meta";
import { scrollNowTo } from "@/hooks/use-smooth-scroll";

export default function About() {
  usePageMeta("/about");
  useEffect(() => {
    scrollNowTo(0);
  }, []);

  return (
    <div className="min-h-screen text-foreground">
      <SiteNav />

      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-40 md:pt-52 pb-32">
        <motion.header
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 md:mb-24"
        >
          <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl tracking-tighter leading-[0.9]">
            About
          </h1>
        </motion.header>

        {/* Intro — copy on the left, portrait on the right; the person
            sits in its own matted frame like a Work cover, not stacked
            beneath the text it's introducing. */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-start">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="font-serif text-3xl md:text-5xl leading-tight mb-12 max-w-xl">
              Christopher Robin Design is a Cape Town-based creative studio
              focused on publication design, brand systems and practical
              design workflows.
            </div>

            <div className="space-y-6 font-sans text-base md:text-lg text-foreground/70 leading-relaxed max-w-md">
              <p>
                CRD works where craft and structure meet: editorial layouts,
                brand assets, campaign rollout, production-ready artwork and
                the systems that keep creative work moving cleanly.
              </p>
              <p>
                The studio is led by Christopher Gara, a Senior Art Director
                and Creative Director with seventeen years across editorial,
                retail and brand — from national magazine titles to
                high-volume campaign production.
              </p>
            </div>
          </motion.div>

          <motion.figure
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="mx-auto w-full max-w-sm md:mx-0"
          >
            <div className="border border-crd-gold/30 bg-crd-parchment/75 p-3 shadow-[0_18px_44px_-20px_rgba(14,35,32,0.35)] md:p-4">
              <Picture
                pic={portrait}
                alt="Christopher Gara, founder of Christopher Robin Design"
                className="h-auto w-full"
                sizes="(min-width: 768px) 24rem, 80vw"
                // Above the fold at desktop widths — the page's LCP candidate.
                loading="eager"
              />
            </div>
            <figcaption className="mt-4 font-sans text-xs uppercase tracking-[0.22em] text-crd-forest/70">
              Christopher Gara — Founder &amp; Creative Director
            </figcaption>
          </motion.figure>
        </div>

        {/* What drives the work / Disciplines / Based in — its own band,
            same hairline-and-pad rhythm as Craft/Systems below and the
            Work page's row dividers, instead of trailing off the intro grid. */}
        <section className="mt-24 md:mt-32 border-t border-crd-gold/20 pt-12 md:pt-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
            <div>
              <h2 className="font-sans text-xs uppercase tracking-[0.22em] text-crd-gold mb-6">
                What drives the work
              </h2>
              <ul className="space-y-4 font-sans text-base md:text-lg text-foreground/70">
                <li>
                  <span className="text-foreground">Strategy first.</span> Design
                  decisions rooted in purpose, not surface styling.
                </li>
                <li>
                  <span className="text-foreground">Craft matters.</span>{" "}
                  Typography, spacing and production detail are part of the value.
                </li>
                <li>
                  <span className="text-foreground">Built for use.</span> Work
                  that functions across print, digital and production.
                </li>
                <li>
                  <span className="text-foreground">Systems create consistency.</span>{" "}
                  Templates and workflows that help good design survive real
                  deadlines.
                </li>
                <li>
                  <span className="text-foreground">AI, without losing taste.</span>{" "}
                  AI and automation are used to scale craft and production
                  consistency, not replace taste.
                </li>
              </ul>
            </div>

            <div className="space-y-10">
              <div>
                <h2 className="font-sans text-xs uppercase tracking-[0.22em] text-crd-gold mb-6">
                  Disciplines
                </h2>
                <p className="font-sans text-base md:text-lg text-foreground/70 leading-relaxed">
                  Editorial design · Brand identity · Packaging &amp; retail · DTP
                  &amp; production · Creative direction · Production systems ·
                  AI-assisted workflows
                </p>
              </div>

              <div>
                <h2 className="font-sans text-xs uppercase tracking-[0.22em] text-crd-gold mb-6">
                  Based in
                </h2>
                <p className="font-sans text-base md:text-lg text-foreground/70">Cape Town, South Africa</p>
              </div>
            </div>
          </div>
        </section>

        {/* Craft / Systems — the two halves of how the studio works */}
        <section className="mt-24 md:mt-32 border-t border-crd-gold/20 pt-12 md:pt-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
            <div>
              <h2 className="font-sans text-xs uppercase tracking-[0.22em] text-crd-gold mb-4">
                Craft
              </h2>
              <p className="font-serif text-2xl md:text-3xl tracking-tight text-crd-forest mb-8 max-w-md">
                The discipline of the printed page.
              </p>
              <ul className="space-y-4 font-sans text-base md:text-lg text-foreground/70">
                <li>Visual direction with an editorial eye</li>
                <li>Publication design and layout systems</li>
                <li>Typography, hierarchy and pacing</li>
                <li>Brand detail carried through to final artwork</li>
              </ul>
              <p className="mt-8 font-sans text-base md:text-lg text-foreground/70 leading-relaxed max-w-md">
                Grids, rhythm and restraint — the habits of magazine design,
                applied to everything the studio touches.
              </p>
            </div>

            <div>
              <h2 className="font-sans text-xs uppercase tracking-[0.22em] text-crd-gold mb-4">
                Systems
              </h2>
              <p className="font-serif text-2xl md:text-3xl tracking-tight text-crd-forest mb-8 max-w-md">
                The structure that keeps it moving.
              </p>
              <ul className="space-y-4 font-sans text-base md:text-lg text-foreground/70">
                <li>Templates and master files built for reuse</li>
                <li>Workflow and production logic that hold under deadline</li>
                <li>Automation and AI-assisted production, scripted not improvised</li>
                <li>Scalable delivery across channels and formats</li>
              </ul>
              <p className="mt-8 font-sans text-base md:text-lg text-foreground/70 leading-relaxed max-w-md">
                At Ninety9Cents this meant Adobe-scripted automation for
                high-volume retail campaigns — fewer repetitive layout tasks,
                faster delivery, no drop in standard.
              </p>
            </div>
          </div>
        </section>

        {/* Closing editorial band — the page ends with somewhere to go */}
        <QuoteBand className="mt-24 md:mt-32">
          <div className="mx-auto max-w-xl text-center">
            <p className="font-serif text-2xl md:text-3xl tracking-tight text-crd-forest">
              Craft on the page. Systems behind it.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
              <Link
                href="/work"
                className="group inline-flex items-center gap-3 whitespace-nowrap border border-crd-forest/30 px-7 py-3.5 font-sans text-[0.7rem] uppercase tracking-[0.24em] text-crd-forest transition-colors duration-300 hover:border-crd-forest hover:bg-crd-forest hover:text-crd-parchment focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crd-gold focus-visible:ring-offset-2"
              >
                View the work
              </Link>
              <Link
                href="/contact"
                className="group inline-flex items-center gap-3 whitespace-nowrap bg-crd-forest px-7 py-3.5 font-sans text-[0.7rem] uppercase tracking-[0.24em] text-crd-parchment transition-colors duration-300 hover:bg-crd-moss focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crd-gold focus-visible:ring-offset-2"
              >
                Start a conversation
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </QuoteBand>
      </div>

      <SiteFooter />
    </div>
  );
}
