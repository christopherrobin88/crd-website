import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const images = join(root, "src", "assets", "images");
const heroLegacyAsset = join(images, "web_hero_laptop.svg");
const heroArtComponent = join(root, "src", "components", "HeroLaptopArt.tsx");

// The static raster/SVG hero (web_hero_laptop.svg) was superseded by the
// animated HeroLaptopArt component on 2026-07-19 (see docs/scope.md). The
// legacy asset file is left on disk deliberately as a pending cleanup item
// and is no longer required to be wired into HeroLaptop.tsx.
for (const path of [heroLegacyAsset, heroArtComponent]) {
  if (!existsSync(path)) throw new Error(`validate-hero: missing ${path}`);
}

const component = readFileSync(join(root, "src", "components", "HeroLaptop.tsx"), "utf8");
if (!component.includes("HeroLaptopArt")) {
  throw new Error("validate-hero: HeroLaptop must render the animated HeroLaptopArt illustration");
}

const picture = readFileSync(join(root, "src", "components", "Picture.tsx"), "utf8");
if (!picture.includes("`image/${type === \"jpg\" ? \"jpeg\" : type}`")) {
  throw new Error("validate-hero: Picture MIME normalisation is missing");
}

console.log("validate-hero: supplied SVG hero asset and MIME handling OK.");
