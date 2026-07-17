import { useInViewOnce, usePrefersReducedMotion } from "./hooks";

/**
 * "Inside the automation" (Services page) — the CRD production pipeline as
 * a vertical editorial spine: Client → Brief → Templates → Rules →
 * Automation → Validation → Outputs → Delivery. The spine draws downward on
 * first view and stations surface in order; Validation carries the
 * checkpoint ring — the quality gate every file passes before it leaves.
 * Deliberately calm: one line, eight stations, no boxes.
 */

interface Station {
  label: string;
  line: string;
  checkpoint?: boolean;
}

const STATIONS: Station[] = [
  { label: "Client", line: "Where every job starts — goals, constraints, deadline." },
  { label: "Brief", line: "Captured once, structured, versioned. One source of truth." },
  { label: "Templates", line: "Approved layouts that carry the brand rules by default." },
  { label: "Rules", line: "Naming, sizes, colour profiles and brand governance, written down." },
  { label: "Automation", line: "The repetitive production layers run themselves." },
  { label: "Validation", line: "Every file checked against the rules before it leaves.", checkpoint: true },
  { label: "Outputs", line: "Print, digital, campaign, social, packaging, editorial." },
  { label: "Delivery", line: "Named correctly, delivered where they belong, with reports." },
];

function CheckpointRing({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} aria-hidden="true">
      <circle
        cx={10}
        cy={10}
        r={8.5}
        fill="var(--color-crd-parchment)"
        stroke="var(--color-crd-gold)"
        strokeWidth={1}
      />
      <path
        d="M6.2,10.4 L8.8,13 L13.8,7.4"
        fill="none"
        stroke="var(--color-crd-moss)"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function AutomationArchitecture({ className = "" }: { className?: string }) {
  const { ref, inView } = useInViewOnce<HTMLOListElement>();
  const reducedMotion = usePrefersReducedMotion();
  const drawn = inView || reducedMotion;

  return (
    <ol ref={ref} className={`relative list-none max-w-2xl ${className}`}>
      <span
        aria-hidden="true"
        className="absolute left-[9px] top-2 bottom-2 w-px origin-top bg-crd-gold/40"
        style={
          reducedMotion
            ? undefined
            : {
                transform: drawn ? "scaleY(1)" : "scaleY(0)",
                transition: "transform 1.8s cubic-bezier(0.16,1,0.3,1)",
              }
        }
      />
      {STATIONS.map((station, i) => (
        <li
          key={station.label}
          className="relative flex items-baseline gap-5 py-4 pl-10 md:gap-7"
          style={
            reducedMotion
              ? undefined
              : {
                  opacity: drawn ? 1 : 0,
                  transform: drawn ? "translateY(0)" : "translateY(8px)",
                  transition: `opacity 0.6s ease ${0.15 + i * 0.14}s, transform 0.6s ease ${0.15 + i * 0.14}s`,
                }
          }
        >
          {station.checkpoint ? (
            <CheckpointRing className="absolute left-0 top-[1.55rem] h-5 w-5 md:top-[1.7rem]" />
          ) : (
            <span
              aria-hidden="true"
              className="absolute left-[6px] top-[1.95rem] h-[7px] w-[7px] rounded-full bg-crd-gold/80 md:top-[2.1rem]"
            />
          )}
          <span className="w-28 shrink-0 font-serif text-xl tracking-tight text-crd-forest md:w-36 md:text-2xl">
            {station.label}
          </span>
          <span className="font-sans text-sm leading-relaxed text-foreground/60 md:text-[15px]">
            {station.line}
          </span>
        </li>
      ))}
    </ol>
  );
}
