import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/motion";

let lenis: Lenis | null = null;

/**
 * Jump the page to a position immediately, through Lenis when it is running
 * so its internal target stays in sync, natively otherwise (reduced motion).
 * Scroll management on route changes lives with the pages: each page scrolls
 * to top on mount, and the Work page restores its saved position instead
 * (see use-work-return.ts).
 */
export function scrollNowTo(y: number) {
  if (lenis) {
    lenis.scrollTo(y, { immediate: true, force: true });
  } else {
    window.scrollTo(0, y);
  }
}

/**
 * Site-wide inertial smooth scroll. Lenis and GSAP share one scroll source:
 * Lenis runs off the GSAP ticker and pushes updates into ScrollTrigger, so
 * scroll-driven animation stays in sync with the eased scroll position.
 * No-ops under prefers-reduced-motion (native scrolling remains).
 */
export function useSmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    lenis = new Lenis({ lerp: 0.12 });
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis?.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis?.destroy();
      lenis = null;
    };
  }, []);
}
