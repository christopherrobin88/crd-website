import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { projects } from "@/data/projects";
import { SketchLine } from "@/components/SketchLine";
import { webProjects } from "@/data/web-projects";

/**
 * Homepage proof section, set like a magazine index: every client project on
 * the site, with discipline and client, each linking to its case study. All
 * entries come from the existing project data, so nothing here is new copy
 * about a client. Self-initiated work (AIOS) is left to the Work page.
 */

const entries = [
  ...projects.filter((project) => project.id !== "aios").map((project) => ({
    id: project.id, title: project.title, kind: project.category, client: project.publicationName,
  })),
  ...webProjects.filter((project) => project.liveUrl).map((project) => ({
    id: project.id, title: project.title, kind: project.discipline, client: "Live website",
  })),
];

export function WorkIndex() {
  return (
    <section className="px-6 py-16 md:px-12 md:py-24" aria-labelledby="work-index-title">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 grid gap-6 md:grid-cols-2 md:gap-20">
          <h2 id="work-index-title" className="font-serif text-4xl leading-tight tracking-tight md:text-5xl">Seventeen years,<br /><span className="italic">indexed.</span><SketchLine className="mt-4 w-44" /></h2>
          <p className="max-w-xl text-base leading-relaxed text-crd-forest/85 md:text-lg">National magazine titles, retail campaigns, brand identities and websites. Every entry opens the full project.</p>
        </div>
        <ol className="border-t border-crd-forest/25">
          {entries.map((entry, index) => (
            <li key={entry.id} className="border-b border-crd-forest/25">
              <Link href={`/project/${entry.id}`} className="group grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-x-4 py-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-crd-forest md:grid-cols-[4rem_1.2fr_1fr_1fr_auto] md:py-5">
                <span className="text-xs tracking-widest text-crd-forest/70">{String(index + 1).padStart(2, "0")}</span>
                <span className="font-serif text-2xl tracking-tight transition-colors group-hover:text-crd-moss motion-reduce:transition-none md:text-3xl">{entry.title}</span>
                <span className="hidden text-sm text-crd-forest/80 md:block">{entry.kind}</span>
                <span className="hidden text-sm text-crd-forest/80 md:block">{entry.client}</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
