import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { Link, useSearch } from "wouter";
import { ArrowRight } from "lucide-react";
import { SiteNav } from "@/components/Navigation";
import { SiteFooter } from "@/components/SiteFooter";
import { MistBand } from "@/components/EditorialAtmosphere";
import { usePageMeta } from "@/hooks/use-page-meta";
import { scrollNowTo } from "@/hooks/use-smooth-scroll";
import { CONTACT_EMAIL } from "@/lib/site";
import { PROJECT_TYPES, isProjectType } from "@/lib/enquiry";

const projectTypes = PROJECT_TYPES;

const timelines = [
  "As soon as possible",
  "1 to 2 weeks",
  "This month",
  "Flexible",
  "Planning ahead",
];

const budgets = [
  "Under R5,000",
  "R5,000 to R15,000",
  "R15,000 to R30,000",
  "R30,000 to R60,000",
  "R60,000+",
  "I need guidance",
];

/* Editorial underline fields — shared classes so states stay consistent. */
const fieldClasses =
  "w-full border-0 border-b border-crd-forest/30 bg-transparent py-2.5 font-sans text-base text-crd-forest placeholder:text-crd-forest/40 transition-colors focus:border-crd-gold focus:outline-none focus-visible:outline-none";
/* Native selects keep their accessibility; the chevron is drawn in
   so appearance-none doesn't leave them looking like plain text fields. */
const selectChevron = {
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%230E2320' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
  backgroundPosition: "right 0.25rem center",
  backgroundRepeat: "no-repeat",
} as const;

const labelClasses =
  "block font-sans text-xs font-medium uppercase tracking-widest text-crd-forest/70 mb-1";

interface EnquiryFields {
  name: string;
  email: string;
  company: string;
  projectType: string;
  timeline: string;
  budget: string;
  message: string;
}

function readFields(form: HTMLFormElement): EnquiryFields {
  const data = new FormData(form);
  const get = (k: string) => String(data.get(k) ?? "").trim();
  return {
    name: get("name"),
    email: get("email"),
    company: get("company"),
    projectType: get("projectType"),
    timeline: get("timeline"),
    budget: get("budget"),
    message: get("message"),
  };
}

/* Error fallback: if /api/enquiry fails (rate limit, transient error), hand
   the same composed message to the visitor's own mail client so they still
   have a way to send it. */
