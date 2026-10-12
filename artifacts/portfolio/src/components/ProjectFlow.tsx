import { SketchLine } from "@/components/SketchLine";
import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { useReducedMotionPreference } from "@/hooks/use-reduced-motion-preference";
import { Check, Pause, Play } from "lucide-react";

const steps = [
  { title: "Brief", status: "Received", detail: "Acknowledge the request and gather the content." },
  { title: "Assign", status: "Assigned", detail: "Set ownership, priorities and the delivery date." },
  { title: "Design", status: "In progress", detail: "Develop the work and keep the project updated." },
  { title: "Review", status: "In review", detail: "Bring feedback together for a considered revision." },
  { title: "Approve", status: "Approved", detail: "Confirm the final direction before delivery." },
  { title: "Deliver", status: "Delivered", detail: "Supply the finished work and record the handover." },
];

export function ProjectFlow() {
  const cards = useRef<HTMLOListElement>(null);
  const inView = useInView(cards, { amount: 0.1 });
  const [stage, setStage] = useState(0);
  const [paused, setPaused] = useState(false);
  const [inspecting, setInspecting] = useState(false);
  const [hidden, setHidden] = useState(false);
  const reduce = useReducedMotionPreference();
  useEffect(() => {
    const update = () => setHidden(document.hidden);
    update(); document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);
  useEffect(() => {
    if (reduce || !inView || paused || inspecting || hidden) return;
    const timer = setTimeout(() => setStage((value) => value === steps.length - 1 ? -1 : value + 1),
      stage === steps.length - 1 ? 1800 : stage === -1 ? 450 : 1100);
    return () => clearTimeout(timer);
  }, [reduce, inView, paused, inspecting, hidden, stage]);
  const shownStage = reduce ? steps.length - 1 : stage;

  return (
    <section className="px-6 py-16 md:px-12 md:py-24" aria-labelledby="project-flow-title">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 grid gap-7 md:grid-cols-2 md:gap-20">
          <div><p className="mb-5 text-xs uppercase tracking-[0.2em]">Design & delivery systems</p><h2 id="project-flow-title" className="font-serif text-4xl leading-tight tracking-tight md:text-5xl">Drawn by hand.<br /><span className="italic">Kept in motion.</span></h2><SketchLine className="mt-4 w-52" /></div>
          <p className="text-lg leading-relaxed text-crd-forest/85">Good systems give creative work room to happen. A clear brief, visible ownership and considered checkpoints keep a project moving. Routine acknowledgements, status updates and reminders can be automated; design decisions and approvals stay with people. The cards show a sample project from brief to delivery.</p>
        </div>
        {!reduce && <div className="mb-4 flex justify-end">
          <button type="button" onClick={() => setPaused((value) => !value)}
            aria-label={`${paused ? "Play" : "Pause"} project workflow`} aria-pressed={paused}
            className="inline-flex min-h-11 items-center gap-2 border-b border-crd-forest/30 px-2 text-sm text-crd-forest focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-crd-forest">
            {paused ? <Play className="h-3.5 w-3.5" aria-hidden="true" /> : <Pause className="h-3.5 w-3.5" aria-hidden="true" />}
            <span>{paused ? "Resume workflow" : "Pause workflow"}</span>
          </button>
        </div>}
        <ol ref={cards} className="crd-flow-grid" onPointerEnter={(event) => { if (event.pointerType === "mouse") setInspecting(true); }} onPointerLeave={() => setInspecting(false)}>
          {steps.map((step, index) => <li key={step.title} className={`crd-flow-step ${index <= shownStage ? "is-reached" : ""}`}>
            <svg className="crd-flow-outline" viewBox="0 0 180 180" preserveAspectRatio="none" aria-hidden="true">
              <path d="M12 8 C49 5 113 10 163 8 Q173 9 172 22 L174 159 Q170 172 157 170 C112 172 57 167 17 172 Q7 170 9 156 L7 25 Q6 11 12 8Z" />
              <path className="crd-flow-pencil" d="M15 12 C61 9 114 12 163 11 M169 29 L170 155 M155 167 L23 167 M12 145 L11 29" />
            </svg>
            <div className="relative p-6">
              <span className="mb-5 flex h-7 items-center justify-between text-xs tracking-widest">0{index + 1}{index <= shownStage && <Check className="h-4 w-4" aria-label="Reached" />}</span>
              <h3 className="font-serif text-2xl italic">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed">{step.detail}</p>
              <span className="mt-5 inline-block border-b border-crd-forest/40 pb-1 text-xs font-medium">{index <= shownStage ? step.status : "Waiting"}</span>
            </div>
          </li>)}
        </ol>
      </div>
    </section>
  );
}
