import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { webProjects } from "@/data/web-projects";
import { BrowserPreview } from "@/components/BrowserPreview";
import { SketchLine, SketchArrow } from "@/components/SketchLine";
import { rememberWorkLaunch } from "@/hooks/use-work-return";

export function WebProjects({ compact = false, fromWork = false }: { compact?: boolean; fromWork?: boolean }) {
  const shown = compact ? webProjects.slice(0, 2) : webProjects;
  return (
    <div className="grid gap-x-8 gap-y-14 md:grid-cols-2">
      {shown.map((project) => (
        <article key={project.id}>
          <BrowserPreview title={project.title} image={project.desktop} mobileImage={project.mobile} previewVideo={project.previewVideo} href={`/project/${project.id}`}
            fromWork={fromWork} onOpen={() => { if (fromWork) rememberWorkLaunch(project.id); }} />
          <Link href={`/project/${project.id}`} state={fromWork ? { fromWork: true } : undefined}
            data-project-anchor={project.id}
            onClick={() => { if (fromWork) rememberWorkLaunch(project.id); }}
            className="group block rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-crd-forest">
            <p className="mt-6 text-xs uppercase tracking-[0.18em] text-crd-forest/80">{project.discipline}</p>
            <h3 className="mt-2 flex items-center justify-between gap-4 font-serif text-3xl tracking-tight md:text-4xl">
              {project.title}<ArrowRight className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1 motion-reduce:transition-none" aria-hidden="true" />
            </h3>
          </Link>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-crd-forest/80 md:text-lg">{project.description}</p>
          <p className="mt-4 text-sm text-crd-forest/80">{project.status}</p>
        </article>
      ))}
    </div>
  );
}

export function WebWorkSection() {
  return (
    <section className="px-6 py-20 md:px-12 md:py-28" aria-labelledby="web-work-title">
      <div className="mx-auto max-w-7xl border-t border-crd-forest/20 pt-12 md:pt-16">
        <div className="mb-10 grid gap-6 md:grid-cols-2 md:gap-12">
          <div><h2 id="web-work-title" className="font-serif text-4xl leading-tight tracking-tight md:text-5xl">From page to screen.</h2><SketchLine className="mt-3 w-44" /><p className="mt-4 flex items-center gap-4 font-serif text-lg italic">See them in motion.<SketchArrow className="hidden w-20 md:block" /></p></div>
          <p className="max-w-lg text-base leading-relaxed text-crd-forest/80 md:text-lg">Websites with a clear story, a sensible structure and room for the work to shine. Built to look right on every phone.</p>
        </div>
        <WebProjects compact />
        <Link href="/web" className="mt-10 inline-flex items-center gap-3 border-b border-crd-gold pb-2 text-sm font-medium">Explore the web portfolio<ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
      </div>
    </section>
  );
}
