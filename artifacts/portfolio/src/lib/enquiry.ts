import type { Project } from "@/data/projects";

/**
 * Build types offered by the enquiry form. Single source shared by the form
 * itself and every surface that links into it with a preselected type
 * (/contact?type=…). The Worker validates lengths server-side; membership of
 * this list is enforced by the form's <select>.
 */
export const PROJECT_TYPES = [
  "Brand identity",
  "Publication design",
  "Website or portfolio",
  "Campaign / rollout design",
  "Packaging or POS",
  "Creative direction",
  "Automation / workflow system",
  "Not sure yet",
] as const;

export type ProjectType = (typeof PROJECT_TYPES)[number];

export function isProjectType(value: string | null): value is ProjectType {
  return value !== null && (PROJECT_TYPES as readonly string[]).includes(value);
}

/** /contact with the given build type preselected on the enquiry form. */
export function contactHref(type: ProjectType): string {
  return `/contact?type=${encodeURIComponent(type)}`;
}

/** The enquiry type a project's case study most naturally leads into. */
export function enquiryTypeForProject(
  project: Pick<Project, "category" | "layout">,
): ProjectType {
  if (project.category.includes("Packaging")) return "Packaging or POS";
  if (project.category.includes("Systems")) return "Automation / workflow system";
  if (project.layout === "identity") return "Brand identity";
  if (project.layout === "campaign") return "Campaign / rollout design";
  return "Publication design";
}
