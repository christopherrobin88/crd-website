// Hand-curated for Phase 2 (project asset cleanup) — production assets live in
// src/assets/images/rei/. Historically generated from the "new images" staging
// folder by scripts/generate-content-manifest.ts; that folder is now staging-only
// and pending archive. Keep imports limited to files the manifest references so
// only they reach the production bundle.
import type { Pic } from "@/components/Picture";

import img_april_may_2020_cover from "@/assets/images/rei/april-may-2020-cover.jpg?format=webp;jpg&as=picture";
import img_april_may_2020_how_to_beat_covid_19_spread_01_page_l from "@/assets/images/rei/april-may-2020-how-to-beat-covid-19-spread-01-page-l.jpg?format=webp;jpg&as=picture";
import img_april_may_2020_how_to_beat_covid_19_spread_01_page_r from "@/assets/images/rei/april-may-2020-how-to-beat-covid-19-spread-01-page-r.jpg?format=webp;jpg&as=picture";
import img_april_may_2020_how_to_beat_covid_19_spread_02_page_l from "@/assets/images/rei/april-may-2020-how-to-beat-covid-19-spread-02-page-l.jpg?format=webp;jpg&as=picture";
import img_april_may_2020_how_to_beat_covid_19_spread_02_page_r from "@/assets/images/rei/april-may-2020-how-to-beat-covid-19-spread-02-page-r.jpg?format=webp;jpg&as=picture";
import img_dec_jan_2020_cover from "@/assets/images/rei/dec-jan-2020-cover.jpg?format=webp;jpg&as=picture";
import img_june_july_2019_cover from "@/assets/images/rei/june-july-2019-cover.jpg?format=webp;jpg&as=picture";
import img_june_july_2019_risky_business_spread_01_page_l from "@/assets/images/rei/june-july-2019-risky-business-spread-01-page-l.jpg?format=webp;jpg&as=picture";
import img_june_july_2019_risky_business_spread_01_page_r from "@/assets/images/rei/june-july-2019-risky-business-spread-01-page-r.jpg?format=webp;jpg&as=picture";
import img_june_july_2019_risky_business_spread_02_page_l from "@/assets/images/rei/june-july-2019-risky-business-spread-02-page-l.jpg?format=webp;jpg&as=picture";
import img_june_july_2019_risky_business_spread_02_page_r from "@/assets/images/rei/june-july-2019-risky-business-spread-02-page-r.jpg?format=webp;jpg&as=picture";

export const assets: Record<string, Pic> = {
  "april-may-2020-cover.jpg": img_april_may_2020_cover,
  "april-may-2020-how-to-beat-covid-19-spread-01-page-l.jpg": img_april_may_2020_how_to_beat_covid_19_spread_01_page_l,
  "april-may-2020-how-to-beat-covid-19-spread-01-page-r.jpg": img_april_may_2020_how_to_beat_covid_19_spread_01_page_r,
  "april-may-2020-how-to-beat-covid-19-spread-02-page-l.jpg": img_april_may_2020_how_to_beat_covid_19_spread_02_page_l,
  "april-may-2020-how-to-beat-covid-19-spread-02-page-r.jpg": img_april_may_2020_how_to_beat_covid_19_spread_02_page_r,
  "dec-jan-2020-cover.jpg": img_dec_jan_2020_cover,
  "june-july-2019-cover.jpg": img_june_july_2019_cover,
  "june-july-2019-risky-business-spread-01-page-l.jpg": img_june_july_2019_risky_business_spread_01_page_l,
  "june-july-2019-risky-business-spread-01-page-r.jpg": img_june_july_2019_risky_business_spread_01_page_r,
  "june-july-2019-risky-business-spread-02-page-l.jpg": img_june_july_2019_risky_business_spread_02_page_l,
  "june-july-2019-risky-business-spread-02-page-r.jpg": img_june_july_2019_risky_business_spread_02_page_r,
};
