/**
 * One-off asset prep: cut the green watercolour leaf sprigs out of the
 * approved landing mockup (website_mockup.png) as alpha sprites, for the
 * animated edge-foliage layer (SiteBackground). Follows the standing rule in
 * CLAUDE.md Section 3: brand textures are cropped from approved assets and
 * composited — never AI-generated fresh.
 *
 * Keying: the sprigs are olive (low blue, r-g gap ≈ 0-5) while parchment is
 * warm (r-g gap ≈ 10-15) and lighter — alpha comes from a soft ramp on the
 * r-g gap gated by luminance, then a light feather so watercolour edges stay
 * soft. (g-r alone fails: olive watercolour is NOT green-dominant in RGB.)
 *
 * Run from artifacts/portfolio:
 *   pnpm tsx scripts/extract-foliage.ts <path-to-website_mockup.png>
 */
import { writeFileSync } from "fs";
import path from "path";
import sharp from "sharp";

const SRC = process.argv[2];
if (!SRC) {
  console.error("usage: pnpm tsx scripts/extract-foliage.ts <website_mockup.png>");
  process.exit(1);
}

const REGIONS = [
  // top offsets chosen to clear the CTA text / card edges above the sprigs
  { name: "foliage_left", left: 0, top: 892, width: 148, height: 183 },
  { name: "foliage_corner", left: 0, top: 1385, width: 250, height: 151 },
];

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

async function extract(region: (typeof REGIONS)[number]) {
  const { data, info } = await sharp(SRC)
    .extract(region)
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width: W, height: H, channels: C } = info;

  // alpha matte from olive-ness × darkness
  const matte = Buffer.alloc(W * H);
  for (let i = 0; i < W * H; i++) {
    const r = data[i * C], g = data[i * C + 1], b = data[i * C + 2];
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    const oliveness = clamp01((10 - (r - g)) / 10);
    const darkness = clamp01((195 - lum) / 25);
    matte[i] = Math.round(255 * clamp01(oliveness * darkness * 1.25));
  }
  const blurred = await sharp(matte, { raw: { width: W, height: H, channels: 1 } })
    .blur(0.8)
    .toColourspace("b-w")
    .raw()
    .toBuffer({ resolveWithObject: true });
  if (blurred.info.channels !== 1) {
    throw new Error(`expected 1-channel matte, got ${blurred.info.channels}`);
  }
  const feathered = blurred.data;

  const rgba = Buffer.alloc(W * H * 4);
  for (let i = 0; i < W * H; i++) {
    rgba[i * 4] = data[i * C];
    rgba[i * 4 + 1] = data[i * C + 1];
    rgba[i * 4 + 2] = data[i * C + 2];
    rgba[i * 4 + 3] = feathered[i];
  }

  const out = path.resolve(`src/assets/images/${region.name}.webp`);
  const buf = await sharp(rgba, { raw: { width: W, height: H, channels: 4 } })
    .webp({ quality: 90, alphaQuality: 90 })
    .toBuffer();
  writeFileSync(out, buf);
  console.log(`${region.name}: ${W}x${H} → ${out} (${buf.length} bytes)`);
}

for (const r of REGIONS) await extract(r);
