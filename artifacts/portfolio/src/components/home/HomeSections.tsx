import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { Picture } from "@/components/Picture";
import type { Pic } from "@/components/Picture";
import { FlowSystemDiagram } from "@/components/diagrams/FlowSystemDiagram";
import { contactHref, type ProjectType } from "@/lib/enquiry";
import krugerCover from "@/assets/images/kruger/issue-29-cover-01.jpg?format=webp;jpg&as=picture";
import behelmCover from "@/assets/images/behelm/logo-system-cover.jpg?format=webp;jpg&as=picture";
import boutiqueEssentialsCover from "@/assets/images/boutique-essentials/amenity-range-cover.jpg?format=webp;jpg&as=picture";

/**
 * Homepage sections below the hero (Phase 1 extension). All copy is final and
 * approved; implement changes against the brief, not by rewording in place.
 * Nothing here is shared with ProjectDetail.tsx.
 *
 * The decorative hairline-eyebrow ("kicker") composition was retired in the
 * production-refinement pass — every section repeated it, so it carried no
 * information. Headings now open their sections directly.
 */

// ---- Section 2: Positioning statement -------------------------------------

export function PositioningSection() {
  return (
    <section className="px-6 py-24 md:px-12 md:py-36">
      <div className="mx-auto max-w-7xl">
        <div>
          <h2 className="max-w-4xl font-serif text-3xl leading-[1.1] tracking-tight text-crd-forest md:text-5xl">
            Good design is half the job. Delivering it, correctly, every time,
            is the other half.
          </h2>
          <div className="mt-10 max-w-2xl space-y-6 font-sans text-base leading-relaxed text-foreground/80 md:mt-14 md:text-lg">
            <p>
              CRD is built on seventeen years of editorial design: national
              magazine titles, high-volume retail campaigns and brand systems
              that had to hold up under real deadlines. That discipline, grids,
              hierarchy, restraint, runs through everything the studio touches.
            </p>
            <p>
              The difference is what happens after the design is approved. CRD
              builds the templates, workflows and production systems that get
              work out the door consistently, so quality survives the tenth
              issue, the fiftieth adaptation and the deadline nobody saw coming.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---- Section 3: Selected work ----------------------------------------------

interface FeaturedProject {
  id: string;
  title: string;
  label: string;
  client: string;
  description: string;
  coverAlt: string;
  cover: Pic;
  reversed: boolean;
  /** Slightly larger image column — per Christopher for Behelm (2026-07-11). */
  large?: boolean;
}

const featured: FeaturedProject[] = [
  {
    id: "kruger-magazine",
    title: "Kruger Magazine",
    label: "Editorial Design & Production",
    client: "MLP Media",
    description:
      "End-to-end editorial production for a specialist wildlife title: layout, image correction and print-ready output across multiple issues for MLP Media. Magazine craft, delivered on schedule, issue after issue.",
    coverAlt: "Kruger Magazine issue cover",
    cover: krugerCover,
    reversed: false,
  },
  {
    id: "behelm",
    title: "Behelm",
    label: "Brand Identity & Logo System",
    client: "Behelm Consulting",
    description:
      "A complete identity system for a private security consultancy: shield monogram, colour rules, stationery and digital applications. Built as a working toolkit the client can hand to any supplier and have reproduced correctly.",
    coverAlt: "Behelm logo system presentation cover — shield monogram on deep navy",
    cover: behelmCover,
    reversed: true,
    large: true,
  },
  {
    id: "boutique-essentials",
    title: "Boutique Essentials",
    label: "Packaging & Brand Design",
    client: "Boutique Essentials, Cape Town",
    description:
      "Label and packaging design for a Cape Town supplier of guest amenities to boutique hotels and short-stay properties. Quiet, natural presence designed for the guest bathroom, not the retail shelf.",
    coverAlt: "Boutique Essentials shampoo bottle and carton with olive labels",
    cover: boutiqueEssentialsCover,
    reversed: false,
  },
];

function FeaturedWorkCard({ project }: { project: FeaturedProject }) {
  const cover = project.cover;
  const coverAspect = cover.img.w / cover.img.h;

  return (
    <div className="case-study-card">
      <div className="grid items-center gap-10 md:grid-cols-12 md:gap-16">
        <Link
          href={`/project/${project.id}`}
          className={`group mx-auto block w-full ${
            project.large ? "max-w-md md:col-span-6" : "max-w-sm md:col-span-5"
          } ${project.reversed ? "md:order-2" : ""}`}
        >
          {/* Parchment mat, matching the Work page's mounted-cover treatment */}
          <div className="border border-crd-gold/30 bg-crd-parchment/75 p-3 shadow-[0_18px_44px_-20px_rgba(14,35,32,0.35)] transition-shadow duration-500 group-hover:shadow-[0_26px_56px_-22px_rgba(14,35,32,0.45)] md:p-5">
            <div
              className="relative w-full overflow-hidden bg-muted"
              style={{ aspectRatio: coverAspect }}
            >
              <Picture
                pic={cover}
                alt={project.coverAlt}
                className="target-image h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                sizes="(min-width: 768px) 40vw, 100vw"
              />
            </div>
          </div>
        </Link>

        <div
          className={`${project.large ? "md:col-span-6" : "md:col-span-7"} ${
            project.reversed ? "md:order-1" : ""
          }`}
        >
          <p className="mb-4 font-sans text-xs uppercase tracking-widest text-accent">
            {project.label}
          </p>
          <h3 className="font-serif text-4xl tracking-tight text-crd-forest md:text-5xl">
            {project.title}
          </h3>
          <p className="mt-2 font-sans text-lg text-muted-foreground">{project.client}</p>
          <p className="mt-6 max-w-md font-sans text-base leading-relaxed text-foreground/80 md:text-lg">
            {project.description}
          </p>
          <Link
            href={`/project/${project.id}`}
            className="group mt-8 inline-flex items-center gap-3 font-sans text-[0.7rem] uppercase tracking-[0.24em] text-crd-forest transition-colors duration-300 hover:text-crd-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crd-gold focus-visible:ring-offset-2"
          >
            View project
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export function SelectedWorkSection() {
  return (
    <section className="px-6 py-24 md:px-12 md:py-36">
      <div className="mx-auto max-w-7xl">
        <div>
          <h2 className="font-serif text-4xl leading-[1.1] tracking-tight text-crd-forest md:text-5xl">
            Selected Work
          </h2>
          <p className="mt-6 max-w-2xl font-sans text-base leading-relaxed text-foreground/80 md:text-lg">
            Selected work across editorial, brand identity and packaging —
            visual craft and production discipline in equal measure.
          </p>
        </div>
        <div className="mt-4 space-y-24 md:mt-8 md:space-y-36">
          {featured.map((project) => (
            <FeaturedWorkCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ---- Section 4: Connected Systems ------------------------------------------

export function ConnectedSystemsSection() {
  return (
    <section className="px-6 py-24 md:px-12 md:py-36">
      <div className="mx-auto max-w-7xl">
        <div>
          {/* Copy runs on top; the diagram then takes the full column width
              below it — the section's centrepiece, per Christopher. */}
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-20">
            <h2 className="font-serif text-4xl leading-[1.1] tracking-tight text-crd-forest md:text-5xl">
              One system from brief to delivery.
            </h2>
            <div className="space-y-6 font-sans text-base leading-relaxed text-foreground/80 md:text-lg">
              <p>
                Every project runs through the same workflow. Briefs, assets
                and content go in one end; reviewed, approved, delivery-ready
                files come out the other, with reports and notifications
                along the way. Automation carries the repetitive layers so
                senior attention goes where it earns its keep: the thinking
                and the craft.
              </p>
              <p>Fewer errors. Faster rounds. Nothing lost between design and delivery.</p>
            </div>
          </div>
          <FlowSystemDiagram className="mt-14 md:mt-20" />
        </div>
      </div>
    </section>
  );
}

// ---- Section 5: Services teaser ---------------------------------------------

const services = [
  {
    name: "Editorial Design.",
    line: "Magazines, publications and layout systems built for the page.",
    proof: { label: "Kruger Magazine", href: "/project/kruger-magazine" },
    enquiryType: "Publication design",
  },
  {
    name: "Brand Identity.",
    line: "Identities with usage rules that survive contact with real work.",
    proof: { label: "Behelm", href: "/project/behelm" },
    enquiryType: "Brand identity",
  },
  {
    name: "Packaging & Retail.",
    line: "Shopper-facing design that performs on shelf and at speed.",
    proof: { label: "Boutique Essentials", href: "/project/boutique-essentials" },
    enquiryType: "Packaging or POS",
  },
  {
    name: "DTP & Production.",
    line: "Rollout, pre-press and artwork that arrives print-ready.",
    proof: { label: "Checkers", href: "/project/checkers-retail" },
    enquiryType: "Campaign / rollout design",
  },
] satisfies {
  name: string;
  line: string;
  proof: { label: string; href: string };
  enquiryType: ProjectType;
}[];

export function ServicesTeaserSection() {
  return (
    <section className="px-6 py-24 md:px-12 md:py-36">
      <div className="mx-auto max-w-7xl">
        <div>
          <h2 className="mb-8 font-serif text-4xl leading-[1.1] tracking-tight text-crd-forest md:text-5xl">
            Services
          </h2>
          <ul className="border-y border-crd-gold/25">
            {services.map((service) => (
              <li
                key={service.name}
                className="flex flex-col gap-1 border-b border-crd-gold/25 py-5 last:border-b-0 md:flex-row md:items-baseline md:gap-4"
              >
                {/* The service name doubles as the enquiry entry for that
                    discipline — it lands on the form with the type set. */}
                <Link
                  href={contactHref(service.enquiryType)}
                  className="shrink-0 font-sans text-base font-semibold text-crd-forest underline decoration-transparent underline-offset-4 transition-colors hover:text-crd-gold hover:decoration-crd-gold/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crd-gold focus-visible:ring-offset-2 md:w-64 md:text-lg"
                >
                  {service.name}
                </Link>
                <span className="font-sans text-base leading-relaxed text-foreground/80 md:text-lg">
                  {service.line}
                </span>
                <Link
                  href={service.proof.href}
                  className="shrink-0 font-sans text-[0.7rem] uppercase tracking-[0.18em] text-crd-forest/70 underline decoration-crd-gold/50 underline-offset-4 transition-colors hover:text-crd-gold md:ml-auto"
                >
                  See {service.proof.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/services"
            className="group mt-10 inline-flex items-center gap-3 whitespace-nowrap font-sans text-[0.7rem] uppercase tracking-[0.24em] text-crd-forest transition-colors duration-300 hover:text-crd-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crd-gold focus-visible:ring-offset-2"
          >
            All services
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ---- Section 6: Contact close -----------------------------------------------

export function ContactCloseSection() {
  return (
    <section className="px-6 py-24 md:px-12 md:py-40">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="font-serif text-4xl leading-[1.1] tracking-tight text-crd-forest md:text-5xl">
            Tell me what you're building.
          </h2>
          <p className="mt-6 font-sans text-base leading-relaxed text-foreground/80 md:text-lg">
            One conversation to find the clearest next step. No pitch theatre,
            no obligation.
          </p>
          <Link
            href="/contact"
            className="group crd-lift mt-10 inline-flex items-center gap-3 whitespace-nowrap bg-crd-forest px-8 py-4 font-sans text-[0.7rem] uppercase tracking-[0.24em] text-crd-parchment hover:bg-crd-moss focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crd-gold focus-visible:ring-offset-2"
          >
            Start a conversation
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
