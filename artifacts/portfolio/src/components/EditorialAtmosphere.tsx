import type { CSSProperties, ReactNode } from "react";
import bgTexture from "@/assets/images/web_background.webp";
import foliageCorner from "@/assets/images/foliage_corner.webp";
import foliageLeft from "@/assets/images/foliage_left.webp";

/**
 * Static editorial atmosphere pieces — the lower-edge misty treeline band,
 * botanical sprig accents and gold flecks from the approved landing mockup.
 * All decorative, all pointer-transparent, none animated. The treeline is
 * the bottom slice of the same approved texture SiteBackground composites,
 * cropped via background-position rather than a new asset.
 */

const treelineSlice: CSSProperties = {
  backgroundImage: `url(${bgTexture})`,
  backgroundSize: "cover",
  backgroundPosition: "center bottom",
};

/** Soft conifer/mist band that fades upward into the page. Size via className. */
export function MistBand({ className = "" }: { className?: string }) {
  const fade = "linear-gradient(to top, black 45%, transparent 100%)";
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none select-none ${className}`}
    >
      <div
        className="h-full w-full opacity-80 mix-blend-multiply"
        style={{ ...treelineSlice, maskImage: fade, WebkitMaskImage: fade }}
      />
    </div>
  );
}

/** Framed closing panel over the misty treeline — quote bands and CTA strips. */
export function QuoteBand({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative overflow-hidden border border-crd-gold/25 ${className}`}>
      <div aria-hidden="true" className="absolute inset-0" style={treelineSlice} />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-crd-parchment/70 via-crd-parchment/25 to-transparent"
      />
      <div className="relative z-10 px-6 py-14 md:px-12 md:py-20">{children}</div>
    </div>
  );
}

/** Watercolour sprig accent, cropped from the approved mockup. Static. */
export function Sprig({
  variant = "corner",
  className = "",
}: {
  variant?: "corner" | "stem";
  className?: string;
}) {
  return (
    <img
      src={variant === "corner" ? foliageCorner : foliageLeft}
      alt=""
      aria-hidden="true"
      loading="lazy"
      className={`pointer-events-none select-none ${className}`}
    />
  );
}

/** Small static four-point gold fleck, matching the hero's accent marks. */
export function Fleck({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={`pointer-events-none fill-crd-gold ${className}`}
    >
      <path d="M12 0c.9 6.6 5.4 11.1 12 12-6.6.9-11.1 5.4-12 12-.9-6.6-5.4-11.1-12-12C6.6 11.1 11.1 6.6 12 0z" />
    </svg>
  );
}
