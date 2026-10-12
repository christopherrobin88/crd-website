import { useEffect } from "react";
import { Link } from "wouter";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { SiteNav } from "@/components/Navigation";
import { SiteFooter } from "@/components/SiteFooter";
import { webProjects } from "@/data/web-projects";
import { usePageMeta } from "@/hooks/use-page-meta";
import { scrollNowTo } from "@/hooks/use-smooth-scroll";
import { contactHref } from "@/lib/enquiry";

export default function WebProject({ id }: { id: string }) {
  const project = webProjects.find((item) => item.id === id)!;
  usePageMeta(`/project/${id}`);
  useEffect(() => scrollNowTo(0), [id]);
  return (
    <div className="min-h-screen text-crd-forest">
      <SiteNav />
      <main className="mx-auto max-w-7xl px-6 pb-24 pt-32 md:px-12 md:pt-40">
        <Link href="/work" state={{ restoreWork: true }} className="inline-flex items-center gap-2 text-sm"><ArrowLeft className="h-4 w-4" aria-hidden="true" />Back to work</Link>
        <header className="mb-10 mt-10 grid gap-7 md:mb-14 md:grid-cols-2 md:gap-14">
          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.2em]">{project.discipline}</p>
            <h1 className="font-serif text-5xl leading-tight tracking-tight md:text-7xl">{project.title}</h1>
          </div>
          <div className="md:pt-8">
            <p className="text-lg leading-relaxed text-crd-forest/85">{project.introduction}</p>
            <p className="mt-5 text-sm text-crd-forest/80">{project.status}</p>
            {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 border-b border-crd-gold pb-1 text-sm font-medium">Visit the website<ArrowUpRight className="h-4 w-4" aria-hidden="true" /></a>}
          </div>
        </header>
        <figure className="overflow-hidden rounded-xl border border-crd-forest/20 bg-crd-forest/5 p-2 md:p-4">
          <img src={project.desktop} width={1440} height={1000} alt={`${project.title} desktop website presentation`} fetchPriority="high" className="h-auto w-full rounded-lg" />
        </figure>
        {project.previewVideo && <figure className="mt-10">
          <video src={project.previewVideo} poster={project.desktop} controls playsInline preload="metadata" aria-label={`${project.title} recorded website interaction`} className="w-full rounded-xl border border-crd-forest/20" />
          <figcaption className="mt-3 text-sm text-crd-forest/80">Recorded website interaction. Silent.</figcaption>
        </figure>}
        <div className="mt-16 grid items-start gap-12 md:mt-24 md:grid-cols-[1fr_300px] md:gap-24">
          <div className="space-y-14">
            {project.details.map((detail) => (
              <section key={detail.title}>
                <h2 className="font-serif text-3xl leading-tight tracking-tight md:text-4xl">{detail.title}</h2>
                <p className="mt-5 max-w-2xl text-base leading-relaxed text-crd-forest/80 md:text-lg">{detail.body}</p>
                {detail.image && <img src={detail.image} width={1440} height={1000} alt={detail.alt} loading="lazy" className="mt-7 h-auto w-full rounded-xl border border-crd-forest/20" />}
              </section>
            ))}
            {id === "behelm-web" && <Link href="/project/behelm" className="inline-flex items-center gap-2 border-b border-crd-gold pb-2 text-sm">View the earlier logo system study<ArrowUpRight className="h-4 w-4" aria-hidden="true" /></Link>}
          </div>
          <figure className="mx-auto w-full max-w-[300px]">
            <img src={project.mobile} width={390} height={1000} alt={`${project.title} mobile website presentation`} loading="lazy" className="h-auto w-full rounded-xl border border-crd-forest/20" />
            <figcaption className="mt-4 text-sm text-crd-forest/80">Mobile presentation</figcaption>
          </figure>
        </div>
        <section className="mt-20 border-t border-crd-forest/20 pt-12">
          <h2 className="font-serif text-3xl md:text-4xl">Bring your work onto the web.</h2>
          <Link href={contactHref("Website or portfolio")} className="mt-7 inline-block rounded-full bg-crd-forest px-7 py-4 text-sm font-medium text-crd-parchment">Discuss a website</Link>
          <Link href="/web" className="ml-6 mt-7 inline-block border-b border-crd-gold pb-2 text-sm">More web work</Link>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
