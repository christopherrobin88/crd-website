import { useLayoutEffect, useRef, type CSSProperties } from "react";
import { gsap } from "@/lib/motion";
import bgTexture from "@/assets/images/web_background.webp";
import foliageLeft from "@/assets/images/foliage_left.webp";
import foliageCorner from "@/assets/images/foliage_corner.webp";

/**
 * Fixed, full-viewport composited brand background — parchment base with the
 * real misty treeline/leaf texture at low opacity. Rendered once in App so it
 * sits behind every page and stays put as long pages scroll.
 *
 * The green watercolour sprigs at the left edge / bottom-left corner come
 * from the approved landing mockup (cut out by scripts/extract-foliage.ts —
 * cropped from an approved asset per CLAUDE.md Section 3, not generated).
 * On load they grow in from their stem side, then hold a barely-there sway.
 * Static under prefers-reduced-motion.
 */

const growMask = (originX: string, originY: string): CSSProperties => {
  const m = `radial-gradient(circle at ${originX} ${originY}, black calc(var(--f-r, 200%) - 14%), transparent var(--f-r, 200%))`;
  return { maskImage: m, WebkitMaskImage: m };
};

export function SiteBackground() {
  const foliageRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = foliageRef.current;
    if (!root) return;

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const sprigs = Array.from(
        root.querySelectorAll<HTMLElement>("[data-foliage]"),
      );
      const tweens: gsap.core.Tween[] = [];
      sprigs.forEach((el, i) => {
        // growth reveal from the stem side
        const state = { r: 0 };
        el.style.setProperty("--f-r", "0%");
        tweens.push(
          gsap.to(state, {
            r: 165,
            duration: 2.1,
            delay: 0.9 + i * 0.4,
            ease: "power2.inOut",
            onUpdate: () => el.style.setProperty("--f-r", `${state.r}%`),
          }),
        );
        // barely-there sway, desynchronised per sprig
        tweens.push(
          gsap.to(el, {
            rotation: i % 2 ? -0.9 : 0.7,
            y: i % 2 ? 4 : -3,
            transformOrigin: "0% 85%",
            duration: 8 + i * 2.5,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
            delay: 3,
          }),
        );
      });
      return () => {
        tweens.forEach((t) => t.kill());
        sprigs.forEach((el) => el.style.removeProperty("--f-r"));
      };
    });
    return () => mm.revert();
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 bg-crd-parchment"
    >
      <div
        className="absolute inset-0 bg-cover bg-center opacity-60 mix-blend-multiply"
        style={{ backgroundImage: `url(${bgTexture})` }}
      />
      <div className="absolute inset-0 bg-crd-parchment/30" />
      <div ref={foliageRef} className="absolute inset-0">
        <img
          data-foliage
          src={foliageLeft}
          alt=""
          width={148}
          height={183}
          className="absolute left-0 top-[52vh] hidden w-[clamp(96px,11vw,170px)] md:block"
          style={growMask("0%", "55%")}
        />
        <img
          data-foliage
          src={foliageCorner}
          alt=""
          width={250}
          height={151}
          className="absolute bottom-0 left-0 hidden w-[clamp(150px,19vw,300px)] md:block"
          style={growMask("0%", "100%")}
        />
      </div>
    </div>
  );
}
