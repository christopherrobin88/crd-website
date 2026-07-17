// Hand-curated (following the Phase 2 pattern) — production assets live in
// src/assets/images/behelm/. Boards exported from the Behelm logo-system
// presentation PDF in Drive (Behelm/Behelm Presentation) at 150dpi; the
// misuse board (broken word-wrap in the source deck), colophon and blank
// pages were left out. Keep imports limited to files the manifest references
// so only they reach the production bundle.
import type { Pic } from "@/components/Picture";

import img_logo_system_cover from "@/assets/images/behelm/logo-system-cover.jpg?format=webp;jpg&as=picture";
import img_logo_system_page_01 from "@/assets/images/behelm/logo-system-page-01.jpg?format=webp;jpg&as=picture";
import img_logo_system_page_02 from "@/assets/images/behelm/logo-system-page-02.jpg?format=webp;jpg&as=picture";
import img_logo_system_page_03 from "@/assets/images/behelm/logo-system-page-03.jpg?format=webp;jpg&as=picture";
import img_logo_system_page_04 from "@/assets/images/behelm/logo-system-page-04.jpg?format=webp;jpg&as=picture";
import img_logo_system_page_05 from "@/assets/images/behelm/logo-system-page-05.jpg?format=webp;jpg&as=picture";
import img_logo_system_page_06 from "@/assets/images/behelm/logo-system-page-06.jpg?format=webp;jpg&as=picture";
import img_logo_system_page_07 from "@/assets/images/behelm/logo-system-page-07.jpg?format=webp;jpg&as=picture";
import img_logo_system_page_08 from "@/assets/images/behelm/logo-system-page-08.jpg?format=webp;jpg&as=picture";

export const assets: Record<string, Pic> = {
  "logo-system-cover.jpg": img_logo_system_cover,
  "logo-system-page-01.jpg": img_logo_system_page_01,
  "logo-system-page-02.jpg": img_logo_system_page_02,
  "logo-system-page-03.jpg": img_logo_system_page_03,
  "logo-system-page-04.jpg": img_logo_system_page_04,
  "logo-system-page-05.jpg": img_logo_system_page_05,
  "logo-system-page-06.jpg": img_logo_system_page_06,
  "logo-system-page-07.jpg": img_logo_system_page_07,
  "logo-system-page-08.jpg": img_logo_system_page_08,
};
