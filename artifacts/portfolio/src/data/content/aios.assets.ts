// Hand-curated (following the Phase 2 pattern) — production assets live in
// src/assets/images/aios/. Five boards selected by Christopher (2026-07-11)
// from Drive: CRD-Portfolio/CRD Website Editions/AIOS DASHBOARD DESIGN.
// Presented on the site as CONCEPTUAL renders — process work, not shipped
// product. The Drive folder holds more of the series (concepts 1 and 4,
// options 1 and 2, further dashboards) awaiting a decision before adding.
import type { Pic } from "@/components/Picture";

import img_option_03_identity from "@/assets/images/aios/option-03-identity.png?format=webp;jpg&as=picture";
import img_concept_02_identity from "@/assets/images/aios/concept-02-identity.png?format=webp;jpg&as=picture";
import img_concept_03_identity from "@/assets/images/aios/concept-03-identity.png?format=webp;jpg&as=picture";
import img_concept_05_identity from "@/assets/images/aios/concept-05-identity.png?format=webp;jpg&as=picture";
import img_orchestration_dashboard from "@/assets/images/aios/orchestration-dashboard.png?format=webp;jpg&as=picture";

export const assets: Record<string, Pic> = {
  "option-03-identity.png": img_option_03_identity,
  "concept-02-identity.png": img_concept_02_identity,
  "concept-03-identity.png": img_concept_03_identity,
  "concept-05-identity.png": img_concept_05_identity,
  "orchestration-dashboard.png": img_orchestration_dashboard,
};
