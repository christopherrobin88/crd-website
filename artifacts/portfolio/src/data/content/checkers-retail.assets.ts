// Hand-curated for Phase 2 (project asset cleanup) — production assets live in
// src/assets/images/checkers/. Historically generated from the "new images" staging
// folder by scripts/generate-content-manifest.ts; that folder is now staging-only
// and pending archive. Keep imports limited to files the manifest references so
// only they reach the production bundle.
import type { Pic } from "@/components/Picture";

import img_baking_essentials_01 from "@/assets/images/checkers/baking-essentials-01.jpg?format=webp;jpg&as=picture";
import img_foods_xxl_01 from "@/assets/images/checkers/foods-xxl-01.jpg?format=webp;jpg&as=picture";
import img_gillette_old_spice_01 from "@/assets/images/checkers/gillette-old-spice-01.jpg?format=webp;jpg&as=picture";
import img_mc_cain_meal_time_01 from "@/assets/images/checkers/mc-cain-meal-time-01.jpg?format=webp;jpg&as=picture";
import img_month_end_may_leaflet_cover from "@/assets/images/checkers/month-end-may-leaflet-cover.jpeg?format=webp;jpg&as=picture";
import img_month_end_may_leaflet_page_06 from "@/assets/images/checkers/month-end-may-leaflet-page-06.jpeg?format=webp;jpg&as=picture";
import img_month_end_may_leaflet_spread_01_page_l from "@/assets/images/checkers/month-end-may-leaflet-spread-01-page-l.jpeg?format=webp;jpg&as=picture";
import img_month_end_may_leaflet_spread_01_page_r from "@/assets/images/checkers/month-end-may-leaflet-spread-01-page-r.jpeg?format=webp;jpg&as=picture";
import img_month_end_may_leaflet_spread_02_page_l from "@/assets/images/checkers/month-end-may-leaflet-spread-02-page-l.jpeg?format=webp;jpg&as=picture";
import img_month_end_may_leaflet_spread_02_page_r from "@/assets/images/checkers/month-end-may-leaflet-spread-02-page-r.jpeg?format=webp;jpg&as=picture";
import img_new_years_xtra_cover from "@/assets/images/checkers/new-years-xtra-cover.jpeg?format=webp;jpg&as=picture";
import img_new_years_xtra_page_04 from "@/assets/images/checkers/new-years-xtra-page-04.jpeg?format=webp;jpg&as=picture";
import img_new_years_xtra_spread_01_page_l from "@/assets/images/checkers/new-years-xtra-spread-01-page-l.jpeg?format=webp;jpg&as=picture";
import img_new_years_xtra_spread_01_page_r from "@/assets/images/checkers/new-years-xtra-spread-01-page-r.jpeg?format=webp;jpg&as=picture";
import img_president_cheese_01 from "@/assets/images/checkers/president-cheese-01.jpg?format=webp;jpg&as=picture";

export const assets: Record<string, Pic> = {
  "baking-essentials-01.jpg": img_baking_essentials_01,
  "foods-xxl-01.jpg": img_foods_xxl_01,
  "gillette-old-spice-01.jpg": img_gillette_old_spice_01,
  "mc-cain-meal-time-01.jpg": img_mc_cain_meal_time_01,
  "month-end-may-leaflet-cover.jpeg": img_month_end_may_leaflet_cover,
  "month-end-may-leaflet-page-06.jpeg": img_month_end_may_leaflet_page_06,
  "month-end-may-leaflet-spread-01-page-l.jpeg": img_month_end_may_leaflet_spread_01_page_l,
  "month-end-may-leaflet-spread-01-page-r.jpeg": img_month_end_may_leaflet_spread_01_page_r,
  "month-end-may-leaflet-spread-02-page-l.jpeg": img_month_end_may_leaflet_spread_02_page_l,
  "month-end-may-leaflet-spread-02-page-r.jpeg": img_month_end_may_leaflet_spread_02_page_r,
  "new-years-xtra-cover.jpeg": img_new_years_xtra_cover,
  "new-years-xtra-page-04.jpeg": img_new_years_xtra_page_04,
  "new-years-xtra-spread-01-page-l.jpeg": img_new_years_xtra_spread_01_page_l,
  "new-years-xtra-spread-01-page-r.jpeg": img_new_years_xtra_spread_01_page_r,
  "president-cheese-01.jpg": img_president_cheese_01,
};
