import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import { projects, projectContent, type ProjectLayout } from "@/data/projects";
import { ProjectContentFlow } from "@/components/ProjectContentFlow";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useLayoutEffect, useRef } from "react";
import { Fleck, MistBand, QuoteBand } from "@/components/EditorialAtmosphere";
import { JourneyRail } from "@/components/diagrams/JourneyRail";
import { usePageMeta } from "@/hooks/use-page-meta";
import { scrollNowTo } from "@/hooks/use-smooth-scroll";
import { contactHref, enquiryTypeForProject } from "@/lib/enquiry";

/* Copy-rail labels and enquiry line per layout variant. Same authentic data
   fields throughout — only the framing language changes. */
const VARIANT_TEXT: Record<
  ProjectLayout,
  { brief: string; process: string; enquiry: string }
> = {
  editorial: {
    brief: "The Brief",
    process: "Process",
    enquiry: "Planning a publication or editorial project?",
  },
  identity: {
    brief: "The Brief",
    process: "The System",
    enquiry: "Building an identity or packaging system that has to hold up in use?",
  },
  campaign: {
    brief: "The Brief",
    process: "Workflow & Scale",
    enquiry: "Rolling out campaign work at volume?",
  },
};

export default function ProjectDetail() {
  const { id } = useParams();
  const project = projects.find(p => p.id === id);
  const content = project ? projectContent[project.id] : undefined;
  const copyRef = useRef<HTMLDivElement>(null);

  usePageMeta(`/project/${id}`);

  useEffect(() => {
    scrollNowTo(0);
  }, [id]);

  useLayoutEffect(() => {
    const copy = copyRef.current;
    if (!copy) return;

    const updateCopyHeight = () => {
      copy.style.setProperty("--project-copy-height", `${copy.offsetHeight}px`);
    };

    updateCopyHeight();
    const observer = new ResizeObserver(updateCopyHeight);
    observer.observe(copy);

    return () => observer.disconnect();
  }, [id]);

  if (!project || !content) return <div className="p-24">Project not found</div>;

  const text = VARIANT_TEXT[project.layout];
  const index = projects.indexOf(project);
  const prev = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];

  return (
    <motion.div 
      className="min-h-screen text-foreground pb-32"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Minimal Nav for Detail — scrimmed so scrolling hero/text pass cleanly beneath it */}
      <nav className="fixed top-0 left-0 w-full z-50 px-6 py-6 md:px-12 md:py-7 flex justify-between items-center text-crd-forest bg-crd-parchment/85 backdrop-blur-md border-b border-crd-forest/10">
        {/* Arriving from a Work card leaves { fromWork: true } in history
            state; going back through real history restores the visitor's
            exact Work-page position without pushing a duplicate entry. The
            plain-link fallback (direct entry, prev/next chains) carries
            restoreWork so /work still reopens where they left it when a
            saved position exists. */}
        <Link
          href="/work"
          state={{ restoreWork: true }}
          onClick={(event) => {
            if ((window.history.state as { fromWork?: boolean } | null)?.fromWork) {
              event.preventDefault();
              window.history.back();
            }
          }}
          className="font-sans text-xs uppercase tracking-[0.22em] hover:text-crd-gold transition-colors flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crd-gold focus-visible:ring-offset-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Work
        </Link>
      </nav>

      {/* Hero Section */}
      <div className="h-[60vh] md:h-[65vh] relative flex items-center justify-center bg-muted overflow-hidden">
        <img src={project.coverImage.img.src} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover opacity-30 blur-sm scale-110" fetchPriority="high" decoding="async" />
        <div className="absolute inset-0 bg-background/40" />
        <div className="relative z-10 text-center max-w-4xl px-6">
          <motion.div
            className="font-sans text-xs font-medium uppercase tracking-widest text-crd-forest/80 mb-6"
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
          >
            {project.publicationName}{project.year ? ` — ${project.year}` : ""}
          </motion.div>
          <motion.h1
            className="font-serif text-6xl md:text-8xl lg:text-9xl tracking-tighter mb-8"
            initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
          >
            {project.title}
          </motion.h1>
          <motion.div
            className="font-sans text-sm font-medium uppercase tracking-widest text-crd-forest/70"
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}
          >
            Role: {project.role}
          </motion.div>
        </div>
        {/* Soft parchment fade — eases the hero's hard bottom edge into the page */}
        <div
          aria-hidden="true"
          className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-crd-parchment/80 to-transparent"
        />
      </div>

      {/* Divider ornament — gold hairlines and a static fleck */}
      <div
        aria-hidden="true"
        className="mt-12 md:mt-16 flex items-center justify-center gap-5"
      >
        <span className="h-px w-16 bg-crd-gold/50 md:w-24" />
        <Fleck className="h-3 w-3 opacity-80" />
        <span className="h-px w-16 bg-crd-gold/50 md:w-24" />
      </div>

      {/* Details + content flow — sticky left info rail alongside a fluid right-hand visual stream */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-12 md:mt-16 grid grid-cols-1 lg:grid-cols-[minmax(280px,0.34fr)_minmax(0,0.66fr)] gap-10 xl:gap-16 items-start relative">
        <div
          ref={copyRef}
          className="self-start space-y-8 lg:sticky lg:top-[min(7rem,calc(100vh-var(--project-copy-height)-2rem))]"
        >
          {/* Sticky-rail context, not a heading — the page h1 already names
              the project; repeating it as an h2 duplicated the document
              outline. The name stays visible for readers who scrolled the
              hero away. */}
          <div>
            <p className="font-serif text-3xl md:text-4xl tracking-tight text-crd-forest mb-2">
              {project.title}
            </p>
            <p className="font-sans text-xs font-medium uppercase tracking-widest text-crd-forest/70">
              {project.publicationName}{project.year ? ` — ${project.year}` : ""}
            </p>
          </div>

          {/* The arc the copy below follows — Brief (challenge), Process
              (strategy, design, production), Outcomes (result). */}
          <JourneyRail className="border-y border-crd-gold/20 py-3" />

          <dl className="font-sans text-sm space-y-3">
            <div>
              <dt className="text-xs font-medium uppercase tracking-widest text-crd-forest/70 mb-1">Role</dt>
              <dd className="text-crd-forest/90">{project.role}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-widest text-crd-forest/70 mb-1">Category</dt>
              <dd className="text-crd-forest/90">{project.category}</dd>
            </div>
            {project.toolsUsed?.length ? (
              <div>
                <dt className="text-xs font-medium uppercase tracking-widest text-crd-forest/70 mb-1">Tools</dt>
                <dd className="text-crd-forest/90">{project.toolsUsed.join(", ")}</dd>
              </div>
            ) : null}
            {project.outcomes ? (
              <div>
                <dt className="text-xs font-medium uppercase tracking-widest text-crd-forest/70 mb-1">Outcomes</dt>
                <dd className="text-crd-forest/90">{project.outcomes}</dd>
              </div>
            ) : null}
          </dl>

          <div>
            <h2 className="font-sans text-xs font-medium uppercase tracking-widest text-crd-forest/70 mb-3">{text.brief}</h2>
            <p className="font-sans text-base md:text-lg leading-relaxed text-foreground/80">
              {project.fullDescription}
            </p>
          </div>
          <div>
            <h2 className="font-sans text-xs font-medium uppercase tracking-widest text-crd-forest/70 mb-3">{text.process}</h2>
            <p className="font-sans text-base md:text-lg leading-relaxed text-foreground/80">
              {project.processNotes}
            </p>
          </div>
        </div>

        {/* Content flow — the visual stream; ProjectContentFlow keeps its own
            internal max-w-5xl runs, which now scale to this column's width. */}
        <div className="space-y-6 md:space-y-8 lg:space-y-10">
          <ProjectContentFlow
            content={content}
            title={project.title}
            variant={project.layout === "identity" ? "plates" : "editorial"}
          />
        </div>
      </div>

      {/* Enquiry close — somewhere to go once the case study has made its case */}
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <QuoteBand className="mt-20 md:mt-28">
          <div className="mx-auto max-w-xl text-center">
            <p className="font-serif text-2xl md:text-3xl tracking-tight text-crd-forest">
              {text.enquiry}
            </p>
            <Link
              href={contactHref(enquiryTypeForProject(project))}
              className="group crd-lift mt-8 inline-flex items-center gap-3 bg-crd-forest px-7 py-3.5 font-sans text-[0.7rem] uppercase tracking-[0.24em] text-crd-parchment hover:bg-crd-moss focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crd-gold focus-visible:ring-offset-2 whitespace-nowrap"
            >
              Start a conversation
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </QuoteBand>

        {/* Onward browsing — previous/next in Work-page order. Plain links,
            no fromWork state and no launch bookkeeping, so the saved Work
            return position survives project-to-project browsing. */}
        <nav
          aria-label="More projects"
          className="mt-12 md:mt-16 grid grid-cols-2 gap-6 border-t border-crd-gold/25 pt-8"
        >
          <Link
            href={`/project/${prev.id}`}
            className="group flex flex-col gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crd-gold focus-visible:ring-offset-2"
          >
            <span className="flex items-center gap-2 font-sans text-[0.7rem] uppercase tracking-[0.22em] text-crd-forest/70 transition-colors group-hover:text-crd-gold whitespace-nowrap">
              <ArrowLeft className="h-3.5 w-3.5" /> Previous
            </span>
            <span className="font-serif text-xl md:text-2xl tracking-tight text-crd-forest">
              {prev.title}
            </span>
          </Link>
          <Link
            href={`/project/${next.id}`}
            className="group flex flex-col items-end gap-2 text-right focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crd-gold focus-visible:ring-offset-2"
          >
            <span className="flex items-center gap-2 font-sans text-[0.7rem] uppercase tracking-[0.22em] text-crd-forest/70 transition-colors group-hover:text-crd-gold whitespace-nowrap">
              Next <ArrowRight className="h-3.5 w-3.5" />
            </span>
            <span className="font-serif text-xl md:text-2xl tracking-tight text-crd-forest">
              {next.title}
            </span>
          </Link>
        </nav>
      </div>

      {/* Closing atmosphere — misty treeline rising beneath the case study */}
      <MistBand className="mt-16 md:mt-24 -mb-32 h-48 md:h-64" />

    </motion.div>
  );
}
