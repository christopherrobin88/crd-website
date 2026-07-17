import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const images = join(root, "src", "assets", "images");
const hero = join(images, "web_hero_laptop.svg");

for (const path of [hero]) {
  if (!existsSync(path)) throw new Error(`validate-hero: missing ${path}`);
}

const component = readFileSync(join(root, "src", "components", "HeroLaptop.tsx"), "utf8");
if (!component.includes("web_hero_laptop.svg")) {
  throw new Error("validate-hero: HeroLaptop must use the supplied SVG artwork");
}

const picture = readFileSync(join(root, "src", "components", "Picture.tsx"), "utf8");
if (!picture.includes("`image/${type === \"jpg\" ? \"jpeg\" : type}`")) {
  throw new Error("validate-hero: Picture MIME normalisation is missing");
}

console.log("validate-hero: supplied SVG hero asset and MIME handling OK.");
