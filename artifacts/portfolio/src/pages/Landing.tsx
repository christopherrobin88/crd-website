import { useCallback, useRef, useState } from "react";
import { Link } from "wouter";
import { motion, useReducedMotion } from "framer-motion";
import { usePageMeta } from "@/hooks/use-page-meta";
import { useMobileMenuA11y } from "@/hooks/use-mobile-menu-a11y";
import { Leaf, Menu, X, ArrowRight } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { HeroLaptop } from "@/components/HeroLaptop";
import { MistBand } from "@/components/EditorialAtmosphere";
import {
  PositioningSection,
  SelectedWorkSection,
  ConnectedSystemsSection,
  ServicesTeaserSection,
  ContactCloseSection,
} from "@/components/home/HomeSections";

const navLinks = [
  { href: "/work", label: "Work" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const ease = [0.16, 1, 0.3, 1] as const;

export default function Landing() {
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const close = useCallback(() => setOpen(false), []);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useMobileMenuA11y({ open, close, triggerRef, menuRef });

  usePageMeta("/");

  return (
    <div className="relative min-h-[100dvh] overflow-x-clip text-crd-forest">
      {/* Lower-edge conifer/mist band, rises behind the contact close and footer */}
      <MistBand className="absolute inset-x-0 bottom-0 z-0 h-72 md:h-96" />

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col px-6 py-8 md:px-12 md:py-6">
        {/* ---- Header ---- */}
        <header className="flex items-start justify-between">
          <Link href="/" className="transition-opacity hover:opacity-80">
            <img
              src="/logos/01_crd_primary_lockup.svg"
              alt="Christopher Robin Design"
              className="h-28 w-auto sm:h-32 md:h-[7.5rem]"
              width={150}
              height={158}
            />
          </Link>

          <nav className="hidden items-center gap-9 pt-6 font-sans text-[0.7rem] uppercase tracking-[0.22em] text-crd-forest md:flex">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="crd-underline-sweep transition-colors hover:text-crd-gold"
              >
                {label}
              </Link>
            ))}
          </nav>

          <button
            ref={triggerRef}
            type="button"
            className="pt-6 text-crd-forest md:hidden"
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => setOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </header>

        {/* ---- Hero ---- */}
        <div
          data-hero-zone
          className="grid flex-1 items-center gap-10 py-10 md:grid-cols-12 md:gap-6 md:py-3"
        >
          {/* Left: editorial headline */}
          <motion.div
            initial={reduceMotion ? false : { y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease }}
            className="max-w-xl md:col-span-6"
          >
            <div className="mb-7 flex items-center gap-4">
              <span className="font-sans text-[0.7rem] font-medium uppercase tracking-[0.28em] text-crd-forest/80">
                Cape Town Design Studio
              </span>
              <span className="h-px w-16 bg-crd-gold/70" aria-hidden="true" />
            </div>

            <h1 className="hero-title">
              Design that <span className="hero-title-accent">grows</span> from
              strategy, craft and{" "}
              <span className="text-crd-moss">experience.</span>
            </h1>

            <p className="mt-6 max-w-md font-sans text-base leading-relaxed text-crd-forest/85 md:text-lg">
              Editorial design, brand systems and production workflows for
              agencies, brands and creative teams that need craft,
              consistency and speed.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Link
                href="/work"
                className="group crd-lift inline-flex items-center gap-3 whitespace-nowrap bg-crd-forest px-8 py-4 font-sans text-[0.7rem] uppercase tracking-[0.24em] text-crd-parchment hover:bg-crd-moss focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crd-gold focus-visible:ring-offset-2"
              >
                View Selected Work
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                href="/contact"
                className="group inline-flex items-center gap-3 whitespace-nowrap font-sans text-[0.7rem] uppercase tracking-[0.24em] text-crd-forest underline decoration-crd-gold/60 underline-offset-8 transition-colors duration-300 hover:text-crd-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crd-gold focus-visible:ring-offset-2"
              >
                Start a Conversation
              </Link>
            </div>
          </motion.div>

          {/* Right: botanical laptop illustration, GSAP-animated.
              Scale per the mockup: it anchors the right half of the hero. */}
          <div className="md:col-span-6">
            <div className="relative">
              {/* Soft ground plane — elliptical mist/shadow beneath the laptop base */}
              <div
                aria-hidden="true"
                className="absolute bottom-[4%] left-1/2 h-12 w-[70%] -translate-x-1/2 rounded-[100%] bg-[radial-gradient(50%_50%_at_50%_50%,rgba(14,35,32,0.16),rgba(14,35,32,0.06)_55%,transparent_78%)] blur-md md:h-16"
              />
              {/* Width cap keeps the illustration's height inside a 1280x800
                  fold — uncapped it ran ~820px tall and pushed the CTA below
                  the viewport. */}
              <HeroLaptop className="relative mx-auto w-full max-w-md md:max-w-[30rem] lg:max-w-[34rem]" />
            </div>
          </div>
        </div>

      </div>

      {/* ---- Homepage sections below the hero (Phase 1 extension) ---- */}
      <main className="relative z-10">
        <PositioningSection />
        <SelectedWorkSection />
        <ConnectedSystemsSection />
        <ServicesTeaserSection />
        <ContactCloseSection />
      </main>

      {/* ---- Footer tagline ---- */}
      <footer className="relative z-10 flex flex-col items-center gap-3 px-6 pb-8 pt-10">
        <Leaf className="h-4 w-4 text-crd-moss" aria-hidden="true" />
        <p className="font-sans text-[0.7rem] uppercase tracking-[0.24em] text-crd-forest/70 text-center">
          Design with purpose.
          <span className="mx-2 text-crd-gold">•</span>
          Crafted with care.
        </p>
        <p className="font-sans text-[0.7rem] text-crd-forest/70 text-center">
          © 2026 Christopher Robin Design. Cape Town.
        </p>
      </footer>

      {/* ---- Mobile menu ---- */}
      <AnimatePresence>
        {open && (
          <motion.div
            ref={menuRef}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-10 bg-crd-forest md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <button
              type="button"
              className="absolute right-6 top-7 text-crd-parchment"
              aria-label="Close menu"
              onClick={close}
            >
              <X className="h-6 w-6" />
            </button>
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={close}
                className="font-serif text-3xl text-crd-parchment transition-colors hover:text-crd-gold"
              >
                {label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
