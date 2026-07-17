import { projects } from "@/data/projects";

/**
 * Single source of truth for per-route document metadata. Consumed three ways:
 *  - usePageMeta (client) keeps <head> correct across SPA navigation
 *  - scripts/prerender.ts (build) bakes the same values into each route's
 *    static HTML so crawlers and link-preview clients never depend on hydration
 *  - the sitemap is generated from routeMetaList, so it cannot drift from the
 *    routes that actually exist
 */

export const SITE_ORIGIN = "https://www.christopherrobindesign.com";
export const SITE_NAME = "Christopher Robin Design";

/** Default social card, used by routes without their own artwork. */
const DEFAULT_OG_IMAGE = {
  url: "/og-image.png",
  width: 1200,
  height: 630,
};

export interface PageMeta {
  /** Route path, no trailing slash except "/" */
  path: string;
  title: string;
  description: string;
  ogType: "website" | "article";
  image: { url: string; width: number; height: number };
}

function projectDescription(short: string): string {
  // Meta descriptions read best under ~160 characters; authentic copy only,
  // trimmed at a word boundary when the source line runs long.
  if (short.length <= 160) return short;
  const cut = short.slice(0, 157);
  return `${cut.slice(0, cut.lastIndexOf(" "))}…`;
}

const staticRoutes: PageMeta[] = [
  {
    path: "/",
    title: "Christopher Robin Design | Editorial and Brand Design, Cape Town",
    description:
      "Editorial design, brand systems and production workflows for agencies, brands and creative teams. A Cape Town design studio led by seventeen years of publication craft.",
    ogType: "website",
    image: DEFAULT_OG_IMAGE,
  },
  {
    path: "/work",
    title: "Selected Work | Christopher Robin Design",
    description:
      "Selected projects across editorial design, brand identity, packaging and retail campaigns, from national magazine titles to complete identity systems.",
    ogType: "website",
    image: DEFAULT_OG_IMAGE,
  },
  {
    path: "/services",
    title: "Services | Christopher Robin Design",
    description:
      "Editorial design, brand identity, packaging and retail, DTP and production, creative direction and production systems: one working system from idea to finished output.",
    ogType: "website",
    image: DEFAULT_OG_IMAGE,
  },
  {
    path: "/about",
    title: "About the Studio | Christopher Robin Design",
    description:
      "Christopher Robin Design is a Cape Town creative studio led by Christopher Gara: publication design, brand systems and the production discipline that keeps them moving.",
    ogType: "website",
    image: DEFAULT_OG_IMAGE,
  },
  {
    path: "/contact",
    title: "Contact | Christopher Robin Design",
    description:
      "Start a project conversation: brand identity, publication design, campaign rollout or production systems. Enquiries answered personally within two working days.",
    ogType: "website",
    image: DEFAULT_OG_IMAGE,
  },
];

const projectRoutes: PageMeta[] = projects.map((project) => ({
  path: `/project/${project.id}`,
  title: `${project.title}: ${project.category} | ${SITE_NAME}`,
  description: projectDescription(project.shortDescription),
  ogType: "article",
  image: {
    url: project.coverImage.img.src,
    width: project.coverImage.img.w,
    height: project.coverImage.img.h,
  },
}));

/** Every prerenderable route, in sitemap order. */
export const routeMetaList: PageMeta[] = [...staticRoutes, ...projectRoutes];

export function metaForPath(path: string): PageMeta | undefined {
  const normalised =
    path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path;
  return routeMetaList.find((route) => route.path === normalised);
}

export function canonicalUrl(path: string): string {
  return path === "/" ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}${path}`;
}

export function absoluteImageUrl(image: PageMeta["image"]): string {
  return image.url.startsWith("http")
    ? image.url
    : `${SITE_ORIGIN}${image.url}`;
}
