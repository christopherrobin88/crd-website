import { useInViewOnce, usePrefersReducedMotion } from "./hooks";

/**
 * Case-study journey (project pages) — a quiet micro diagram marking the
 * arc every project travels: Challenge → Strategy → Design → Production →
 * Result. Sits at the top of the detail page's info rail as a wayfinding
 * cue for the Brief / Process / Outcomes copy beneath it. Part of the CRD
 * diagram language (see FlowSystemDiagram).
 */

const STAGES = ["Challenge", "Strategy", "Design", "Production", "Result"];

export function JourneyRail({ className = "" }: { className?: string }) {
  const { ref, inView } = useInViewOnce<HTMLOListElement>();
  const reducedMotion = usePrefersReducedMotion();
  const drawn = inView || reducedMotion;

  return (
    <ol
      ref={ref}
      aria-label="Project journey"
      className={`relative flex list-none flex-wrap items-center gap-y-2 font-sans text-[0.62rem] uppercase tracking-[0.16em] text-crd-forest/65 ${className}`}
    >
      {STAGES.map((stage, i) => (
        <li
          key={stage}
          className="flex items-center"
          style={
            reducedMotion
              ? undefined
              : {
                  opacity: drawn ? 1 : 0,
                  transition: `opacity 0.5s ease ${i * 0.12}s`,
                }
          }
        >
          {i > 0 && (
            <span
              aria-hidden="true"
              className="mx-2 block h-px w-4 origin-left bg-crd-gold/50"
              style={
                reducedMotion
                  ? undefined
                  : {
                      transform: drawn ? "scaleX(1)" : "scaleX(0)",
                      transition: `transform 0.4s ease ${i * 0.12}s`,
                    }
              }
            />
          )}
          <span className="flex items-center gap-1.5">
            <span aria-hidden="true" className="h-1 w-1 rounded-full bg-crd-gold/80" />
            {stage}
          </span>
        </li>
      ))}
    </ol>
  );
}
