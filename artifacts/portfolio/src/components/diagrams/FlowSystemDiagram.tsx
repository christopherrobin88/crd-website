import { useState } from "react";
import { useInViewOnce, usePrefersReducedMotion } from "./hooks";

/**
 * Signature homepage diagram — the CRD Design System as a living flow.
 * Drawn in the site's editorial hand (hairline organic beziers, tracked
 * labels, dashed serif hub — same language the retired
 * ConnectedSystemsDiagram established; see docs/known-issues.md for why
 * boxes-and-arrows were rejected).
 *
 * Motion, all decorative and restrained:
 * - entrance: each stem draws in once on first view (CSS stroke-dashoffset
 *   transition against pathLength=1), labels fade after their stem;
 * - ambient: SMIL pulse dots travel the stems and the hub's dashed ring
 *   drifts (index.css `crd-diagram-hub-ring`) — both dropped entirely for
 *   reduced-motion users, who get the finished static drawing;
 * - hover/focus: pointing at any input or output isolates its route —
 *   other stems recede, the hub holds.
 *
 * Below md the beziers don't survive reflow, so the same content renders
 * as the established typographic list fallback.
 */

const INPUTS = [
  { label: "BRIEF", y: 76, d: "M128,76 C195,80 236,130 272,158" },
  { label: "BRAND ASSETS", y: 156, d: "M128,156 C190,156 225,172 254,182" },
  { label: "CONTENT", y: 236, d: "M128,236 C190,234 228,220 256,210" },
  { label: "CLIENT FEEDBACK", y: 316, d: "M128,316 C195,300 236,262 275,236" },
];

const OUTPUTS = [
  { label: "PRINT", y: 36, d: "M333,150 C392,115 450,70 496,36" },
  { label: "DIGITAL", y: 102, d: "M358,168 C408,148 452,120 496,102" },
  { label: "CAMPAIGN", y: 168, d: "M367,186 C410,180 452,172 496,168" },
  { label: "SOCIAL", y: 234, d: "M368,204 C412,214 452,226 496,234" },
  { label: "PACKAGING", y: 300, d: "M358,224 C408,250 452,278 496,300" },
  { label: "EDITORIAL", y: 366, d: "M333,242 C392,285 450,330 496,366" },
];

const HUB = { cx: 310, cy: 196, rx: 58, ry: 50 };

const labelStyle = {
  fontFamily: "var(--font-sans)",
  fontSize: 10.5,
  letterSpacing: "0.13em",
  fill: "var(--color-crd-forest)",
} as const;

type Hovered = { side: "in" | "out"; i: number } | null;

function stemOpacity(hovered: Hovered, side: "in" | "out", i: number, base: number) {
  if (!hovered) return base;
  return hovered.side === side && hovered.i === i ? 0.85 : 0.12;
}

