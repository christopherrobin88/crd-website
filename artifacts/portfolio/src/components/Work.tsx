import { Link } from "wouter";
import { projects, type Project } from "@/data/projects";
import { Picture } from "@/components/Picture";
import { ArrowRight } from "lucide-react";
import { QuoteBand } from "@/components/EditorialAtmosphere";
import { rememberWorkLaunch } from "@/hooks/use-work-return";

export function Work() {
  return (
    <section className="pt-16 pb-24 md:pt-24 md:pb-32 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <header className="mb-16 md:mb-24 max-w-3xl">
          <h1 className="font-serif text-4xl md:text-6xl tracking-tight leading-[1.05]">
            Ideas brought to life with{" "}
            <span className="text-crd-moss">purpose</span> and precision.
          </h1>
        </header>

        <div className="space-y-20 md:space-y-28">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

        {/* Closing editorial band — CTA over the misty treeline */}
        <QuoteBand className="mt-24 md:mt-32">
          <div className="mx-auto max-w-xl text-center">
            <p className="font-serif text-2xl md:text-3xl tracking-tight text-crd-forest">
              Rooted in craft. Focused on impact.
            </p>
            <p className="mt-4 font-sans text-base leading-relaxed text-crd-forest/80">
              CRD works with agencies, brands and organisations to design with
              clarity, shape stories and build systems that work beautifully.
            </p>
            <Link
              href="/contact"
              className="group crd-lift mt-8 inline-flex items-center gap-3 whitespace-nowrap bg-crd-forest px-7 py-3.5 font-sans text-[0.7rem] uppercase tracking-[0.24em] text-crd-parchment hover:bg-crd-moss focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crd-gold focus-visible:ring-offset-2"
            >
              Start a conversation
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </QuoteBand>
      </div>
    </section>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  // Container matches the cover's own aspect ratio (Checkers' retail
  // leaflets are noticeably wider than the magazine covers) so object-cover
  // never has anything to crop — a forced 3:4 box was cutting price badges
  // and product shots off the left/right edges of the wider leaflet covers.
  const coverAspect = project.coverImage.img.w / project.coverImage.img.h;

  // Every row follows the same reading order — cover on the left, copy on
  // the right (the previous even/odd alternation is retired, Phase 2b).
  return (
    <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-center border-t border-crd-gold/25 pt-12 md:pt-16">
      <Link
        href={`/project/${project.id}`}
        state={{ fromWork: true }}
        onClick={() => rememberWorkLaunch(project.id)}
        data-project-anchor={project.id}
        className="group relative w-full max-w-sm md:w-2/5 block block-hover"
      >
        {/* Parchment mat — frames the cover as a mounted editorial artefact */}
        <div className="border border-crd-gold/30 bg-crd-parchment/75 p-3 shadow-[0_18px_44px_-20px_rgba(14,35,32,0.35)] transition-shadow duration-500 group-hover:shadow-[0_26px_56px_-22px_rgba(14,35,32,0.45)] md:p-5">
          <div
            className="relative w-full overflow-hidden bg-muted"
            style={{ aspectRatio: coverAspect }}
          >
            <Picture
              pic={project.coverImage}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              sizes="(min-width: 768px) 40vw, 100vw"
              // The first cover is the page's LCP candidate — never lazy.
              loading={index === 0 ? "eager" : "lazy"}
              fetchPriority={index === 0 ? "high" : undefined}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
          </div>
        </div>
      </Link>

      <div className="w-full md:w-3/5 flex flex-col justify-center">
        <div className="font-sans text-xs uppercase tracking-widest mb-4 flex items-baseline gap-4">
          <span className="text-crd-gold" aria-hidden="true">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="text-accent">
            {project.year ? `${project.year} — ` : ""}{project.category}
          </span>
        </div>
        <Link
          href={`/project/${project.id}`}
          state={{ fromWork: true }}
          onClick={() => rememberWorkLaunch(project.id)}
          className="group"
        >
          <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl mb-2 tracking-tight flex items-center gap-4">
            {project.title}
            <ArrowRight className="w-8 h-8 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-[opacity,transform] duration-300 ease-out" />
          </h2>
        </Link>
        <p className="font-sans text-lg md:text-xl text-muted-foreground mb-8">
          {project.publicationName}
        </p>
        <p className="font-sans text-base md:text-lg max-w-md leading-relaxed text-foreground/80">
          {project.shortDescription}
        </p>
      </div>
    </div>
  );
}
