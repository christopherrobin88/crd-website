import { useEffect } from "react";
import {
  absoluteImageUrl,
  canonicalUrl,
  metaForPath,
  type PageMeta,
} from "@/lib/meta";

function setNamedMeta(attr: "name" | "property", key: string, value: string) {
  let tag = document.head.querySelector<HTMLMetaElement>(
    `meta[${attr}="${key}"]`,
  );
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", value);
}

function applyMeta(meta: PageMeta) {
  const canonical = canonicalUrl(meta.path);
  const image = absoluteImageUrl(meta.image);

  document.title = meta.title;
  setNamedMeta("name", "description", meta.description);

  let link = document.head.querySelector<HTMLLinkElement>(
    'link[rel="canonical"]',
  );
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  link.setAttribute("href", canonical);

  setNamedMeta("property", "og:title", meta.title);
  setNamedMeta("property", "og:description", meta.description);
  setNamedMeta("property", "og:type", meta.ogType);
  setNamedMeta("property", "og:url", canonical);
  setNamedMeta("property", "og:image", image);
  setNamedMeta("property", "og:image:width", String(meta.image.width));
  setNamedMeta("property", "og:image:height", String(meta.image.height));
  setNamedMeta("name", "twitter:card", "summary_large_image");
  setNamedMeta("name", "twitter:title", meta.title);
  setNamedMeta("name", "twitter:description", meta.description);
  setNamedMeta("name", "twitter:image", image);
}

/**
 * Keeps document metadata correct across client-side navigation. The build
 * bakes the same values (from src/lib/meta.ts) into each route's prerendered
 * HTML, so this hook only has to handle in-app route changes.
 */
export function usePageMeta(path: string) {
  useEffect(() => {
    const meta = metaForPath(path);
    if (meta) applyMeta(meta);
  }, [path]);
}
