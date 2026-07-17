// Hand-curated for Phase 2 (project asset cleanup) — production assets live in
// src/assets/images/uncut/. Historically generated from the "new images" staging
// folder by scripts/generate-content-manifest.ts; that folder is now staging-only
// and pending archive. Keep imports limited to files the manifest references so
// only they reach the production bundle.
import type { Pic } from "@/components/Picture";

import img_issue_94_cover from "@/assets/images/uncut/issue-94-cover.jpg?format=webp;jpg&as=picture";
import img_issue_94_spread_01 from "@/assets/images/uncut/issue-94-spread-01.jpg?format=webp;jpg&as=picture";
import img_issue_94_spread_02 from "@/assets/images/uncut/issue-94-spread-02.jpg?format=webp;jpg&as=picture";

export const assets: Record<string, Pic> = {
  "issue-94-cover.jpg": img_issue_94_cover,
  "issue-94-spread-01.jpg": img_issue_94_spread_01,
  "issue-94-spread-02.jpg": img_issue_94_spread_02,
};
