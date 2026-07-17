import { gsap } from "gsap";

import { ScrollTrigger } from "gsap/ScrollTrigger";

// Single registration point so every consumer shares the same GSAP core and
// scroll plugin. ScrollSmoother, DrawSVG and MotionPath were registered here
// historically but nothing imports them — re-add alongside ScrollTrigger if a
// future brief needs them.
gsap.registerPlugin(ScrollTrigger);

export const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export { gsap, ScrollTrigger };
