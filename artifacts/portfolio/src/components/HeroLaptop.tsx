import { useLayoutEffect, useRef } from "react";
import { gsap } from "@/lib/motion";
import { HeroLaptopArt } from "@/components/HeroLaptopArt";

/**
 * The landing hero illustration: botanical linework that draws itself out
 * of the laptop screen (HeroLaptopArt, a self-contained inline SVG driven
 * entirely by CSS keyframes — see that file for detail and provenance).
 *
 * Motion here, per the hero micro-animation brief:
 *  - idle: barely-there float/sway loop, starting once the SVG's own
 *    draw-on has finished (its longest path delay ends ~2.4s in)
 *  - scroll: gentle parallax against the page
 *  - cursor: gentle tilt toward the pointer within the hero
 * All of it is skipped under prefers-reduced-motion (HeroLaptopArt falls
 * back to the fully drawn static illustration internally, and none of the
 * GSAP behaviours below run either).
 * Three.js background layer from the brief deliberately omitted — the flat
 * texture layer already carries the depth, and the dependency wouldn't earn
 * its place.
 *
 * `web_hero_laptop.svg` is left in `src/assets/images/` for now — cleanup
 * once this hero is verified in production (see docs/scope.md).
 */

export function HeroLaptop({ className }: { className?: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const floatRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const float = floatRef.current;
    const tilt = tiltRef.current;
    if (!root || !float || !tilt) return;

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // Idle float — separate element from the cursor tilt so their
      // transforms never fight. Delayed until after the SVG draw-on
      // (last path delay + duration lands around 2.4s) so it doesn't
      // compete with the reveal.
      const idle = gsap.to(float, {
        y: -6,
        rotation: 0.35,
        transformOrigin: "50% 85%",
        duration: 5.5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: 2.75,
      });

      // Scroll parallax — the illustration drifts up slightly faster than
      // the page it sits on.
      const parallax = gsap.to(root, {
        y: -48,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top 75%",
          end: "bottom top",
          scrub: true,
        },
      });

      // Cursor response, scoped to the hero zone.
      const zone = (root.closest("[data-hero-zone]") ?? root) as HTMLElement;
      const xTo = gsap.quickTo(tilt, "x", { duration: 0.9, ease: "power3" });
      const rTo = gsap.quickTo(tilt, "rotation", {
        duration: 0.9,
        ease: "power3",
      });
      const onMove = (e: PointerEvent) => {
        const rect = zone.getBoundingClientRect();
        const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        xTo(nx * 8);
        rTo(nx * 0.5);
      };
      const onLeave = () => {
        xTo(0);
        rTo(0);
      };
      zone.addEventListener("pointermove", onMove);
      zone.addEventListener("pointerleave", onLeave);

      return () => {
        zone.removeEventListener("pointermove", onMove);
        zone.removeEventListener("pointerleave", onLeave);
        idle.kill();
        parallax.scrollTrigger?.kill();
        parallax.kill();
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <div ref={rootRef} className={className}>
      <div ref={floatRef}>
        <div ref={tiltRef} className="relative">
          <HeroLaptopArt className="h-auto w-full" />
        </div>
      </div>
    </div>
  );
}