export function FlowSystemDiagram({ className = "" }: { className?: string }) {
  const { ref, inView } = useInViewOnce<HTMLDivElement>();
  const reducedMotion = usePrefersReducedMotion();
  const [hovered, setHovered] = useState<Hovered>(null);

  const drawn = inView || reducedMotion;

  const stemStyle = (side: "in" | "out", i: number): React.CSSProperties => ({
    strokeDasharray: 1,
    strokeDashoffset: drawn ? 0 : 1,
    transition: reducedMotion
      ? "stroke-opacity 0.3s ease"
      : `stroke-dashoffset 1.1s cubic-bezier(0.16,1,0.3,1) ${
          side === "in" ? i * 0.12 : 0.5 + i * 0.1
        }s, stroke-opacity 0.3s ease`,
  });

  const nodeStyle = (side: "in" | "out", i: number): React.CSSProperties => ({
    opacity: drawn ? 1 : 0,
    transition: reducedMotion
      ? "none"
      : `opacity 0.7s ease ${side === "in" ? 0.25 + i * 0.12 : 0.9 + i * 0.1}s`,
  });

  return (
    <div ref={ref} className={className}>
      <svg
        viewBox="0 0 640 400"
        className="hidden w-full md:block"
        role="img"
        aria-label="Diagram: brief, brand assets, content and client feedback flow into the CRD Design System, which produces print, digital, campaign, social, packaging and editorial output."
      >
        {/* Stems */}
        <g fill="none" strokeWidth={1} strokeLinecap="round">
          {/* No non-scaling-stroke here: it would make Chrome compute the
              dash pattern in screen px, defeating the pathLength=1 draw-in
              normalisation (the stems render dotted instead of solid). */}
          {INPUTS.map(({ d }, i) => (
            <path
              key={`in-${i}`}
              d={d}
              pathLength={1}
              stroke="var(--color-crd-forest)"
              strokeOpacity={stemOpacity(hovered, "in", i, 0.34)}
              style={stemStyle("in", i)}
            />
          ))}
          {OUTPUTS.map(({ d }, i) => (
            <path
              key={`out-${i}`}
              d={d}
              pathLength={1}
              stroke="var(--color-crd-gold)"
              strokeOpacity={stemOpacity(hovered, "out", i, 0.42)}
              style={stemStyle("out", i)}
            />
          ))}
        </g>

        {/* Ambient pulses — a slow signal travelling each stem. SMIL keeps
            this off the main thread; omitted entirely under reduced motion. */}
        {!reducedMotion &&
          drawn &&
          [...INPUTS.map((p, i) => ({ ...p, key: `pin-${i}`, dur: 6.5, begin: i * 1.7 })),
           ...OUTPUTS.map((p, i) => ({ ...p, key: `pout-${i}`, dur: 7, begin: 0.8 + i * 1.9 }))].map(
            ({ key, d, dur, begin }) => (
              <circle key={key} r={1.7} fill="var(--color-crd-gold)" opacity={0}>
                <animateMotion dur={`${dur}s`} begin={`${begin}s`} repeatCount="indefinite" path={d} />
                <animate
                  attributeName="opacity"
                  values="0;0.75;0.75;0"
                  keyTimes="0;0.15;0.8;1"
                  dur={`${dur}s`}
                  begin={`${begin}s`}
                  repeatCount="indefinite"
                />
              </circle>
            ),
          )}

        {/* Hub — dashed hand-drawn ellipse; ring drifts slowly, a single
            gold point breathes at the crown (the "processing" tell). */}
        <ellipse
          cx={HUB.cx}
          cy={HUB.cy}
          rx={HUB.rx}
          ry={HUB.ry}
          fill="none"
          className={reducedMotion ? undefined : "crd-diagram-hub-ring"}
          stroke="var(--color-crd-gold)"
          strokeOpacity={hovered ? 0.7 : 0.45}
          strokeWidth={0.8}
          strokeDasharray="1.5 4.5"
          style={{ transition: "stroke-opacity 0.3s ease" }}
          vectorEffect="non-scaling-stroke"
        />
        <circle
          cx={HUB.cx}
          cy={HUB.cy - HUB.ry}
          r={2}
          fill="var(--color-crd-gold)"
          className={reducedMotion ? undefined : "crd-diagram-crown"}
        />
        <text
          x={HUB.cx}
          y={HUB.cy - 8}
          textAnchor="middle"
          style={{ fontFamily: "var(--font-serif)", fontSize: 14, fill: "var(--color-crd-forest)", fillOpacity: 0.9 }}
        >
          CRD Design
        </text>
        <line
          x1={HUB.cx - 16}
          y1={HUB.cy + 2}
          x2={HUB.cx + 16}
          y2={HUB.cy + 2}
          stroke="var(--color-crd-gold)"
          strokeOpacity={0.6}
          strokeWidth={0.75}
          vectorEffect="non-scaling-stroke"
        />
        <text
          x={HUB.cx}
          y={HUB.cy + 18}
          textAnchor="middle"
          style={{ fontFamily: "var(--font-serif)", fontSize: 14, fill: "var(--color-crd-forest)", fillOpacity: 0.9 }}
        >
          System
        </text>

        {/* Input nodes */}
        {INPUTS.map(({ label, y }, i) => (
          <g
            key={label}
            style={nodeStyle("in", i)}
            onMouseEnter={() => setHovered({ side: "in", i })}
            onMouseLeave={() => setHovered(null)}
          >
            <text x={118} y={y + 3.5} textAnchor="end" style={labelStyle} fillOpacity={0.75}>
              {label}
            </text>
            <circle cx={128} cy={y} r={1.8} fill="var(--color-crd-gold)" />
          </g>
        ))}

        {/* Output nodes */}
        {OUTPUTS.map(({ label, y }, i) => (
          <g
            key={label}
            style={nodeStyle("out", i)}
            onMouseEnter={() => setHovered({ side: "out", i })}
            onMouseLeave={() => setHovered(null)}
          >
            <text x={506} y={y + 3.5} textAnchor="start" style={labelStyle} fillOpacity={0.75}>
              {label}
            </text>
            <circle cx={496} cy={y} r={1.8} fill="var(--color-crd-gold)" />
          </g>
        ))}
      </svg>

      {/* Mobile: the same three groups as a typographic list. */}
      <div className="flex flex-col items-center gap-3 py-2 md:hidden">
        <ul className="flex flex-col items-center gap-2.5">
          {INPUTS.map(({ label }) => (
            <li key={label} className="font-sans text-[11px] uppercase tracking-[0.14em] text-crd-forest/75">
              {label}
            </li>
          ))}
        </ul>

        <span aria-hidden="true" className="my-2 block h-6 w-px bg-crd-moss/40" />

        <div className="rounded-full border border-dashed border-crd-gold/45 px-9 py-6 text-center">
          <p className="font-serif text-sm leading-snug text-crd-forest/85">
            CRD Design
            <br />
            System
          </p>
        </div>

        <span aria-hidden="true" className="my-2 block h-6 w-px bg-crd-gold/40" />

        <ul className="flex flex-col items-center gap-2.5">
          {OUTPUTS.map(({ label }) => (
            <li key={label} className="font-sans text-[11px] uppercase tracking-[0.14em] text-crd-forest/75">
              {label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
