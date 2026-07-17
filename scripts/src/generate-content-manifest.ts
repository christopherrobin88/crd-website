// Scans `artifacts/portfolio/src/assets/new images` and produces one draft
// content manifest per launch project at
// `artifacts/portfolio/src/data/content/{slug}.json`.
//
// ⚠️ SUPERSEDED FOR EXISTING PROJECTS (Phase 2, 2026-07-05): production
// manifests and {slug}.assets.ts modules are now hand-curated and point at
// renamed assets under `src/assets/images/{project}/`. "new images" is
// staging-only and pending archive. Re-running this script would overwrite
// the curated manifests with staging filenames — only use it as a starting
// draft for a brand-new project drop, and expect to re-curate afterwards.
//
// This is a DRAFT generator (CRD content-flow system, Phase 1). Groups are
// left in filesystem-encounter order — cross-group running order for
// multi-feature projects (e.g. Playboy SA) is an editorial decision, not
// something this script infers. See docs/adding-a-project.md once Phase 6
// lands, or CLAUDE.md Section 1 / the content-flow brief in the meantime.

import { readdirSync, mkdirSync, writeFileSync, existsSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ASSETS_DIR = join(__dirname, "..", "..", "artifacts", "portfolio", "src", "assets", "new images");
const OUTPUT_DIR = join(__dirname, "..", "..", "artifacts", "portfolio", "src", "data", "content");

// Launch scope per CLAUDE.md Section 1. Raw filename "Client" token -> project slug.
// CheckersFoods is an alias found in the asset drop for the same client as Checkers.
const CLIENT_SLUGS: Record<string, string> = {
  Uncut: "uncut-magazine",
  Checkers: "checkers-retail",
  CheckersFoods: "checkers-retail",
  PlayboySouthAfrica: "playboy-south-africa",
  LeisureBoating: "leisure-boating",
  KrugerMagazine: "kruger-magazine",
};

// Kruger Magazine: only Issue 29 is confirmed launch scope (CLAUDE.md Section 1).
// Issues 28/30/31/32/33 are present in the asset drop but not built here.
const ISSUE_ALLOWLIST: Partial<Record<string, string[]>> = {
  KrugerMagazine: ["Issue29"],
};

// The `Spread_NN` filename pattern (underscore, no PageL/PageR suffix) is
// ambiguous by filename alone. Confirmed by Christopher, 2026-07-03:
//   - Uncut's Spread_01/Spread_02 ARE a matched left/right spread pair.
//   - Leisure Boating's Spread_01/Spread_02 are independent mockup renders,
//     not a page pair, and should not be forced through DoubleSpread.
// Any project hitting this pattern without an entry here fails loudly rather
// than guessing — see the thrown error below.
type SpreadUnderscoreHandling = "pair-as-spread" | "independent-pages";
const SPREAD_UNDERSCORE_HANDLING: Record<string, SpreadUnderscoreHandling> = {
  "uncut-magazine": "pair-as-spread",
  "leisure-boating": "independent-pages",
};

const ISSUE_ID_PATTERN =
  /^(Issue\d+|January\d{4}|February\d{4}|March\d{4}|April\d{4}|May\d{4}|June\d{4}|July\d{4}|August\d{4}|September\d{4}|October\d{4}|November\d{4}|December\d{4})$/;

type Block =
  | { type: "cover"; asset: string }
  | { type: "page"; asset: string }
  | { type: "spread"; left: string; right: string };

interface RawGroup {
  descriptor?: string;
  issueId?: string;
  covers: { variant: string; filename: string }[];
  pages: { num: string; filename: string }[];
  spreadHalves: Map<string, { L?: string; R?: string }>;
  spreadUnderscore: { num: string; filename: string }[];
}

function isNumeric(tok: string): boolean {
  return /^\d+$/.test(tok);
}

interface ParsedFile {
  filename: string;
  rawClient: string;
  issueId?: string;
  descriptor?: string;
  kind: "cover" | "page" | "spread-half" | "spread-underscore" | "mockup-skip" | "unrecognised";
  variant?: string;
  side?: "L" | "R";
}

function parseFilename(filename: string): ParsedFile {
  const base = filename.replace(/\.[^.]+$/, "");
  const tokens = base.split("_");
  if (tokens.length < 3) {
    return { filename, rawClient: tokens[1] ?? "", kind: "unrecognised" };
  }

  const [, rawClient, ...rest] = tokens; // tokens[0] is YEAR, unused for grouping
  let idx = 0;
  let issueId: string | undefined;
  if (ISSUE_ID_PATTERN.test(rest[idx])) {
    issueId = rest[idx];
    idx++;
  }
  idx++; // skip Discipline token — not part of the grouping key
  const afterDiscipline = rest.slice(idx);
  if (afterDiscipline.length === 0) {
    return { filename, rawClient, issueId, kind: "unrecognised" };
  }

  // Flat files are preferred over mockup renders (CLAUDE.md standing rule).
  // Only skip these where a flat equivalent exists in this drop (Uncut).
  if (afterDiscipline.some((t) => /^Mockup/.test(t))) {
    return { filename, rawClient, issueId, kind: "mockup-skip" };
  }

  const last = afterDiscipline[afterDiscipline.length - 1];
  const last2 = afterDiscipline[afterDiscipline.length - 2];
  const descriptorOf = (dropCount: number) => afterDiscipline.slice(0, afterDiscipline.length - dropCount)[0];

  if ((last === "PageL" || last === "PageR") && last2 && /^Spread\d+$/.test(last2)) {
    return {
      filename,
      rawClient,
      issueId,
      descriptor: descriptorOf(2),
      kind: "spread-half",
      variant: last2.replace("Spread", ""),
      side: last === "PageL" ? "L" : "R",
    };
  }

  if (last2 === "Spread" && isNumeric(last)) {
    return { filename, rawClient, issueId, descriptor: descriptorOf(2), kind: "spread-underscore", variant: last };
  }

  if (/^Page\d+$/.test(last)) {
    return { filename, rawClient, issueId, descriptor: descriptorOf(1), kind: "page", variant: last.replace("Page", "") };
  }

  if (last === "Cover") {
    return { filename, rawClient, issueId, descriptor: descriptorOf(1), kind: "cover", variant: "01" };
  }
  if (last2 === "Cover" && isNumeric(last)) {
    return { filename, rawClient, issueId, descriptor: descriptorOf(2), kind: "cover", variant: last };
  }

  // Bare trailing number, no recognised type keyword. Confirmed by
  // Christopher, 2026-07-03: treat these as standalone single pages.
  if (isNumeric(last)) {
    return { filename, rawClient, issueId, descriptor: descriptorOf(1), kind: "page", variant: last };
  }

  return { filename, rawClient, issueId, kind: "unrecognised" };
}

function groupKeyFor(issueId: string | undefined, descriptor: string | undefined): string {
  return `${issueId ?? ""}::${descriptor ?? ""}`;
}

function displayKeyFor(issueId: string | undefined, descriptor: string | undefined): string {
  if (issueId && descriptor) return `${issueId}/${descriptor}`;
  if (issueId) return issueId;
  if (descriptor) return descriptor;
  return "_root";
}

function blockFilenames(block: Block): string[] {
  return block.type === "spread" ? [block.left, block.right] : [block.asset];
}

function toIdentifier(filename: string): string {
  const base = filename.replace(/\.[^.]+$/, "");
  return "img_" + base.replace(/[^a-zA-Z0-9_]/g, "_");
}

// Emits a companion .ts file with one static import per file this project's
// manifest actually references, so Rollup only ever bundles those — not
// every candidate file `import.meta.glob` would otherwise have to consider.
// Confirmed necessary 2026-07-03: a glob-based lazy loader over the whole
// "new images" folder made Cloudflare's build output balloon from
// 7.5MB/51 files to 176MB/521 files, since Rollup must generate a chunk for
// every file a dynamic import() could ever resolve to, not just the ones a
// reviewed manifest actually uses.
function writeAssetsModule(slug: string, cover: Block | undefined, groups: { blocks: Block[] }[], outDir: string) {
  const filenames = new Set<string>();
  if (cover) blockFilenames(cover).forEach((f) => filenames.add(f));
  for (const group of groups) {
    for (const block of group.blocks) blockFilenames(block).forEach((f) => filenames.add(f));
  }

  const sorted = [...filenames].sort();
  const lines: string[] = [
    "// AUTO-GENERATED by scripts/generate-content-manifest.ts — do not edit by hand.",
    "// Regenerate via `pnpm --filter @workspace/scripts generate-content-manifest`.",
    '// Static imports for exactly the files this project\'s manifest references, so only',
    '// these reach the production bundle — see the comment on writeAssetsModule() in the',
    "// generator for why this exists instead of a folder-wide glob.",
    'import type { Pic } from "@/components/Picture";',
    "",
  ];
  for (const filename of sorted) {
    const id = toIdentifier(filename);
    lines.push(`import ${id} from "@/assets/new images/${filename}?format=webp;jpg&as=picture";`);
  }
  lines.push("", "export const assets: Record<string, Pic> = {");
  for (const filename of sorted) {
    lines.push(`  ${JSON.stringify(filename)}: ${toIdentifier(filename)},`);
  }
  lines.push("};", "");

  const outPath = join(outDir, `${slug}.assets.ts`);
  writeFileSync(outPath, lines.join("\n"));
  return outPath;
}

function buildGroupBlocks(slug: string, displayKey: string, group: RawGroup): Block[] {
  const items: { order: number; block: Block }[] = [];

  const sortedCovers = [...group.covers].sort((a, b) => Number(a.variant) - Number(b.variant));
  if (sortedCovers.length > 0) {
    items.push({ order: -1, block: { type: "cover", asset: sortedCovers[0].filename } });
    if (sortedCovers.length > 1) {
      console.log(
        `    (group "${displayKey}": ${sortedCovers.length} cover variants found, using ${sortedCovers[0].filename}; ` +
          `unused: ${sortedCovers.slice(1).map((c) => c.filename).join(", ")})`,
      );
    }
  }

  for (const p of group.pages) {
    items.push({ order: Number(p.num), block: { type: "page", asset: p.filename } });
  }

  for (const [num, halves] of group.spreadHalves) {
    if (!halves.L || !halves.R) {
      const found = halves.L ?? halves.R;
      throw new Error(
        `Missing spread pair for "${slug}" group "${displayKey}" Spread${num}: found only ${found} — ` +
          `both PageL and PageR are required. Refusing to render a half spread (per content-flow brief hard-fail rule).`,
      );
    }
    items.push({ order: Number(num), block: { type: "spread", left: halves.L, right: halves.R } });
  }

  if (group.spreadUnderscore.length > 0) {
    const handling = SPREAD_UNDERSCORE_HANDLING[slug];
    if (!handling) {
      throw new Error(
        `Unrecognised "Spread_NN" filename pattern for "${slug}" group "${displayKey}": ` +
          `${group.spreadUnderscore.map((s) => s.filename).join(", ")}. ` +
          `This doesn't match Spread##_PageL/PageR and has no confirmed handling rule in SPREAD_UNDERSCORE_HANDLING — ` +
          `ask Christopher whether these are a paired spread or independent pages before adding one.`,
      );
    }
    const sorted = [...group.spreadUnderscore].sort((a, b) => Number(a.num) - Number(b.num));
    if (handling === "pair-as-spread") {
      for (let i = 0; i < sorted.length; i += 2) {
        const left = sorted[i];
        const right = sorted[i + 1];
        if (!right) {
          throw new Error(
            `Odd number of "Spread_NN" files for "${slug}" group "${displayKey}" — ${left.filename} has no pairing partner.`,
          );
        }
        items.push({ order: Number(left.num), block: { type: "spread", left: left.filename, right: right.filename } });
      }
    } else {
      for (const s of sorted) {
        items.push({ order: Number(s.num), block: { type: "page", asset: s.filename } });
      }
    }
  }

  if (group.pages.length > 0 && group.spreadHalves.size > 0) {
    console.log(
      `    (group "${displayKey}": mixes Page## and Spread## files — order between them is inferred numerically, ` +
        `not guaranteed correct. Confirm visually in Phase 2.)`,
    );
  }

  items.sort((a, b) => a.order - b.order);
  return items.map((i) => i.block);
}

function main() {
  const files = readdirSync(ASSETS_DIR).sort();
  console.log(`Scanned ${files.length} files in "new images".\n`);

  const bySlug = new Map<string, Map<string, RawGroup>>();
  const skippedOutOfScope = new Map<string, number>();
  const skippedMockups: string[] = [];
  const unrecognised: string[] = [];

  for (const filename of files) {
    const parsed = parseFilename(filename);

    if (parsed.kind === "unrecognised") {
      unrecognised.push(filename);
      continue;
    }
    if (parsed.kind === "mockup-skip") {
      skippedMockups.push(filename);
      continue;
    }

    const slug = CLIENT_SLUGS[parsed.rawClient];
    if (!slug) {
      skippedOutOfScope.set(parsed.rawClient, (skippedOutOfScope.get(parsed.rawClient) ?? 0) + 1);
      continue;
    }

    const allowedIssues = ISSUE_ALLOWLIST[parsed.rawClient];
    if (allowedIssues && (!parsed.issueId || !allowedIssues.includes(parsed.issueId))) {
      const label = `${parsed.rawClient} ${parsed.issueId ?? "(no issue)"}`;
      skippedOutOfScope.set(label, (skippedOutOfScope.get(label) ?? 0) + 1);
      continue;
    }

    if (!bySlug.has(slug)) bySlug.set(slug, new Map());
    const groups = bySlug.get(slug)!;
    const gkey = groupKeyFor(parsed.issueId, parsed.descriptor);
    if (!groups.has(gkey)) {
      groups.set(gkey, {
        descriptor: parsed.descriptor,
        issueId: parsed.issueId,
        covers: [],
        pages: [],
        spreadHalves: new Map(),
        spreadUnderscore: [],
      });
    }
    const group = groups.get(gkey)!;

    switch (parsed.kind) {
      case "cover":
        group.covers.push({ variant: parsed.variant!, filename });
        break;
      case "page":
        group.pages.push({ num: parsed.variant!, filename });
        break;
      case "spread-half": {
        if (!group.spreadHalves.has(parsed.variant!)) group.spreadHalves.set(parsed.variant!, {});
        group.spreadHalves.get(parsed.variant!)![parsed.side!] = filename;
        break;
      }
      case "spread-underscore":
        group.spreadUnderscore.push({ num: parsed.variant!, filename });
        break;
    }
  }

  mkdirSync(OUTPUT_DIR, { recursive: true });

  for (const [slug, groups] of bySlug) {
    console.log(`\n=== ${slug} ===`);
    const outputGroups: { key: string; blocks: Block[] }[] = [];
    let projectCover: Block | undefined;

    for (const [, group] of groups) {
      const displayKey = displayKeyFor(group.issueId, group.descriptor);
      const blocks = buildGroupBlocks(slug, displayKey, group);
      outputGroups.push({ key: displayKey, blocks });

      const coverBlock = blocks.find((b): b is Extract<Block, { type: "cover" }> => b.type === "cover");
      if (coverBlock && !projectCover) {
        projectCover = coverBlock;
      }
    }

    if (!projectCover) {
      console.log(`  WARNING: no cover asset found for "${slug}" — project-level "cover" left empty.`);
    }

    const outPath = join(OUTPUT_DIR, `${slug}.json`);

    // Preserve a human-confirmed "reviewed": true from a prior run — this
    // script must never silently re-draft (and thereby un-review) a manifest
    // Christopher has already reordered and signed off on (Phase 2).
    let previouslyReviewed = false;
    if (existsSync(outPath)) {
      try {
        previouslyReviewed = JSON.parse(readFileSync(outPath, "utf8")).reviewed === true;
      } catch {
        // ignore unreadable/corrupt existing file, treat as not-yet-reviewed
      }
    }
    if (previouslyReviewed) {
      console.log(`  NOTE: existing manifest was marked reviewed:true — preserving that flag. Re-check group order if source assets changed.`);
    }

    const manifest = {
      slug,
      ...(previouslyReviewed ? { reviewed: true } : {}),
      cover: projectCover ?? null,
      groups: outputGroups,
    };

    writeFileSync(outPath, JSON.stringify(manifest, null, 2) + "\n");
    const assetsPath = writeAssetsModule(slug, projectCover, outputGroups, OUTPUT_DIR);

    console.log(`  groups: ${outputGroups.length}${outputGroups.length > 1 ? " (multi-group — needs Phase 2 manual reorder + reviewed:true)" : " (single-group — no manual reorder needed)"}`);
    console.log(`  cover: ${projectCover ? (projectCover as { asset: string }).asset : "none"}`);
    console.log(`  written: ${outPath}`);
    console.log(`  written: ${assetsPath}`);
    for (const g of outputGroups) {
      console.log(`    [${g.key}] ${g.blocks.length} block(s): ${g.blocks.map((b) => b.type).join(", ")}`);
    }
  }

  console.log("\n=== Skipped (out of launch scope — CLAUDE.md Section 1 deferred list) ===");
  for (const [client, count] of skippedOutOfScope) {
    console.log(`  ${client}: ${count} file(s)`);
  }

  if (skippedMockups.length > 0) {
    console.log("\n=== Skipped (mockup variant, flat file preferred) ===");
    for (const f of skippedMockups) console.log(`  ${f}`);
  }

  if (unrecognised.length > 0) {
    console.log("\n=== UNRECOGNISED — did not match any known filename pattern ===");
    for (const f of unrecognised) console.log(`  ${f}`);
  }

  console.log(
    "\nGroups above are in filesystem-encounter order only. Cross-group running order for multi-group " +
      "projects is NOT inferred — it is a manual editorial decision (Phase 2). Do not treat group order as final.",
  );
}

main();
