import { useEffect, useRef, type ReactNode } from "react";
import { useInView } from "framer-motion";
import { useReducedMotionPreference } from "@/hooks/use-reduced-motion-preference";

/** A paper mount that settles on arrival and follows a fine pointer, never a loop. */
export function MotionFrame({ children, className = "", label, direction = 1 }: {
  children: ReactNode; className?: string; label?: string; direction?: 1 | -1;
}) {
  const mount = useRef<HTMLDivElement>(null);
  const surface = useRef<HTMLDivElement>(null);
  const shown = useInView(mount, { amount: 0.15, once: true });
  const reduce = useReducedMotionPreference();

  useEffect(() => {
    const node = mount.current;
    const face = surface.current;
    if (!node || !face || reduce) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    let frame = 0;
    const reset = () => {
      cancelAnimationFrame(frame);
      face.style.removeProperty("--frame-x");
      face.style.removeProperty("--frame-y");
      node.removeAttribute("data-pointed");
    };
    const move = (event: PointerEvent) => {
      if (!fine.matches || event.pointerType !== "mouse") return;
      const bounds = node.getBoundingClientRect();
      const x = Math.max(-1, Math.min(1, (event.clientX - bounds.left) / bounds.width * 2 - 1));
      const y = Math.max(-1, Math.min(1, (event.clientY - bounds.top) / bounds.height * 2 - 1));
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        face.style.setProperty("--frame-x", `${x * 4}deg`);
        face.style.setProperty("--frame-y", `${y * -3}deg`);
        node.setAttribute("data-pointed", "true");
      });
    };
    node.addEventListener("pointermove", move);
    node.addEventListener("pointerleave", reset);
    node.addEventListener("pointercancel", reset);
    fine.addEventListener("change", reset);
    return () => {
      reset();
      node.removeEventListener("pointermove", move);
      node.removeEventListener("pointerleave", reset);
      node.removeEventListener("pointercancel", reset);
      fine.removeEventListener("change", reset);
    };
  }, [reduce]);

  return <div ref={mount} className={`crd-motion-mount ${className}`} data-arrived={shown || reduce} style={{ "--frame-direction": direction } as React.CSSProperties}>
    <div className="crd-frame-arrival">
      <div ref={surface} className="crd-frame-surface">{children}</div>
    </div>
    {label && <span className="crd-frame-note" aria-hidden="true">{label}<span>↗</span></span>}
  </div>;
}
