import { useEffect, useRef, useState } from "react";
import { SketchLine } from "@/components/SketchLine";
import { createPortal } from "react-dom";
import { ArrowUpRight } from "lucide-react";
import { gsap, prefersReducedMotion } from "@/lib/motion";

const STUDIO_URL = "https://christopherrobin.studio/";

export function StudioPortal() {
  const overlay = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const motion = useRef<gsap.core.Timeline | null>(null);
  const [entering, setEntering] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const reset = () => {
      if (timer.current) clearTimeout(timer.current);
      motion.current?.kill();
      document.documentElement.classList.remove("crd-changing-channel");
      if (overlay.current) gsap.set(overlay.current, { opacity: 0, visibility: "hidden" });
      if (overlay.current) gsap.set(overlay.current.querySelector(".crd-channel-colour"), { opacity: 0 });
      setEntering(false);
    };
    window.addEventListener("pageshow", reset);
    return () => {
      window.removeEventListener("pageshow", reset);
      if (timer.current) clearTimeout(timer.current);
      motion.current?.kill();
      document.documentElement.classList.remove("crd-changing-channel");
    };
  }, []);

  function enter(event: React.MouseEvent<HTMLAnchorElement>) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0 || prefersReducedMotion()) return;
    event.preventDefault();
    if (entering) return;
    setEntering(true);
    document.documentElement.classList.add("crd-changing-channel");
    // A fixed deadline keeps the actual link working if an animation stalls.
    timer.current = setTimeout(() => window.location.assign(STUDIO_URL), 1250);
    if (overlay.current) {
      motion.current = gsap.timeline()
        .set(overlay.current, { visibility: "visible" })
        .to(overlay.current, { opacity: 1, duration: 0.3, ease: "power1.in" })
        .to(overlay.current.querySelector(".crd-channel-colour"), { opacity: 1, duration: 0.6, ease: "power2.in" }, 0.55);
    }
  }

  return (
    <>
      <section className="px-6 py-16 md:px-12 md:py-24" aria-labelledby="studio-portal-title">
        <div className="mx-auto grid max-w-7xl items-center gap-8 border-y border-crd-forest/20 py-12 md:grid-cols-[1.3fr_1fr] md:gap-20 md:py-16">
          <div>
            <p className="mb-5 text-xs uppercase tracking-[0.2em]">Christopher, after hours</p>
            <h2 id="studio-portal-title" className="max-w-xl font-serif text-4xl leading-tight tracking-tight md:text-5xl">Want to see the other side?</h2><SketchLine className="mt-3 w-48" />
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-crd-forest/85">Films, favourite tools and a few experiments. A different room, with the same curiosity.</p>
          </div>
          <a href={STUDIO_URL} onClick={enter} aria-disabled={entering || undefined}
            className="group inline-flex w-fit items-center gap-4 rounded-full border border-crd-forest/40 px-7 py-4 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-crd-forest">
            {entering ? "Changing channels…" : "Step into the Studio"}<ArrowUpRight className="h-5 w-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none" aria-hidden="true" />
          </a>
        </div>
      </section>
      {mounted && createPortal(<div ref={overlay} className="crd-channel-overlay" aria-hidden="true">
        <svg className="crd-tv-noise" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <filter id="crd-tv-grain"><feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="3" stitchTiles="stitch" /><feColorMatrix type="saturate" values="0" /></filter>
          <rect width="100%" height="100%" filter="url(#crd-tv-grain)" />
        </svg>
        <div className="crd-tv-scanlines" />
        <div className="crd-channel-colour" />
        <span className="crd-channel-label">CH / 02<br />CHRISTOPHER'S STUDIO</span>
      </div>, document.body)}
    </>
  );
}
