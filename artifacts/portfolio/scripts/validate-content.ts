// Prebuild guardrail for the content-flow system. Runs before `vite build`
// (wired as package.json's "prebuild" script) because Rollup only bundles
// application source, it does not execute it — a thrown error inside
// src/data/projects.ts would otherwise only surface as a runtime crash for
// a real visitor, not as a failed build/deploy. This script actually
// executes the same validation eagerly, in plain Node, so a bad manifest
// fails the build instead of shipping.

import { readdirSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { loadProjectContent, type RawManifest } from "../src/lib/content-validation.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = join(__dirname, "..", "src", "data", "content");

const files = readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".json"));
if (files.length === 0) {
  console.log("validate-content: no manifests found in src/data/content — nothing to check.");
  process.exit(0);
}

let failed = false;
for (const file of files) {
  const path = join(CONTENT_DIR, file);
  const raw = JSON.parse(readFileSync(path, "utf8")) as RawManifest;
  try {
    const content = loadProjectContent(raw);
    console.log(`validate-content: OK  ${file}  (${content.sequence.length} blocks)`);
  } catch (err) {
    failed = true;
    console.error(`validate-content: FAIL  ${file}`);
    console.error(`  ${(err as Error).message}`);
  }
}

if (failed) {
  console.error("\nvalidate-content: one or more content manifests failed validation — build aborted.");
  process.exit(1);
}

console.log("validate-content: all manifests OK.");