function mailtoHref(fields: EnquiryFields): string {
  const lines = [
    `Name: ${fields.name}`,
    `Email: ${fields.email}`,
    `Company: ${fields.company || "(not given)"}`,
    `Project type: ${fields.projectType}`,
    `Timeline: ${fields.timeline}`,
    `Budget range: ${fields.budget || "(not given)"}`,
    "",
    "Project details:",
    fields.message,
  ];
  const subject = encodeURIComponent(`Project enquiry from ${fields.name}`);
  const body = encodeURIComponent(lines.join("\n"));
  return `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
}

type SubmitStatus =
  | { state: "idle" }
  | { state: "sending" }
  | { state: "sent" }
  | { state: "error"; message: string; fallback: string };

export default function Contact() {
  usePageMeta("/contact");

  const search = useSearch();
  // Preselected build type carried in from a "type of build" link elsewhere
  // on the site (/contact?type=…). Only values the select actually offers
  // are honoured.
  const initialType = useMemo(() => {
    const raw = new URLSearchParams(search).get("type");
    return isProjectType(raw) ? raw : "";
  }, [search]);

  const formRef = useRef<HTMLFormElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<SubmitStatus>({ state: "idle" });

  useEffect(() => {
    if (!initialType) {
      scrollNowTo(0);
      return;
    }
    // Arrived via a prefilled link: land on the form itself, ready to type.
    scrollNowTo(0);
    const timer = window.setTimeout(() => {
      formRef.current?.scrollIntoView({ block: "start" });
      nameRef.current?.focus({ preventScroll: true });
    }, 80);
    return () => window.clearTimeout(timer);
  }, [initialType]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fields = readFields(form);
    const honeypot = String(new FormData(form).get("website") ?? "");
    setStatus({ state: "sending" });
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...fields, website: honeypot }),
      });
      const payload = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };
      if (res.ok && payload.ok) {
        setStatus({ state: "sent" });
        form.reset();
      } else {
        setStatus({
          state: "error",
          message:
            payload.error ??
            "Something went wrong sending your enquiry. Your message is ready to send by email instead.",
          fallback: mailtoHref(fields),
        });
      }
    } catch {
      setStatus({
        state: "error",
        message:
          "Something went wrong sending your enquiry. Your message is ready to send by email instead.",
        fallback: mailtoHref(fields),
      });
    }
  }

  return (
    <div className="min-h-screen text-foreground">
      <SiteNav />

      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-40 md:pt-52 pb-24 md:pb-28">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl tracking-tight mb-8 leading-[1]">
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="hover:text-accent transition-colors duration-300 block"
            >
              Let's build the next identity, publication or campaign system.
            </a>
          </h1>

          <p className="font-sans text-lg md:text-xl text-foreground/70 leading-relaxed max-w-lg mb-6">
            For agencies, production companies and brands looking for senior
            creative support, CRD works across art direction, editorial
            design, campaign systems and AI-assisted production workflows.
          </p>

          <p className="font-sans text-base md:text-lg text-foreground/60 leading-relaxed max-w-lg">
            Tell me what you're building, fixing or trying to make sharper.
            I'll come back with the clearest next step.
          </p>
        </motion.div>

        {/* Intake — the start of the onboarding conversation, not just details */}
        <motion.div
          className="mt-20 md:mt-28 grid grid-cols-1 gap-12 lg:grid-cols-[minmax(280px,0.38fr)_minmax(0,0.62fr)] lg:gap-16 items-start"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Left rail — what happens next + direct contact details */}
          <div className="space-y-10">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl tracking-tight mb-4">
                Start a project conversation
              </h2>
              <p className="font-sans text-base text-foreground/70 leading-relaxed max-w-md">
                Share the essentials and I'll use this to understand the
                scope, timing and best way forward.
              </p>
            </div>

            <div>
              <h3 className="font-sans text-xs font-medium uppercase tracking-widest text-crd-forest/70 mb-4">
                What happens next
              </h3>
              <ol className="space-y-3 font-sans text-sm text-foreground/70 leading-relaxed list-none">
                <li className="flex gap-3">
                  <span className="text-crd-gold" aria-hidden="true">01</span>
                  I read every enquiry personally.
                </li>
                <li className="flex gap-3">
                  <span className="text-crd-gold" aria-hidden="true">02</span>
                  You'll get a reply within two working days.
                </li>
                <li className="flex gap-3">
                  <span className="text-crd-gold" aria-hidden="true">03</span>
                  We agree scope and the clearest next step — no obligation.
                </li>
              </ol>
            </div>

            <div className="border-t border-crd-gold/25 pt-8">
              <h3 className="font-sans text-xs font-medium uppercase tracking-widest text-crd-forest/70 mb-4">
                Prefer email or LinkedIn?
              </h3>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="block font-sans text-sm text-crd-forest underline decoration-crd-gold/60 underline-offset-4 hover:text-accent transition-colors break-all"
              >
                {CONTACT_EMAIL}
              </a>
              <div className="mt-6 flex flex-col sm:flex-row gap-4 sm:gap-10 font-sans text-sm uppercase tracking-[0.18em] text-foreground/60">
                <Link href="/work" className="hover:text-foreground transition-colors">
                  View Work
                </Link>
                <Link href="/services" className="hover:text-foreground transition-colors">
                  Services
                </Link>
                <a
                  href="https://linkedin.com/in/christopher-gara"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  LinkedIn
                </a>
              </div>
            </div>
          </div>

          {/* Intake card — parchment panel, gold hairline, editorial fields */}
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="scroll-mt-28 border border-crd-gold/30 bg-crd-parchment/75 p-6 shadow-[0_18px_44px_-20px_rgba(14,35,32,0.35)] md:p-10"
          >
            <p className="font-sans text-xs uppercase tracking-[0.22em] text-crd-gold">
              Project enquiry
            </p>
            <span className="mt-4 mb-8 block h-px w-full bg-crd-gold/30" aria-hidden="true" />

            {/* Honeypot — invisible to people, irresistible to bots. */}
            <div aria-hidden="true" className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden">
              <label htmlFor="enquiry-website">Website</label>
              <input
                id="enquiry-website"
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <div className="grid grid-cols-1 gap-7 sm:grid-cols-2">
              <div>
                <label htmlFor="enquiry-name" className={labelClasses}>
                  Name *
                </label>
                <input
                  ref={nameRef}
                  id="enquiry-name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="Your name"
                  className={fieldClasses}
                />
              </div>
              <div>
                <label htmlFor="enquiry-email" className={labelClasses}>
                  Email *
                </label>
                <input
                  id="enquiry-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@company.com"
                  className={fieldClasses}
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="enquiry-company" className={labelClasses}>
                  Company / business name
                </label>
                <input
                  id="enquiry-company"
                  name="company"
                  type="text"
                  autoComplete="organization"
                  placeholder="Optional"
                  className={fieldClasses}
                />
              </div>
              <div>
                <label htmlFor="enquiry-type" className={labelClasses}>
                  Project type *
                </label>
                <select
                  id="enquiry-type"
                  name="projectType"
                  required
                  defaultValue={initialType}
                  className={`${fieldClasses} appearance-none pr-8`}
                  style={selectChevron}
                >
                  <option value="" disabled>
                    Select one
                  </option>
                  {projectTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="enquiry-timeline" className={labelClasses}>
                  Timeline *
                </label>
                <select
                  id="enquiry-timeline"
                  name="timeline"
                  required
                  defaultValue=""
                  className={`${fieldClasses} appearance-none pr-8`}
                  style={selectChevron}
                >
                  <option value="" disabled>
                    Select one
                  </option>
                  {timelines.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="enquiry-budget" className={labelClasses}>
                  Budget range <span className="normal-case tracking-normal text-crd-forest/50">(optional)</span>
                </label>
                <select
                  id="enquiry-budget"
                  name="budget"
                  defaultValue=""
                  className={`${fieldClasses} appearance-none pr-8`}
                  style={selectChevron}
                >
                  <option value="">Prefer not to say yet</option>
                  {budgets.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="enquiry-message" className={labelClasses}>
                  Message / project details *
                </label>
                <textarea
                  id="enquiry-message"
                  name="message"
                  required
                  rows={5}
                  placeholder="What are you building, fixing or trying to make sharper?"
                  className={`${fieldClasses} resize-y`}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={status.state === "sending"}
              className="group crd-lift mt-10 inline-flex items-center gap-3 whitespace-nowrap bg-crd-forest px-8 py-4 font-sans text-[0.7rem] uppercase tracking-[0.24em] text-crd-parchment hover:bg-crd-moss focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crd-gold focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-70"
            >
              {status.state === "sending" ? "Sending…" : "Send enquiry"}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>

            {/* Outcome — announced to assistive tech as it changes. */}
            <div role="status" aria-live="polite">
              {status.state === "sent" && (
                <p className="mt-6 border-l-2 border-crd-moss pl-4 font-sans text-sm leading-relaxed text-crd-forest">
                  Thank you — your enquiry is on its way to the studio.
                  You'll hear back within two working days.
                </p>
              )}
              {status.state === "error" && (
                <p className="mt-6 border-l-2 border-crd-gold pl-4 font-sans text-sm leading-relaxed text-crd-forest">
                  {status.message}{" "}
                  <a
                    href={status.fallback}
                    className="underline decoration-crd-gold/60 underline-offset-2 hover:text-crd-moss"
                  >
                    Open your email app
                  </a>
                  .
                </p>
              )}
            </div>

            <p className="mt-6 font-sans text-xs leading-relaxed text-crd-forest/60 max-w-md">
              Your enquiry goes straight to the studio inbox — nothing is
              stored on this site. If you'd rather write freely, email{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="underline decoration-crd-gold/60 underline-offset-2 hover:text-crd-forest"
              >
                {CONTACT_EMAIL}
              </a>{" "}
              directly.
            </p>
          </form>
        </motion.div>
      </div>

      {/* Lower-edge atmosphere — consistent with the Phase 0 page endings */}
      <MistBand className="h-40 md:h-56" />

      <SiteFooter />
    </div>
  );
}
