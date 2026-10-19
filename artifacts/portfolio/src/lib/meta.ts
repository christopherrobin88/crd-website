import { webProjects } from "@/data/web-projects";
import { projects } from "@/data/projects";

/**
 * Single source of truth for per-route document metadata. Consumed three ways:
 *  - usePageMeta (client) keeps <head> correct across SPA navigation
 *  - scripts/prerender.ts (build) bakes the same values into each route's
 *    static HTML so crawlers and link-preview clients never depend on hydration
 *  - the sitemap is generated from routeMetaList, so it cannot drift from the
 *    routes that actually exist
 */

export const SITE_ORIGIN = "https://christopherrobindesign.com";
export const SITE_NAME = "Christopher Robin Design";

/** Default social card, used by routes without their own artwork. */
const DEFAULT_OG_IMAGE = {
  url: "/og-logo-botanical-v1.png",
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
    title: "Christopher Robin Design | Editorial, Branding and Web Design, Cape Town",
    description:
      "Website design, branding and editorial design in Cape Town. Seventeen years of magazine and brand work, now carried from page to screen.",
    ogType: "website",
    image: DEFAULT_OG_IMAGE,
  },
  {
    path: "/work",
    title: "Selected Work | Christopher Robin Design",
    description:
      "Selected projects across editorial design, branding and websites, including Kruger Magazine, Behelm, Riette Gara and Made by Mike.",
    ogType: "website",
    image: DEFAULT_OG_IMAGE,
  },
  {
    path: "/services",
    title: "Services | Christopher Robin Design",
    description:
      "Websites from R18,000, brand identity from R15,000 and editorial design from R8,500. Fixed fees agreed before work starts, from a Cape Town design studio.",
    ogType: "website",
    image: DEFAULT_OG_IMAGE,
  },
  {
    path: "/web",
    title: "Web Portfolio | Christopher Robin Design",
    description: "Websites for artists, makers and businesses, shaped by an editorial eye. Explore Riette Gara, Made by Mike and Behelm across desktop and mobile.",
    ogType: "website",
    image: { url: "/work/web/riette-gara-desktop.webp", width: 1440, height: 1000 },
  },
  {
    path: "/about",
    title: "Christopher Gara, Designer and Creative Director | Christopher Robin Design",
    description:
      "Christopher Robin Design is a Cape Town studio led by Christopher Gara, designing publications, brands and websites for businesses and agencies.",
    ogType: "website",
    image: DEFAULT_OG_IMAGE,
  },
  {
    path: "/contact",
    title: "Contact | Christopher Robin Design",
    description:
      "Start a project conversation: websites, brand identity, publication design or campaign work. Enquiries answered personally within two working days.",
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
const webRoutes: PageMeta[] = webProjects.map((project) => ({
  path: `/project/${project.id}`,
  title: `${project.title}: ${project.discipline} | ${SITE_NAME}`,
  description: project.description,
  ogType: "article",
  image: { url: project.desktop, width: 1440, height: 1000 },
}));

export const routeMetaList: PageMeta[] = [...staticRoutes, ...projectRoutes, ...webRoutes];

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
