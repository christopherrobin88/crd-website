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
  year: string;
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
    year: "",
    category: "Editorial Design & Production",
    shortDescription:
      "End-to-end editorial production across multiple issues — layout, image correction and print-ready output for a specialist wildlife title.",
    fullDescription:
      "Kruger Magazine is a specialist wildlife and conservation publication covering Kruger National Park. Across multiple years and issues, the studio held full production responsibility — from first layout through to final press-ready files. The work asked for creative and technical precision in equal measure: every issue had to read well on the page and meet the standards of commercial print production.",
    processNotes:
      "The scope on each issue covered the complete production pipeline. Layout balanced long-form features, photography-led spreads, maps, infographics and advertiser placements within a consistent editorial grid. Image correction and colour grading were central — contributor photography varied in quality and colour profile, and each frame was retouched in Photoshop for consistent ink density across coated and uncoated stock. Social assets adapted print layouts and key imagery into platform-ready formats, and a pre-press pass checked bleeds, trim, CMYK colour, resolution, font embedding and overprint before supply.",
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
    year: "2026",
    category: "Brand Identity & Logo System",
    shortDescription:
      "A complete identity system for a private security consultancy — a quiet shield monogram, disciplined colour rules and applications built to signal discretion and authority.",
    fullDescription:
      "Behelm Consulting provides discreet, intelligence-led protection for executives, VIPs and organisations that need high-trust advisory. The identity had to carry authority without theatre: a BH monogram held in a shield silhouette — referencing the maritime helm and old seal traditions — drawn calm, precise and discreet. Navy and paper carry every surface; gold appears once, as a single point at the crown of the mark, never as fill.",
    processNotes:
      "The mark is constructed on a 16-unit grid — spine width, shield rise and watch line are fixed relationships, so it reproduces identically at any size. The system specifies scale behaviour down to a 24px favicon (the gold accent drops below 80px), reverse lockups for navy and paper grounds, and a stationery and digital-avatar set. Usage rules were written to survive contact with real work: approved colourways, minimum sizes and misuse cases are all documented.",
    toolsUsed: ["Illustrator", "InDesign"],
    outcomes:
      "A logo system delivered as a working toolkit — construction, colour, scale and application rules in one presentation the client can hand to any supplier.",
    coverImage: coverPicFor("behelm"),
  },
  {
    id: "checkers-retail",
    layout: "campaign",
    title: "Checkers Retail Campaigns",
    publicationName: "Ninety9Cents, Cape Town",
    role: "Art Director",
    year: "",
    category: "Retail Marketing & Campaign Design",
    shortDescription:
      "High-volume retail campaign design for one of South Africa's largest grocery chains — built for speed-to-market without losing brand consistency.",
    fullDescription:
      "Art direction for Checkers' large-scale retail marketing — one of South Africa's biggest and fastest-moving retail accounts. The work ran from concept through to pre-press across print, digital and in-store, and called for creative judgement and production discipline under tight, repeating deadlines.",
    processNotes:
      "Production systems handled the repetitive, high-frequency work so the team could hold quality at pace, reducing errors and shortening turnaround. The role also sat between design and production as the point of creative continuity — keeping campaigns coherent from brief to press.",
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
    year: "",
    category: "Editorial Direction & Publication Design",
    shortDescription:
      "Editorial direction for a national lifestyle title — local voice and commercial features held within a global brand system.",
    fullDescription:
      "Art direction for Playboy South Africa, leading the visual and editorial direction of one of the country's most recognised lifestyle magazines. The work balanced an established global brand identity with a distinctly South African editorial voice — layouts that were sophisticated, engaging and commercially effective.",
    processNotes:
      "Each issue worked closely with the editorial team to align visual storytelling with the writing. Layout systems covered long-form features, photo essays and advertiser integrations, with every page held to global brand standards while staying locally relevant. Commercial concept development supported advertiser features.",
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
    year: "",
    category: "Packaging & Brand Design",
    shortDescription:
      "Label and packaging design for a Cape Town amenity supplier to boutique hotels and short-stay properties — quiet, natural shelf presence for guest bathrooms.",
    fullDescription:
      "Boutique Essentials supplies guest amenities — shampoo, conditioner and room sprays — to boutique hotels, guesthouses and short-stay properties around Cape Town. The packaging had to feel considered in a guest bathroom rather than shout from a retail shelf: a hand-drawn leaf mark and script wordmark over a muted olive label, paired with amber glass and natural textures.",
    processNotes:
      "The label system runs across the range from a single layout — product name, range descriptor and volume hold fixed positions, so new products drop in without redesign. The finish keeps to a restrained pairing of matt label stock against amber glass, so the range reads premium at arm's length and in photography.",
    toolsUsed: ["Illustrator", "Photoshop"],
    outcomes: "",
    coverImage: coverPicFor("boutique-essentials"),
  },
  {
    id: "agriprobe",
    layout: "editorial",
    title: "AgriProbe",
    publicationName: "MLP Media",
    role: "Editorial Designer",
    year: "2023–2025",
    category: "Editorial Design & Publication Production",
    shortDescription:
      "Editorial design across multiple issues of the Western Cape Department of Agriculture's research and news magazine.",
    fullDescription:
      "AgriProbe is the quarterly research and news magazine of the Western Cape Department of Agriculture, published by MLP Media. The work covered issue design across several volumes — covers, feature layouts and research articles — bringing a considered editorial standard to scientific and departmental content aimed at both specialists and the wider agricultural community.",
    processNotes:
      "Each issue balanced research features, departmental news and photography within a consistent editorial grid, keeping dense technical material readable without flattening its character. Cover concepts gave every issue a distinct visual identity while holding the magazine's recognisable masthead system, and bilingual content was set with equal typographic care.",
    toolsUsed: ["InDesign", "Photoshop", "Illustrator"],
    outcomes: "",
    coverImage: coverPicFor("agriprobe"),
  },
  {
    id: "uncut-magazine",
    layout: "editorial",
    title: "UNCUT Magazine",
    publicationName: "LoveLife",
    role: "Art Director & Designer",
    year: "2015",
    category: "Editorial Design & Art Direction",
    shortDescription:
      "Commissioned art direction and layout for LoveLife's bold youth music and culture title — Issue 94, cover to press-ready spreads.",
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
    year: "2019–2020",
    category: "Editorial Design & Publication Design",
    shortDescription:
      "Cover and feature design for South Africa's property investment magazine — finance-led content with newsstand presence.",
    fullDescription:
      "Real Estate Investor is South Africa's magazine for property investors, combining market analysis, investment strategy and high-profile interviews. The work spanned covers and feature layouts across multiple issues — including cover stories on Christo Wiese, Siya Kolisi and Trevor Noah — holding a confident, business-led visual identity that kept financial content approachable.",
    processNotes:
      "Cover design leaned on strong portrait photography and a disciplined masthead system to earn newsstand attention, while feature layouts organised data-heavy investment content into clear, structured reading. The Master Investor series carried its own recognisable treatment within the magazine's broader identity.",
    toolsUsed: ["InDesign", "Photoshop", "Illustrator"],
    outcomes: "",
    coverImage: coverPicFor("real-estate-investor"),
  },
  {
    id: "leisure-boating",
    layout: "editorial",
    title: "Leisure Boating Magazine",
    publicationName: "Caravan Publications",
    role: "Art Director & Designer",
    year: "",
    category: "Publication Design & Layout Systems",
    shortDescription:
      "Layout and visual system for a specialist title — cohesive design that made technical content clear and enjoyable to read.",
    fullDescription:
      "Layout and visual style for Leisure Boating Magazine, working closely with the editorial team to produce pages that were engaging and clearly structured for a specialist boating audience. The role was foundational in developing an editorial design discipline and a careful attention to detail.",
    processNotes:
      "Reusable elements and templates kept a cohesive identity across issues while flexing for varied content — from technical how-to features to destination travel pieces. The aim throughout was to make specialist, sometimes technical material visually accessible and enjoyable.",
    toolsUsed: ["InDesign", "Photoshop", "Illustrator"],
    outcomes:
      "Consistently well-crafted issues across a two-year tenure, building a strong foundation in publication design, editorial collaboration and production process.",
    coverImage: coverPicFor("leisure-boating"),
  },
  {
    id: "aios",
    layout: "identity",
    title: "AIOS",
    publicationName: "Self-initiated — systems design concept",
    role: "Brand Concepts & Product UI Design",
    year: "2026",
    category: "Systems Design & Product Concept",
    shortDescription:
      "Conceptual identity routes and orchestration-dashboard design for an AI operating system — the studio's systems thinking made visible.",
    fullDescription:
      "AIOS is a self-initiated concept for an AI operating system: an operating layer that coordinates agents, shared memory and workflows. The internal brief was to take the systems thinking behind CRD's own production automation and design what it would look like as a product — identity, application surfaces and the orchestration dashboard itself. These are conceptual renders, shown as process work rather than shipped product.",
    processNotes:
      "Several identity routes were explored, from glowing product marks to a calm editorial navy-and-gold system, each pushed to application level — app icons, login screens, stationery and dashboard tiles — to test how a mark survives real product surfaces. The dashboard designs map the operating layer honestly: workflow routing with approval gates and human-review queues, live pipeline schedules and system health. The same logic runs CRD's actual production workflow.",
    toolsUsed: ["Illustrator", "Photoshop", "AI-assisted concept rendering"],
    outcomes:
      "A working visual language for how CRD presents systems — the orchestration maps, checkpoint gates and status rails in these boards now inform the diagram language across this site.",
    coverImage: coverPicFor("aios"),
  },
];
