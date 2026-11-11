import { SketchLine } from "@/components/SketchLine";
import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { useReducedMotionPreference } from "@/hooks/use-reduced-motion-preference";

/**
 * How a project runs, in four client-facing steps. The pencil-outlined cards
 * fill in one after another the first time the row scrolls into view, then
 * stay put. This replaced the six-step looping "sample project" ticker
 * (2026-11-12): the statuses were demo data and the loop never settled.
 */
const steps = [
  { title: "Brief", detail: "You share the brief, the content and the deadline. I come back with questions, a scope and a date.", get: "A confirmed scope and date" },
  { title: "Design", detail: "I develop the direction and keep you updated as it takes shape.", get: "Work in progress, shared" },
  { title: "Review", detail: "Your feedback comes back in clear, consolidated rounds of changes.", get: "One list of changes per round" },
  { title: "Deliver", detail: "Finished files or a launched site, checked and handed over.", get: "Final work and a handover" },
];

export function ProjectFlow() {
  const cards = useRef<HTMLOListElement>(null);
  const inView = useInView(cards, { amount: 0.35, once: true });
  const [stage, setStage] = useState(-1);
  const reduce = useReducedMotionPreference();
  useEffect(() => {
    if (reduce || !inView || stage >= steps.length - 1) return;
    const timer = setTimeout(() => setStage((value) => value + 1), stage === -1 ? 250 : 550);
    return () => clearTimeout(timer);
  }, [reduce, inView, stage]);
  const shownStage = reduce ? steps.length - 1 : stage;

  return (
    <section className="px-6 py-16 md:px-12 md:py-24" aria-labelledby="project-flow-title">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 grid gap-7 md:grid-cols-2 md:gap-20">
          <div><p className="mb-5 text-xs uppercase tracking-[0.2em]">How a project runs</p><h2 id="project-flow-title" className="font-serif text-4xl leading-tight tracking-tight md:text-5xl">Drawn by hand.<br /><span className="italic">Kept in motion.</span></h2><SketchLine className="mt-4 w-52" /></div>
          <p className="text-lg leading-relaxed text-crd-forest/85">Every project runs through the same four steps, so you always know where your job is and what happens next. No chasing and no surprises.</p>
        </div>
        <ol ref={cards} className="crd-flow-grid crd-flow-grid--four">
          {steps.map((step, index) => <li key={step.title} className={`crd-flow-step ${index <= shownStage ? "is-reached" : ""}`}>
            <svg className="crd-flow-outline" viewBox="0 0 180 180" preserveAspectRatio="none" aria-hidden="true">
              <path d="M12 8 C49 5 113 10 163 8 Q173 9 172 22 L174 159 Q170 172 157 170 C112 172 57 167 17 172 Q7 170 9 156 L7 25 Q6 11 12 8Z" />
              <path className="crd-flow-pencil" d="M15 12 C61 9 114 12 163 11 M169 29 L170 155 M155 167 L23 167 M12 145 L11 29" />
            </svg>
            <div className="relative p-6">
              <span className="mb-4 block font-serif text-3xl italic text-crd-moss">0{index + 1}</span>
              <h3 className="font-serif text-3xl italic">{step.title}</h3>
              <p className="mt-3 text-base leading-relaxed">{step.detail}</p>
              <p className="mt-6 border-t border-crd-forest/25 pt-3 text-xs uppercase tracking-[0.16em] text-crd-forest/75">You get</p>
              <p className="mt-1 text-sm font-medium">{step.get}</p>
            </div>
          </li>)}
        </ol>
      </div>
    </section>
  );
}
