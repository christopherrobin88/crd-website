import { useEffect } from "react";
import { scrollNowTo } from "./use-smooth-scroll";

/**
 * Work-page return state. When a visitor opens a project from /work and comes
 * back — browser Back/Forward, the Back to Work control, or after a refresh —
 * the Work page reopens at the exact position they left, and keyboard focus
 * returns to the project link that launched the detail page.
 *
 * Mechanics, per navigation kind:
 *  - Card click (Work.tsx) calls rememberWorkLaunch(): scroll offset and the
 *    launching card's id go into sessionStorage, and the navigation carries
 *    history state { fromWork: true }.
 *  - Back to Work (ProjectDetail) calls history.back() when that state is
 *    present, so no duplicate /work entry is pushed; otherwise it is a plain
 *    link carrying { restoreWork: true }, which restores if a saved position
 *    exists (prev/next browsing chains) and opens at the top for visitors who
 *    entered the project directly.
 *  - While mounted, the Work page keeps the saved offset current (throttled
 *    to animation frames), so repeated back-and-forth stays accurate and a
 *    reload restores through the same path.
 */

const SCROLL_KEY = "crd:work-scroll";
const ANCHOR_KEY = "crd:work-anchor";

// How recently a popstate must have fired for a Work-page mount to count as
// a Back/Forward navigation. The gap between popstate and mount is the lazy
// chunk load plus the page-exit transition (~0.5s); 3s leaves slack without
// risking misclassifying a genuinely separate later navigation.
const POP_WINDOW_MS = 3000;

let lastPopAt = 0;
let restoring = false;
let initialDocumentLoadPending = true;

if (typeof window !== "undefined") {
  window.addEventListener("popstate", () => {
    lastPopAt = Date.now();
  });
  // Scroll is managed explicitly: pages scroll to top on mount and /work
  // restores its own position, so the browser's async native restoration
  // would only fight those.
  if ("scrollRestoration" in window.history) {
    window.history.scrollRestoration = "manual";
  }
}

function readSaved(): { y: number; anchor: string | null } | null {
  try {
    const raw = sessionStorage.getItem(SCROLL_KEY);
    const y = raw === null ? NaN : Number(raw);
    if (!Number.isFinite(y)) return null;
    return { y, anchor: sessionStorage.getItem(ANCHOR_KEY) };
  } catch {
    return null;
  }
}

/** Called from a Work-page project link at the moment it is activated. */
export function rememberWorkLaunch(projectId: string) {
  try {
    sessionStorage.setItem(SCROLL_KEY, String(Math.round(window.scrollY)));
    sessionStorage.setItem(ANCHOR_KEY, projectId);
  } catch {
    // Storage unavailable (private mode): returning falls back to the top.
  }
}

function restoreTo(target: number, anchor: string | null) {
  restoring = true;
  const startedAt = performance.now();
  // The saved offset can exceed the document height until the lazy chunk and
  // image boxes have laid out, so keep re-applying until the position sticks
  // (or a generous timeout passes).
  const attempt = () => {
    scrollNowTo(target);
    const settled = Math.abs(window.scrollY - target) <= 2;
    if (!settled && performance.now() - startedAt < 2000) {
      requestAnimationFrame(attempt);
      return;
    }
    restoring = false;
    if (anchor) {
      document
        .querySelector<HTMLElement>(`[data-project-anchor="${anchor}"]`)
        ?.focus({ preventScroll: true });
      try {
        sessionStorage.removeItem(ANCHOR_KEY);
      } catch {
        // Already degraded above.
      }
    }
  };
  requestAnimationFrame(attempt);
}

export function useWorkScrollRestoration() {
  useEffect(() => {
    const saved = readSaved();
    const isPop = Date.now() - lastPopAt < POP_WINDOW_MS;

    // A full document load that is itself a reload or Back/Forward re-entry
    // (manual scrollRestoration suppresses the browser's own restore).
    let isReentryLoad = false;
    if (initialDocumentLoadPending) {
      initialDocumentLoadPending = false;
      const [nav] = performance.getEntriesByType(
        "navigation",
      ) as PerformanceNavigationTiming[];
      isReentryLoad = nav?.type === "reload" || nav?.type === "back_forward";
    }

    const wantsRestore =
      (window.history.state as { restoreWork?: boolean } | null)
        ?.restoreWork === true;

    if (saved && (isPop || wantsRestore || isReentryLoad)) {
      restoreTo(saved.y, saved.anchor);
    } else {
      scrollNowTo(0);
    }

    return () => {
      restoring = false;
    };
  }, []);

  // Keep the saved offset current while the visitor is on /work, so repeated
  // back-and-forth and reloads restore to where they actually were.
  useEffect(() => {
    const workPath = `${import.meta.env.BASE_URL.replace(/\/$/, "")}/work`;
    let frame = 0;
    const onScroll = () => {
      if (restoring) return;
      // When navigation away begins, the collapsing document fires a clamped
      // scroll event (usually to 0) that can beat this effect's cleanup — the
      // URL has already changed by then, so it identifies the stale event.
      if (window.location.pathname !== workPath) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        try {
          sessionStorage.setItem(SCROLL_KEY, String(Math.round(window.scrollY)));
        } catch {
          // Storage unavailable: nothing to keep current.
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);
}
