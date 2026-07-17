/**
 * Build-time prerender. Runs after the client and SSR bundles are built:
 * renders every public route through the SSR entry, bakes that route's
 * metadata (title, description, canonical, Open Graph, Twitter) into its own
 * static HTML file, and regenerates the sitemap from the same route list so
 * crawlers and link-preview clients get correct content without hydration.
 *
 * Cloudflare serves real files before falling back to the SPA document, so
 * /work/index.html, /project/<slug>/index.html etc. win over the fallback for
 * direct hits while client-side routing is untouched.
 */
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

interface PageMeta {
  path: string;
  title: string;
  description: string;
  ogType: "website" | "article";
  image: { url: string; width: number; height: number };
}

const projectRoot = path.resolve(import.meta.dirname, "..");
const publicDir = path.join(projectRoot, "dist", "public");
const serverDir = path.join(projectRoot, "dist", "server");
const serverEntry = path.join(serverDir, "entry-server.js");
const indexPath = path.join(publicDir, "index.html");

const { render, routeMetaList, canonicalUrl, absoluteImageUrl } = (await import(
  pathToFileURL(serverEntry).href
)) as {
  render: (pathname: string) => Promise<string>;
  routeMetaList: PageMeta[];
  canonicalUrl: (p: string) => string;
  absoluteImageUrl: (image: PageMeta["image"]) => string;
};

const template = await readFile(indexPath, "utf8");
const root = '<div id="root"></div>';

if (!template.includes(root)) {
  throw new Error(
    "Prerender failed because the empty application root was not found.",
  );
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function headFor(meta: PageMeta): string {
  const title = escapeHtml(meta.title);
  const description = escapeHtml(meta.description);
  const canonical = canonicalUrl(meta.path);
  const image = absoluteImageUrl(meta.image);
  return [
    `<title>${title}</title>`,
    `<meta name="description" content="${description}" />`,
    `<meta name="robots" content="index, follow" />`,
    `<meta name="theme-color" content="#12322F" />`,
    `<link rel="canonical" href="${canonical}" />`,
    `<!-- Open Graph -->`,
    `<meta property="og:site_name" content="Christopher Robin Design" />`,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${description}" />`,
    `<meta property="og:type" content="${meta.ogType}" />`,
    `<meta property="og:url" content="${canonical}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta property="og:image:width" content="${meta.image.width}" />`,
    `<meta property="og:image:height" content="${meta.image.height}" />`,
    `<!-- Twitter / X -->`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${title}" />`,
    `<meta name="twitter:description" content="${description}" />`,
    `<meta name="twitter:image" content="${image}" />`,
  ].join("\n    ");
}

// Everything between the head markers in index.html is route metadata owned
// by this script; the markers keep the replacement exact rather than regex
// guesswork over individual tags.
const HEAD_START = "<!-- route-meta:start -->";
const HEAD_END = "<!-- route-meta:end -->";

async function documentFor(meta: PageMeta): Promise<string> {
  const startIndex = template.indexOf(HEAD_START);
  const endIndex = template.indexOf(HEAD_END);
  if (startIndex === -1 || endIndex === -1) {
    throw new Error(
      "Prerender failed because index.html is missing the route-meta markers.",
    );
  }
  const head =
    template.slice(0, startIndex) +
    headFor(meta) +
    template.slice(endIndex + HEAD_END.length);
  return head.replace(
    root,
    `<div id="root" data-prerendered-path="${meta.path}">${await render(meta.path)}</div>`,
  );
}

for (const meta of routeMetaList) {
  const html = await documentFor(meta);
  if (meta.path === "/") {
    await writeFile(indexPath, html);
  } else {
    // <route>.html, not <route>/index.html: Cloudflare's html_handling and
    // vite preview both serve /work directly from work.html, whereas a
    // directory index forces a trailing-slash redirect and changes the
    // public URL.
    const segments = meta.path.split("/").filter(Boolean);
    const fileName = `${segments.pop()}.html`;
    const outDir = path.join(publicDir, ...segments);
    await mkdir(outDir, { recursive: true });
    await writeFile(path.join(outDir, fileName), html);
  }
  console.log(`prerender: ${meta.path}`);
}

// Sitemap from the same route list — cannot drift from the rendered routes.
const sitemap = [
  `<?xml version="1.0" encoding="UTF-8"?>`,
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
  ...routeMetaList.map(
    (meta) => `  <url>\n    <loc>${canonicalUrl(meta.path)}</loc>\n  </url>`,
  ),
  `</urlset>`,
  ``,
].join("\n");
await writeFile(path.join(publicDir, "sitemap.xml"), sitemap);
console.log(`prerender: sitemap.xml (${routeMetaList.length} URLs)`);

await rm(serverDir, { recursive: true, force: true });
