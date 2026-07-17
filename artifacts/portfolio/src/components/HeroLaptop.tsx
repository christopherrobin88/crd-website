import { useLayoutEffect, useRef } from "react";
import { gsap } from "@/lib/motion";
import heroLaptop from "@/assets/images/web_hero_laptop.svg";

/**
 * The landing hero illustration uses Christopher's supplied vector artwork.
 *
 * Motion, per the hero micro-animation brief:
 *  - idle: barely-there float/sway loop
 *  - scroll: gentle parallax against the page
 *  - cursor: gentle tilt toward the pointer within the hero
 * All of it is skipped under prefers-reduced-motion (static image instead).
 * Three.js background layer from the brief deliberately omitted — the flat
 * texture layer already carries the depth, and the dependency wouldn't earn
 * its place.
 */

export function HeroLaptop({ className }: { className?: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const floatRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLImageElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const float = floatRef.current;
    const tilt = tiltRef.current;
    const overlay = overlayRef.current;
    if (!root || !float || !tilt || !overlay) return;

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const state = { r: 0 };
      overlay.style.opacity = "0.32";
      overlay.style.setProperty("--hero-r", "0%");
      const intro = gsap.to(state, {
        r: 185,
        duration: 1.65,
        delay: 0.15,
        ease: "power2.inOut",
        onUpdate: () => overlay.style.setProperty("--hero-r", `${state.r}%`),
        onComplete: () => {
          gsap.to(overlay, { opacity: 0, duration: 0.45, ease: "power1.out" });
        },
      });

      // Idle float — separate element from the cursor tilt so their
      // transforms never fight.
      const idle = gsap.to(float, {
        y: -6,
        rotation: 0.35,
        transformOrigin: "50% 85%",
        duration: 5.5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: 1.5,
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
        intro.kill();
        idle.kill();
        parallax.scrollTrigger?.kill();
        parallax.kill();
        overlay.style.opacity = "0";
        overlay.style.removeProperty("--hero-r");
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <div ref={rootRef} className={className}>
      <div ref={floatRef}>
        <div ref={tiltRef} className="relative">
          <img
              src={heroLaptop}
              alt="A laptop with botanical linework growing from the screen"
              className="h-auto w-full"
              width={1148}
              height={1370}
              fetchPriority="high"
            />
          <img
            ref={overlayRef}
            src={heroLaptop}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-auto w-full opacity-0"
            width={1148}
            height={1370}
            style={{
              maskImage:
                "radial-gradient(circle at 62% 90%, black calc(var(--hero-r, 0%) - 14%), transparent var(--hero-r, 0%))",
              WebkitMaskImage:
                "radial-gradient(circle at 62% 90%, black calc(var(--hero-r, 0%) - 14%), transparent var(--hero-r, 0%))",
            }}
          />
        </div>
      </div>
    </div>
  );
}
