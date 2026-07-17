import { useMemo, useState } from "react";
import { Maximize2 } from "lucide-react";
import type { ContentBlock, ProjectContent } from "@/types/content";
import { getProjectAssets } from "@/data/content-assets";
import { Picture } from "./Picture";
import { DoubleSpread, getSpreadAspectRatio } from "./DoubleSpread";
import { ProjectLightbox, type LightboxItem } from "./ProjectLightbox";

interface ProjectContentFlowProps {
  content: ProjectContent;
  title: string;
  /**
   * How grouped imagery is framed. "editorial" (default) stitches a group's
   * pages into one bordered article card with hairline dividers — right for
   * consecutive magazine pages. "plates" presents each image as a standalone
   * mounted board with space around it — right for identity and packaging
   * presentation boards, which are independent objects, not article pages.
   */
  variant?: "editorial" | "plates";
}

type Run =
  | { kind: "cover"; block: Extract<ContentBlock, { type: "cover" }> }
  | { kind: "group"; key: string; blocks: ContentBlock[] };

// A "cover" block always breaks the run — it marks a new issue starting
// mid-sequence (e.g. Playboy's March2015 + April2015 in one project), not
// another page of the article before it. Consecutive spread/page blocks
// that share a manifest `group` (one editorial feature) stay in one run so
// they can be framed as a single object — see the standing rule in
// CLAUDE.md: spreads are never pre-merged, but they can still be grouped
// visually at render time.
function buildRuns(sequence: ContentBlock[]): Run[] {
  const runs: Run[] = [];
  let current: Extract<Run, { kind: "group" }> | null = null;

  for (const block of sequence) {
    if (block.type === "cover") {
      current = null;
      runs.push({ kind: "cover", block });
      continue;
    }
    const key = block.group ?? "";
    if (current && current.key === key) {
      current.blocks.push(block);
    } else {
      current = { kind: "group", key, blocks: [block] };
      runs.push(current);
    }
  }
  return runs;
}

// "April2015/BadassEricChurch" -> "Badass Eric Church". An auto-derived
// caption naming every layout/feature — the exact wording isn't load-bearing
// copy, just a browsing aid. Single-group manifests (Uncut, Kruger) generate
// a placeholder key like "_root" with nothing meaningful to split into
// words; those fall back to the project title instead of showing "Root".
function labelFor(groupKey: string, fallback: string): string {
  const tail = groupKey.split("/").pop() ?? groupKey;
  const cleaned = tail.replace(/^_+|_+$/g, "");
  if (!cleaned || cleaned.toLowerCase() === "root") return fallback;
  return cleaned
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/([A-Za-z])([0-9])/g, "$1 $2")
    .replace(/\bMc (?=[A-Z])/g, "Mc") // "Mc Luhan" -> "McLuhan"
    .replace(/(\d) Q\b/g, "$1Q") // "20 Q" -> "20Q" (Playboy's 20Q feature)
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Renders a ProjectContent's sequence in order: cover (full-bleed hero),
 * spread (via DoubleSpread), page (single contained image). Consumes
 * DoubleSpread, does not reimplement or modify its internals.
 *
 * Beyond the raw sequence, blocks that share a manifest `group` are framed
 * together as one contained, bordered object (tight hairline dividers, no
 * gap) so consecutive pages read as one article rather than a stack of
 * independent hero images; every group gets a visible break and a caption
 * naming its layout/feature (falling back to the project title for
 * single-group manifests with no real feature name). Every page and spread
 * half opens a lightbox scoped to its own group, so next/prev browsing never
 * leaves the article it started in.
 */
