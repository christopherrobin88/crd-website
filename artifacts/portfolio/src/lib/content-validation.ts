// Pure validation/loading logic for content-flow manifests, shared between
// the app bundle (src/data/projects.ts) and the prebuild check
// (scripts/validate-content.ts). Deliberately uses only relative imports —
// this module also runs standalone under tsx/Node outside Vite, where the
// "@/" path alias isn't resolved.

import type { ContentBlock, ProjectContent } from "../types/content";

export interface RawGroup {
  key: string;
  blocks: unknown[];
}

export interface RawManifest {
  slug: string;
  reviewed?: boolean;
  cover: unknown;
  groups: RawGroup[];
}

export function isContentBlock(value: unknown): value is ContentBlock {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  if (v.type === "cover") return typeof v.asset === "string";
  if (v.type === "page") {
    return typeof v.asset === "string" && (v.group === undefined || typeof v.group === "string");
  }
  if (v.type === "spread") {
    return (
      typeof v.left === "string" &&
      typeof v.right === "string" &&
      (v.group === undefined || typeof v.group === "string")
    );
  }
  return false;
}

// Guardrail: cross-group running order for multi-group projects (e.g.
// multi-feature issues) is an editorial decision, not something this
// pipeline infers. A draft manifest must be manually reordered and marked
// reviewed before it's allowed to reach production.
export function loadProjectContent(raw: RawManifest): ProjectContent {
  if (typeof raw.slug !== "string" || !Array.isArray(raw.groups)) {
    throw new Error('Malformed content manifest: missing "slug" or "groups" array.');
  }

  if (!isContentBlock(raw.cover) || raw.cover.type !== "cover") {
    throw new Error(`Content manifest for "${raw.slug}" has no valid "cover" block.`);
  }

  if (raw.groups.length > 1 && raw.reviewed !== true) {
    throw new Error(
      `Content manifest for "${raw.slug}" has ${raw.groups.length} groups but is not marked "reviewed": true. ` +
        `Cross-group running order must be manually confirmed before this project can build ` +
        `(see src/data/content/${raw.slug}.json).`,
    );
  }

  const sequence: ContentBlock[] = [];
  for (const group of raw.groups) {
    if (typeof group.key !== "string" || !Array.isArray(group.blocks)) {
      throw new Error(`Content manifest for "${raw.slug}" has a malformed group entry.`);
    }
    for (const rawBlock of group.blocks) {
      if (!isContentBlock(rawBlock)) {
        throw new Error(
          `Content manifest for "${raw.slug}" group "${group.key}" has a malformed block: ${JSON.stringify(rawBlock)}`,
        );
      }
      sequence.push(rawBlock.type === "cover" ? rawBlock : { ...rawBlock, group: group.key });
    }
  }

  return {
    slug: raw.slug,
    cover: raw.cover,
    sequence,
    reviewed: true,
  };
}
