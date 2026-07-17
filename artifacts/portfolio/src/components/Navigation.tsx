import { useCallback, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useMobileMenuA11y } from "@/hooks/use-mobile-menu-a11y";

const navLinks = [
  { href: "/work", label: "Work" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();
  const close = useCallback(() => setOpen(false), []);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useMobileMenuA11y({ open, close, triggerRef, menuRef });

  return (
    <>
      <motion.nav
        className="fixed left-0 top-0 z-50 flex w-full items-center justify-between border-b border-crd-gold/25 bg-crd-parchment/85 px-6 py-3 backdrop-blur-sm md:px-12 md:py-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
      >
        <Link
          href="/"
          onClick={close}
          className="flex items-center transition-opacity duration-200 hover:opacity-80"
        >
          <img
            src="/logos/02_horizontal_lockup.svg"
            alt="Christopher Robin Design"
            className="h-12 w-auto md:h-14"
            width={133}
            height={56}
          />
        </Link>

        {/* Desktop links */}
        <div className="hidden gap-9 font-sans text-[0.7rem] uppercase tracking-[0.22em] text-crd-forest md:flex">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`crd-underline-sweep transition-colors hover:text-crd-gold ${
                location === href ? "text-crd-gold" : ""
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          ref={triggerRef}
          type="button"
          className="p-2 text-crd-forest md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </motion.nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            ref={menuRef}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-10 bg-crd-forest md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={close}
                className={`font-serif text-3xl text-crd-parchment transition-colors hover:text-crd-gold ${
                  location === href ? "text-crd-gold" : ""
                }`}
              >
                {label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/** Kept for backward-compat with ProjectDetail's inline nav */
export function Navigation() {
  return <SiteNav />;
}
