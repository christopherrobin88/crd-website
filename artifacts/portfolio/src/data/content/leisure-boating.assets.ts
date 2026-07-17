// Hand-curated for Phase 2 (project asset cleanup) — production assets live in
// src/assets/images/leisure-boating/. Historically generated from the "new images" staging
// folder by scripts/generate-content-manifest.ts; that folder is now staging-only
// and pending archive. Keep imports limited to files the manifest references so
// only they reach the production bundle.
import type { Pic } from "@/components/Picture";

import img_cover_01 from "@/assets/images/leisure-boating/cover-01.png?format=webp;jpg&as=picture";
import img_cover_02 from "@/assets/images/leisure-boating/cover-02.png?format=webp;jpg&as=picture";
import img_cover_03 from "@/assets/images/leisure-boating/cover-03.png?format=webp;jpg&as=picture";
import img_spread_01 from "@/assets/images/leisure-boating/spread-01.png?format=webp;jpg&as=picture";
import img_spread_02 from "@/assets/images/leisure-boating/spread-02.png?format=webp;jpg&as=picture";

export const assets: Record<string, Pic> = {
  "cover-01.png": img_cover_01,
  "cover-02.png": img_cover_02,
  "cover-03.png": img_cover_03,
  "spread-01.png": img_spread_01,
  "spread-02.png": img_spread_02,
};
