import type { Pic } from "@/components/Picture";
import type { ProjectContent } from "@/types/content";

/**
 * Presentation variant for a project's detail page. Controls the copy-rail
 * labelling and how the content flow frames its imagery — the data stays the
 * same authentic fields either way.
 *  - editorial: publication work; spreads and pages framed as one article.
 *  - identity: identity/packaging systems; boards shown as standalone plates.
 *  - campaign: campaign/production work; workflow-and-scale labelling.
 */
export type ProjectLayout = "editorial" | "identity" | "campaign";

export interface Project {
  id: string;
  title: string;
  publicationName: string;
  role: string;
  category: string;
  layout: ProjectLayout;
  shortDescription: string;
  fullDescription: string;
  processNotes: string;
  toolsUsed: string[];
  outcomes: string;
  coverImage: Pic;
}

// --- Content-flow manifest loader -----------------------------------------
//
// Draft manifests are produced by scripts/src/generate-content-manifest.ts
// from `src/assets/new images` and live in `src/data/content/{slug}.json`,
// alongside a generated `{slug}.assets.ts` holding static imports for
// exactly the files that manifest references (see content-assets.ts and the
// generator's writeAssetsModule() for why — a folder-wide glob made
// Cloudflare's build output balloon from 7.5MB to 176MB). ProjectDetail.tsx
// renders every project's gallery via ProjectContentFlow using this data.
//
// CRD (christopher-robin-design) had no Drive asset by design and previously
// rendered via a legacy placeholder gallery — removed from the launch grid
// entirely per Christopher (2026-07-04); see docs/scope.md.

import uncutContentRaw from "./content/uncut-magazine.json";
import checkersContentRaw from "./content/checkers-retail.json";
import playboyContentRaw from "./content/playboy-south-africa.json";
import leisureBoatingContentRaw from "./content/leisure-boating.json";
import krugerContentRaw from "./content/kruger-magazine.json";
import agriprobeContentRaw from "./content/agriprobe.json";
import reiContentRaw from "./content/real-estate-investor.json";
import behelmContentRaw from "./content/behelm.json";
import boutiqueEssentialsContentRaw from "./content/boutique-essentials.json";
import aiosContentRaw from "./content/aios.json";
import { loadProjectContent, type RawManifest } from "@/lib/content-validation";
import { getProjectAssets } from "./content-assets";

export const projectContent: Record<string, ProjectContent> = {
  "uncut-magazine": loadProjectContent(uncutContentRaw as RawManifest),
  "checkers-retail": loadProjectContent(checkersContentRaw as RawManifest),
  "playboy-south-africa": loadProjectContent(playboyContentRaw as RawManifest),
  "leisure-boating": loadProjectContent(leisureBoatingContentRaw as RawManifest),
  "kruger-magazine": loadProjectContent(krugerContentRaw as RawManifest),
  "agriprobe": loadProjectContent(agriprobeContentRaw as RawManifest),
  "real-estate-investor": loadProjectContent(reiContentRaw as RawManifest),
  "behelm": loadProjectContent(behelmContentRaw as RawManifest),
  "boutique-essentials": loadProjectContent(boutiqueEssentialsContentRaw as RawManifest),
  "aios": loadProjectContent(aiosContentRaw as RawManifest),
};

// Cover images for the 5 migrated projects come from the same manifest data
// as ProjectContentFlow, via the generated per-project static asset module —
// this also fixes known-issues.md #2 (Playboy's old hero was an interior
// page, not the cover) and #5 (Kruger's old cover was from a different
// issue than its interior pages) as a side effect of using correct data.
function coverPicFor(slug: string): Pic {
  const { cover } = projectContent[slug];
  if (cover.type !== "cover") {
    throw new Error(`Content manifest for "${slug}" has a non-cover block as its top-level cover.`);
  }
  return getProjectAssets(slug)[cover.asset];
}

