import { useEffect, useRef, useState } from "react";

/**
 * Shared behaviour for the CRD diagram language (see FlowSystemDiagram,
 * ProcessTimeline, AutomationArchitecture, JourneyRail). Diagrams animate
 * once on first view via CSS transitions; nothing here drives continuous
 * motion — ambient loops live in index.css under `crd-diagram-*` and are
 * disabled by prefers-reduced-motion there.
 */

/** True once the node has entered the viewport (fires once, then sticks). */
export function useInViewOnce<T extends Element>(rootMargin = "0px 0px -12% 0px") {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0, rootMargin },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin]);

  return { ref, inView };
}

/** Mirrors the prefers-reduced-motion media query as React state. */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!mq) return;
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
}
