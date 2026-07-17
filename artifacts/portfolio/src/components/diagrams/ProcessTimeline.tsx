import { useState } from "react";
import { Fleck } from "@/components/EditorialAtmosphere";
import { useInViewOnce, usePrefersReducedMotion } from "./hooks";

/**
 * The CRD Creative System timeline (Services page). Same content as the old
 * hairline <ol>, upgraded into the diagram language: the connective gold
 * thread draws itself across on first view, stages surface in sequence, and
 * each stage can expand to show what it hands over. Horizontal on desktop,
 * a left-edge stem on mobile — matching the original layout so the page
 * rhythm is unchanged.
 */

export interface TimelineStep {
  title: string;
  body: string;
  deliverables: string[];
}

export function ProcessTimeline({ steps }: { steps: TimelineStep[] }) {
  const { ref, inView } = useInViewOnce<HTMLOListElement>();
  const reducedMotion = usePrefersReducedMotion();
  const [open, setOpen] = useState<number | null>(null);

  const drawn = inView || reducedMotion;

  return (
    <ol ref={ref} className="relative grid gap-10 md:grid-cols-5 md:gap-8 list-none">
      {/* Connective thread — draws down (mobile) / across (desktop) once.
          Two spans because the draw axis differs per breakpoint. */}
      <span
        aria-hidden="true"
        className="absolute left-[5px] top-1 bottom-1 w-px origin-top bg-crd-gold/40 md:hidden"
        style={
          reducedMotion
            ? undefined
            : {
                transform: drawn ? "scaleY(1)" : "scaleY(0)",
                transition: "transform 1.4s cubic-bezier(0.16,1,0.3,1)",
              }
        }
      />
      <span
        aria-hidden="true"
        className="absolute left-0 right-0 top-[5px] hidden h-px origin-left bg-crd-gold/40 md:block"
        style={
          reducedMotion
            ? undefined
            : {
                transform: drawn ? "scaleX(1)" : "scaleX(0)",
                transition: "transform 1.4s cubic-bezier(0.16,1,0.3,1)",
              }
        }
      />
      {steps.map((step, i) => {
        const expanded = open === i;
        return (
          <li
            key={step.title}
            className="relative pl-8 md:pl-0 md:pt-8"
            style={
              reducedMotion
                ? undefined
                : {
                    opacity: drawn ? 1 : 0,
                    transform: drawn ? "translateY(0)" : "translateY(10px)",
                    transition: `opacity 0.7s ease ${0.15 + i * 0.16}s, transform 0.7s ease ${0.15 + i * 0.16}s`,
                  }
            }
          >
            <Fleck className="absolute -left-[1px] top-0 h-3 w-3 md:-top-[1px] md:left-0" />
            <span className="font-sans text-xs font-medium uppercase tracking-widest text-crd-gold">
              0{i + 1}
            </span>
            <h3 className="font-serif text-2xl md:text-[1.7rem] tracking-tight mt-2 mb-3">
              {step.title}
            </h3>
            <p className="font-sans text-sm md:text-[15px] text-foreground/60 leading-relaxed">
              {step.body}
            </p>

            <button
              type="button"
              aria-expanded={expanded}
              aria-controls={`timeline-deliverables-${i}`}
              onClick={() => setOpen(expanded ? null : i)}
              className="mt-4 font-sans text-[0.65rem] uppercase tracking-[0.18em] text-crd-forest/60 underline decoration-crd-gold/50 underline-offset-4 transition-colors hover:text-crd-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crd-gold focus-visible:ring-offset-2"
            >
              {expanded ? "Close" : "What you get"}
            </button>

            <div
              id={`timeline-deliverables-${i}`}
              className="grid transition-[grid-template-rows] duration-500 ease-out motion-reduce:transition-none"
              style={{ gridTemplateRows: expanded ? "1fr" : "0fr" }}
            >
              <ul className="min-h-0 overflow-hidden">
                {step.deliverables.map((item) => (
                  <li
                    key={item}
                    className="mt-2 flex items-baseline gap-2.5 font-sans text-sm text-foreground/70 first:mt-3"
                  >
                    <span aria-hidden="true" className="h-1 w-1 shrink-0 translate-y-[-2px] rounded-full bg-crd-gold/80" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