export const projects: Project[] = [
  {
    id: "kruger-magazine",
    layout: "editorial",
    title: "Kruger Magazine",
    publicationName: "MLP Media",
    role: "Layout, Image Correction & Social Design",
    category: "Editorial Design & Production",
    shortDescription:
      "Several years of issues for a specialist wildlife magazine, from layout and image correction to press-ready files.",
    fullDescription:
      "Kruger Magazine is a specialist wildlife and conservation publication covering Kruger National Park. Across multiple years and issues, I held full production responsibility, from first layout through to final press-ready files. The work asked for creative and technical precision in equal measure: every issue had to read well on the page and meet the standards of commercial print production.",
    processNotes:
      "The scope on each issue covered the complete production pipeline. Layout balanced long-form features, photography-led spreads, maps, infographics and advertiser placements within a consistent editorial grid. Image correction and colour grading were central. Contributor photography varied in quality and colour profile, so I retouched each frame in Photoshop for consistent ink density across coated and uncoated stock. Social assets adapted print layouts and key imagery into platform-ready formats. A final pre-press pass checked bleeds, trim, CMYK colour, resolution, font embedding and overprint before supply.",
    toolsUsed: ["InDesign", "Photoshop", "Illustrator"],
    outcomes:
      "Consistent, well-produced issues delivered across several years, holding the magazine's reputation for considered editorial design and reliable print. Social content carried the title between issues.",
    coverImage: coverPicFor("kruger-magazine"),
  },
  {
    id: "behelm",
    layout: "identity",
    title: "Behelm",
    publicationName: "Behelm Consulting",
    role: "Brand Identity Design",
    category: "Brand Identity Study & Logo System",
    shortDescription:
      "A logo system study for a private security consultancy: shield monogram, colour rules and applications.",
    fullDescription:
      "Behelm Consulting provides discreet, intelligence-led protection for executives, VIPs and organisations that need high-trust advisory. This earlier identity study explores a BH monogram held in a shield silhouette, referencing maritime helm and seal traditions. The latest website uses a compass-style mark, shown separately in the web portfolio. Navy and paper carry every surface; gold appears once, as a single point at the crown of the mark, never as fill.",
    processNotes:
      "The mark is constructed on a 16-unit grid. Spine width, shield rise and watch line are fixed relationships, so it reproduces identically at any size. The system sets how the mark scales down to a 24px favicon, with the gold accent removed below 80px. It also includes reverse lockups for navy and paper grounds plus a stationery and digital-avatar set. Usage rules were written to survive contact with real work: approved colourways, minimum sizes and misuse cases are all documented.",
    toolsUsed: ["Illustrator", "InDesign"],
    outcomes:
      "A logo system study presented as a working toolkit: construction, colour, scale and application rules brought together in a restrained presentation.",
    coverImage: coverPicFor("behelm"),
  },
  {
    id: "checkers-retail",
    layout: "campaign",
    title: "Checkers Retail Campaigns",
    publicationName: "Ninety9Cents, Cape Town",
    role: "Art Director",
    category: "Retail Marketing & Campaign Design",
    shortDescription:
      "High-volume campaign design for one of South Africa's largest grocery chains, built for tight, repeating deadlines without losing brand consistency.",
    fullDescription:
      "Art direction for Checkers' large-scale retail marketing, one of South Africa's biggest and fastest-moving retail accounts. The work ran from concept through to pre-press across print, digital and in-store. It called for creative judgement and production discipline under tight, repeating deadlines.",
    processNotes:
      "Production systems handled the repetitive, high-frequency work so the team could hold quality at pace, reducing errors and shortening turnaround. The role also sat between design and production as the point of creative continuity, keeping campaigns coherent from brief to press.",
    toolsUsed: ["InDesign", "Illustrator", "Photoshop", "Production systems"],
    outcomes:
      "Workflow improvements cut production errors and improved speed-to-market across high-frequency campaigns, with the client services team supported on delivery and communication.",
    coverImage: coverPicFor("checkers-retail"),
  },
  {
    id: "playboy-south-africa",
    layout: "editorial",
    title: "Playboy South Africa",
    publicationName: "Chapel Lane Media",
    role: "Art Director",
    category: "Editorial Direction & Publication Design",
    shortDescription:
      "Art direction for a national lifestyle magazine, giving a global brand a distinctly South African voice.",
    fullDescription:
      "Art direction for Playboy South Africa, leading the visual and editorial direction of one of the country's most recognised lifestyle magazines. The work balanced an established global brand identity with a distinctly South African editorial voice, with layouts that were sophisticated, engaging and commercially effective.",
    processNotes:
      "I worked closely with the editorial team on each issue, matching the visual storytelling to the writing. Layout systems covered long-form features, photo essays and advertiser integrations, with every page held to global brand standards while staying locally relevant. Commercial concept development supported advertiser features.",
    toolsUsed: ["InDesign", "Photoshop", "Illustrator"],
    outcomes:
      "Consistent editorial direction across multiple issues, strengthening the title in the South African market while staying aligned with global Playboy standards.",
    coverImage: coverPicFor("playboy-south-africa"),
  },
  {
    id: "boutique-essentials",
    layout: "identity",
    title: "Boutique Essentials",
    publicationName: "Boutique Essentials, Cape Town",
    role: "Packaging & Label Design",
    category: "Packaging & Brand Design",
    shortDescription:
      "Labels and packaging for a Cape Town supplier of guest amenities to boutique hotels, designed to sit quietly in a guest bathroom.",
    fullDescription:
      "Boutique Essentials supplies guest amenities, including shampoo, conditioner and room sprays, to boutique hotels, guesthouses and short-stay properties around Cape Town. The packaging had to feel considered in a guest bathroom rather than shout from a retail shelf: a hand-drawn leaf mark and script wordmark over a muted olive label, paired with amber glass and natural textures.",
    processNotes:
      "The label system runs across the range from a single layout. Product name, range descriptor and volume hold fixed positions, so new products drop in without redesign. The finish keeps to a restrained pairing of matt label stock against amber glass, so the range reads premium at arm's length and in photography.",
    toolsUsed: ["Illustrator", "Photoshop"],
    outcomes:
      "One label layout now covers the whole range, so new products are added without a redesign. The amber-and-olive finish reads as premium in guest bathrooms and in product photography.",
    coverImage: coverPicFor("boutique-essentials"),
  },
  {
    id: "agriprobe",
    layout: "editorial",
    title: "AgriProbe",
    publicationName: "MLP Media",
    role: "Editorial Designer",
    category: "Editorial Design & Publication Production",
    shortDescription:
      "Editorial design across multiple issues of the Western Cape Department of Agriculture's research and news magazine.",
    fullDescription:
      "AgriProbe is the quarterly research and news magazine of the Western Cape Department of Agriculture, published by MLP Media. Across several volumes I designed the covers, feature layouts and research articles, bringing a clear editorial standard to scientific and departmental content for specialists and the wider farming community.",
    processNotes:
      "Each issue balanced research features, departmental news and photography within a consistent editorial grid, keeping dense technical material readable without flattening its character. Cover concepts gave every issue a distinct visual identity while holding the magazine's recognisable masthead system. Bilingual content was set with equal typographic care.",
    toolsUsed: ["InDesign", "Photoshop", "Illustrator"],
    outcomes:
      "Seven issues delivered across several volumes, each with its own cover identity inside the established masthead system. Research written for specialists stayed readable for the wider farming community in both languages.",
    coverImage: coverPicFor("agriprobe"),
  },
  {
    id: "uncut-magazine",
    layout: "editorial",
    title: "UNCUT Magazine",
    publicationName: "LoveLife",
    role: "Art Director & Designer",
    category: "Editorial Design & Art Direction",
    shortDescription:
      "Issue 94 of LoveLife's youth music and culture magazine, art-directed from cover to press-ready spreads.",
    fullDescription:
      "UNCUT is a youth music and culture magazine published by LoveLife, with a strong editorial voice and a discerning young readership. This was real commissioned editorial work, not concept: Issue 94's complete visual direction, from cover through to fully produced, press-ready spreads, with layouts as bold and unconventional as the content.",
    processNotes:
      "The approach prioritised typographic hierarchy and photography-led layouts that gave the editorial room to breathe without losing impact. A modular grid flexed across long-form features, interview spreads and review sections while holding a recognisable identity, with design choices reinforcing rather than competing with the written voice.",
    toolsUsed: ["InDesign", "Photoshop", "Illustrator"],
    outcomes:
      "A visually cohesive issue delivered to LoveLife concept-to-press, holding UNCUT's reputation as a design-led title while balancing creative ambition and production efficiency.",
    coverImage: coverPicFor("uncut-magazine"),
  },
  {
    id: "real-estate-investor",
    layout: "editorial",
    title: "Real Estate Investor",
    publicationName: "SA Real Estate Investor Magazine",
    role: "Editorial Designer",
    category: "Editorial Design & Publication Design",
    shortDescription:
      "Covers and features for South Africa's property investment magazine, making finance-led content work on the newsstand.",
    fullDescription:
      "Real Estate Investor is South Africa's magazine for property investors, combining market analysis, investment strategy and high-profile interviews. The work spanned covers and feature layouts across multiple issues, including cover stories on Christo Wiese, Siya Kolisi and Trevor Noah. A confident, business-led visual identity kept financial content approachable.",
    processNotes:
      "Cover design leaned on strong portrait photography and a disciplined masthead system to earn newsstand attention, while feature layouts organised data-heavy investment content into clear, structured reading. The Master Investor series carried its own recognisable treatment within the magazine's broader identity.",
    toolsUsed: ["InDesign", "Photoshop", "Illustrator"],
    outcomes:
      "Twelve editions with covers built around some of South Africa's best-known business and public figures, plus a Master Investor series with its own recognisable treatment. Data-heavy investment content became clear, structured reading.",
    coverImage: coverPicFor("real-estate-investor"),
  },
  {
    id: "leisure-boating",
    layout: "editorial",
    title: "Leisure Boating Magazine",
    publicationName: "Caravan Publications",
    role: "Art Director & Designer",
    category: "Publication Design & Layout Systems",
    shortDescription:
      "Layout and a reusable visual system for a specialist boating magazine, making technical content clear and enjoyable to read.",
    fullDescription:
      "Layout and visual style for Leisure Boating Magazine, working closely with the editorial team to produce pages that were engaging and clearly structured for a specialist boating audience. The role was foundational in developing an editorial design discipline and a careful attention to detail.",
    processNotes:
      "Reusable elements and templates kept a cohesive identity across issues while flexing for varied content, from technical how-to features to destination travel pieces. The aim throughout was to make specialist, sometimes technical material visually accessible and enjoyable.",
    toolsUsed: ["InDesign", "Photoshop", "Illustrator"],
    outcomes:
      "Consistently well-crafted issues across a two-year tenure, building a strong foundation in publication design, editorial collaboration and production process.",
    coverImage: coverPicFor("leisure-boating"),
  },
  {
    id: "aios",
    layout: "identity",
    title: "AIOS",
    publicationName: "Self-initiated systems design concept",
    role: "Brand Concepts & Product UI Design",
    category: "Systems Design & Product Concept",
    shortDescription:
      "Identity routes and dashboard design for a self-initiated workflow software concept. Process work, not a shipped product.",
    fullDescription:
      "AIOS is a self-initiated concept for workflow software: one place that routes jobs, tracks approvals and keeps a shared record of every project. The brief was to take the systems behind my own production workflow and design them as a product: identity, application surfaces and the dashboard itself. These are conceptual renders shown as process work, not a shipped product.",
    processNotes:
      "Several identity routes were explored, from glowing product marks to a calm editorial navy-and-gold system, each pushed to application level (app icons, login screens, stationery and dashboard tiles) to test how a mark survives real product surfaces. The dashboard designs map the operating layer honestly: workflow routing with approval gates and human-review queues, live pipeline schedules and system health. The same logic runs CRD's actual production workflow.",
    toolsUsed: ["Illustrator", "Photoshop", "AI-assisted concept rendering"],
    outcomes:
      "A working visual language for how CRD presents systems: the orchestration maps, checkpoint gates and status rails in these boards now inform the diagram language across this site.",
    coverImage: coverPicFor("aios"),
  },
];
