import type { CSSProperties } from "react";
import { Maximize2 } from "lucide-react";
import { Picture } from "./Picture";
import type { Pic } from "./Picture";

// Full two-page-spread aspect ratio (width / height) per project, derived
// from measured sample page dimensions in `src/assets/new images` (not
// guessed — see content-flow brief Phase 4). Publications differ enough
// that a single shared ratio visibly mis-crops some of them: Playboy's
// pages run notably taller/narrower than Checkers' leaflets.
const SPREAD_ASPECT_RATIOS: Record<string, number> = {
  "uncut-magazine": 2482 / 1625, // 1241x1625 per page (Spread_01/02.jpg)
  "kruger-magazine": 1536 / 1006, // 768x1006 per page (Spread01_PageL/R.jpg)
  "playboy-south-africa": 4400 / 3111, // 2200x3111 per page
  "checkers-retail": 2654 / 1536, // 1327x1536 per page
  "agriprobe": 2644 / 1889, // 1322x1889 per page (Vol21 spreads; Vol20's 1338x1929 is within 1%)
  "real-estate-investor": 1984 / 1388, // 992x1388 per page
};
const FALLBACK_ASPECT_RATIO = 1.5;

export function getSpreadAspectRatio(slug: string): number {
  const ratio = SPREAD_ASPECT_RATIOS[slug];
  if (ratio === undefined) {
    console.warn(`DoubleSpread: no configured aspect ratio for "${slug}" — using fallback ${FALLBACK_ASPECT_RATIO}.`);
    return FALLBACK_ASPECT_RATIO;
  }
  return ratio;
}

interface DoubleSpreadProps {
  left: Pic;
  right: Pic;
  alt: string;
  aspectRatio: number;
  onOpenLeft?: () => void;
  onOpenRight?: () => void;
}

/**
 * Composites two single-page exports into one spread at render time.
 * Never accepts a pre-merged flat spread image — see CLAUDE.md Section 3.
 * Side-by-side on desktop, stacked top-to-bottom on narrow viewports
 * (spreads can't sit side-by-side on mobile).
 *
 * Framing (border/shadow) and inter-block spacing are the caller's
 * responsibility (ProjectContentFlow groups spreads into one shared card so
 * consecutive pages of an article read as one object) — this component only
 * owns the two-page composite and its own hover/click affordance.
 */
export function DoubleSpread({
  left,
  right,
  alt,
  aspectRatio,
  onOpenLeft,
  onOpenRight,
}: DoubleSpreadProps) {
  const style = {
    "--spread-ratio": String(aspectRatio),
    "--spread-ratio-mobile": String(aspectRatio / 4),
  } as CSSProperties;

  return (
    <div
      className="relative flex w-full flex-col bg-muted [aspect-ratio:var(--spread-ratio-mobile)] md:flex-row md:[aspect-ratio:var(--spread-ratio)]"
      style={style}
    >
      <SpreadHalf pic={left} alt={`${alt} — left page`} onOpen={onOpenLeft} sizes="(min-width: 768px) 50vw, 100vw" />
      <SpreadHalf pic={right} alt={`${alt} — right page`} onOpen={onOpenRight} sizes="(min-width: 768px) 50vw, 100vw" />

      {/* Gutter shadow — the two exports are separate files with no
          knowledge of each other; this sells them as one open spread. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-6 -translate-x-1/2 bg-gradient-to-r from-black/10 via-transparent to-black/10 md:block"
      />
    </div>
  );
}

function SpreadHalf({
  pic,
  alt,
  onOpen,
  sizes,
}: {
  pic: Pic;
  alt: string;
  onOpen?: () => void;
  sizes: string;
}) {
  const interactive = Boolean(onOpen);
  return (
    <button
      type="button"
      onClick={onOpen}
      disabled={!interactive}
      aria-label={interactive ? `Open ${alt} full size` : undefined}
      className="group relative h-1/2 w-full appearance-none overflow-hidden border-0 bg-transparent p-0 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-crd-gold focus-visible:outline-offset-2 disabled:cursor-default md:h-full md:w-1/2"
    >
      <Picture
        pic={pic}
        alt={alt}
        className="h-full w-full object-cover motion-safe:transition-transform motion-safe:duration-700 motion-safe:ease-out motion-safe:group-hover:scale-[1.03]"
        sizes={sizes}
      />
      {interactive && (
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-crd-forest/0 opacity-0 transition-all duration-300 group-hover:bg-crd-forest/10 group-hover:opacity-100">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-crd-parchment/90 text-crd-forest">
            <Maximize2 className="h-4 w-4" />
          </span>
        </span>
      )}
    </button>
  );
}
