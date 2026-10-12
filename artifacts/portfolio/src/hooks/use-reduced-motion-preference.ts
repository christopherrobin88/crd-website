import { useSyncExternalStore } from "react";

const query = "(prefers-reduced-motion: reduce)";
const subscribe = (update: () => void) => {
  const media = window.matchMedia(query);
  media.addEventListener("change", update);
  return () => media.removeEventListener("change", update);
};
const snapshot = () => window.matchMedia(query).matches;
const serverSnapshot = () => false;

/** Match prerendered markup on hydration, then apply the visitor's preference. */
export function useReducedMotionPreference() {
  return useSyncExternalStore(subscribe, snapshot, serverSnapshot);
}
