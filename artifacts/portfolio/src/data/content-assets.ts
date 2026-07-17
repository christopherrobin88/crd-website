// Maps a project slug to its generated static asset map (src/data/content/{slug}.assets.ts).
// Add a line here whenever generate-content-manifest.ts produces a new project's
// .assets.ts file — see docs/adding-a-project.md.
import type { Pic } from "@/components/Picture";
import { assets as uncutAssets } from "./content/uncut-magazine.assets";
import { assets as checkersAssets } from "./content/checkers-retail.assets";
import { assets as playboyAssets } from "./content/playboy-south-africa.assets";
import { assets as leisureBoatingAssets } from "./content/leisure-boating.assets";
import { assets as krugerAssets } from "./content/kruger-magazine.assets";
import { assets as agriprobeAssets } from "./content/agriprobe.assets";
import { assets as reiAssets } from "./content/real-estate-investor.assets";
import { assets as behelmAssets } from "./content/behelm.assets";
import { assets as boutiqueEssentialsAssets } from "./content/boutique-essentials.assets";
import { assets as aiosAssets } from "./content/aios.assets";

const assetsBySlug: Record<string, Record<string, Pic>> = {
  "uncut-magazine": uncutAssets,
  "checkers-retail": checkersAssets,
  "playboy-south-africa": playboyAssets,
  "leisure-boating": leisureBoatingAssets,
  "kruger-magazine": krugerAssets,
  "agriprobe": agriprobeAssets,
  "real-estate-investor": reiAssets,
  "behelm": behelmAssets,
  "boutique-essentials": boutiqueEssentialsAssets,
  "aios": aiosAssets,
};

export function getProjectAssets(slug: string): Record<string, Pic> {
  return assetsBySlug[slug] ?? {};
}
