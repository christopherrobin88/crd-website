import type { ProjectType } from "@/lib/enquiry";

export const servicePackages: {
  id: string;
  title: string;
  price: string;
  description: string;
  includes: string[];
  enquiryType: ProjectType;
  action: string;
}[] = [
  {
    id: "editorial",
    title: "Editorial",
    price: "R8,500",
    description: "A publication that is easy to read and good to look at.",
    includes: ["One brochure or report, up to 12 pages including cover", "Visual direction, layout and typography", "Print-ready artwork and a digital PDF"],
    enquiryType: "Publication design",
    action: "Discuss editorial",
  },
  {
    id: "brand-identity",
    title: "Brand identity",
    price: "R15,000",
    description: "The foundations for a brand that feels like your business.",
    includes: ["Two initial identity directions; one developed", "Primary logo, variations, colour and typography", "A concise brand guide and final logo files"],
    enquiryType: "Brand identity",
    action: "Discuss branding",
  },
  {
    id: "website",
    title: "Website",
    price: "R18,000",
    description: "A distinctive home for your work, built for the way people browse.",
    includes: ["One responsive website, up to 5 pages", "Site structure, design and build", "Enquiry form, page titles and descriptions", "Launch checks and handover"],
    enquiryType: "Website or portfolio",
    action: "Discuss a website",
  },
  {
    id: "brand-and-website",
    title: "Brand + website",
    price: "R30,000",
    description: "An identity and a website designed together, so everything matches.",
    includes: ["Everything in the Brand identity package", "Everything in the Website package", "The same visual language across brand and web"],
    enquiryType: "Website or portfolio",
    action: "Discuss brand + web",
  },
];