export function ProjectContentFlow({
  content,
  title,
  variant = "editorial",
}: ProjectContentFlowProps) {
  const assets = getProjectAssets(content.slug);
  // Resolved lazily: identity/packaging projects have no spread blocks, and
  // resolving eagerly warned about a missing ratio they will never use.
  const aspectRatio = useMemo(
    () =>
      content.sequence.some((block) => block.type === "spread")
        ? getSpreadAspectRatio(content.slug)
        : null,
    [content.sequence, content.slug],
  );
  const runs = useMemo(() => buildRuns(content.sequence), [content.sequence]);

  const [lightbox, setLightbox] = useState<{ runIndex: number; itemIndex: number } | null>(null);

  // Flattened viewable pages per group run — a spread contributes two
  // entries (left, right) in reading order, a page contributes one.
  const flattenedByRun = useMemo(
    () =>
      runs.map((run): LightboxItem[] => {
        if (run.kind === "cover") return [];
        const items: LightboxItem[] = [];
        for (const block of run.blocks) {
          if (block.type === "spread") {
            items.push({ pic: assets[block.left], alt: `${title} — page` });
            items.push({ pic: assets[block.right], alt: `${title} — page` });
          } else {
            items.push({ pic: assets[block.asset], alt: `${title} — page` });
          }
        }
        return items;
      }),
    [runs, assets, title],
  );

  const activeItems = lightbox ? flattenedByRun[lightbox.runIndex] : [];
  const activeRun = lightbox ? runs[lightbox.runIndex] : undefined;
  const activeLabel = activeRun?.kind === "group" ? labelFor(activeRun.key, title) : title;

  return (
    <div className="w-full">
      {runs.map((run, runIndex) => {
        if (run.kind === "cover") {
          // Issue cover — shown whole at its natural aspect (portrait covers
          // were previously object-cover-cropped into letterboxed strips),
          // presented as the physical object between features.
          const pic = assets[run.block.asset];
          return (
            <div
              key={runIndex}
              className="mx-auto flex max-w-5xl justify-center px-4 py-14 md:px-8 md:py-20"
            >
              <Picture
                pic={pic}
                alt={`${title} — cover`}
                className="max-h-[82vh] w-auto shadow-[0_12px_36px_-10px_rgba(14,35,32,0.35)] ring-1 ring-black/10"
                sizes="(min-width: 1024px) 44vw, 92vw"
              />
            </div>
          );
        }

        let runningIndex = 0;

        return (
          <div key={runIndex} className="mx-auto max-w-5xl px-4 py-16 md:px-8 md:py-24">
            <div className="mb-6 flex items-center gap-4 font-sans text-xs uppercase tracking-widest text-muted-foreground">
              <span className="h-px w-10 bg-muted-foreground" aria-hidden="true" />
              {labelFor(run.key, title)}
            </div>
            <div
              className={
                variant === "plates"
                  ? "space-y-10 md:space-y-14"
                  : "divide-y divide-border overflow-hidden bg-card/40 shadow-[0_10px_32px_-12px_rgba(14,35,32,0.3)] ring-1 ring-black/5"
              }
            >
              {run.blocks.map((block, blockIndex) => {
                if (block.type === "spread") {
                  const leftIndex = runningIndex;
                  const rightIndex = runningIndex + 1;
                  runningIndex += 2;
                  return (
                    <div key={blockIndex}>
                      <DoubleSpread
                        left={assets[block.left]}
                        right={assets[block.right]}
                        alt={`${title} — spread`}
                        // Non-null: a spread block in the sequence is exactly
                        // the condition under which aspectRatio was resolved.
                        aspectRatio={aspectRatio!}
                        onOpenLeft={() => setLightbox({ runIndex, itemIndex: leftIndex })}
                        onOpenRight={() => setLightbox({ runIndex, itemIndex: rightIndex })}
                      />
                    </div>
                  );
                }

                const itemIndex = runningIndex;
                runningIndex += 1;
                const pic = assets[block.asset];
                return (
                  <div key={blockIndex}>
                    <button
                      type="button"
                      onClick={() => setLightbox({ runIndex, itemIndex })}
                      aria-label={`Open ${title} page full size`}
                      className={`group relative block w-full appearance-none border-0 bg-muted p-0 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-crd-gold focus-visible:outline-offset-2 ${
                        variant === "plates"
                          ? "shadow-[0_12px_36px_-10px_rgba(14,35,32,0.35)] ring-1 ring-black/10"
                          : ""
                      }`}
                    >
                      <Picture
                        pic={pic}
                        alt={`${title} — page`}
                        className="h-auto w-full motion-safe:transition-transform motion-safe:duration-700 motion-safe:ease-out motion-safe:group-hover:scale-[1.02]"
                        sizes="(min-width: 1024px) 60vw, 100vw"
                      />
                      <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-crd-forest/0 opacity-0 transition-all duration-300 group-hover:bg-crd-forest/10 group-hover:opacity-100">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-crd-parchment/90 text-crd-forest">
                          <Maximize2 className="h-4 w-4" />
                        </span>
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      <ProjectLightbox
        items={activeItems}
        index={lightbox?.itemIndex ?? 0}
        onIndexChange={(itemIndex) =>
          setLightbox((prev) => (prev ? { ...prev, itemIndex } : prev))
        }
        onClose={() => setLightbox(null)}
        label={activeLabel}
      />
    </div>
  );
}
