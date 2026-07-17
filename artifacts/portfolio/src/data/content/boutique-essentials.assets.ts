// Hand-curated (following the Phase 2 pattern) — production assets live in
// src/assets/images/boutique-essentials/. Single presentable asset as of
// 2026-07-11: the olive-label product mockup from Drive (Boutique Essentials/
// Mood board/Olive green concept.jpg). The other concept renders in that
// folder are AI generations with unusable label artefacts — do not add them
// without flat label artwork exported from the working files.
import type { Pic } from "@/components/Picture";

import img_amenity_range_cover from "@/assets/images/boutique-essentials/amenity-range-cover.jpg?format=webp;jpg&as=picture";

export const assets: Record<string, Pic> = {
  "amenity-range-cover.jpg": img_amenity_range_cover,
};
