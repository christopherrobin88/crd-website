import { useEffect, useRef } from "react";
import { Link } from "wouter";

/**
 * The nav logo with Christopher's "living tree": it sways once, leans away
 * from the pointer and lets a leaf go now and then. The behaviour lives in
 * /credit/crd-credit.js (the same kit used for the "Developed by" credit on
 * client sites), loaded after hydration so it costs nothing up front. Until
 * it arrives, and under prefers-reduced-motion, the static lockup is shown.
 */

type Handle = { destroy: () => void };
declare global {
  interface Window {
    CRDCredit?: { mount: (link: HTMLElement, options?: { intro?: boolean }) => Handle };
  }
}

const SCRIPT = "/credit/crd-credit.js";
let loading: Promise<void> | null = null;
// The scroll-in sway and falling leaves play once per visit, not on every page change.
let introPlayed = false;

function loadKit() {
  loading ??= new Promise<void>((resolve, reject) => {
    if (window.CRDCredit) return resolve();
    const script = document.createElement("script");
    script.src = SCRIPT;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("crd-credit.js failed to load"));
    document.head.appendChild(script);
  });
  return loading;
}

export function LivingLogo({ onClick }: { onClick?: () => void }) {
  const link = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const node = link.current;
    if (!node) return;
    let handle: Handle | undefined;
    let cancelled = false;
    loadKit().then(() => {
      if (cancelled || !window.CRDCredit) return;
      handle = window.CRDCredit.mount(node, { intro: !introPlayed });
      introPlayed = true;
    }).catch(() => { /* static logo stays */ });
    return () => { cancelled = true; handle?.destroy(); };
  }, []);

  return (
    <Link
      ref={link}
      href="/"
      onClick={onClick}
      aria-label="Christopher Robin Design, home"
      data-crd-src="/credit/crd-tree.svg"
      className="crd-living-logo flex items-center transition-opacity duration-200 hover:opacity-80"
    >
      <img
        src="/logos/02_horizontal_lockup.svg"
        alt=""
        className="h-12 w-auto md:h-14"
        width={133}
        height={56}
      />
    </Link>
  );
}
