import { useRef } from "react";
import { motion, transform, useScroll, useTransform, type MotionValue } from "framer-motion";
import { Picture } from "@/components/Picture";
import { SketchLine, SketchArrow } from "@/components/SketchLine";
import { useReducedMotionPreference } from "@/hooks/use-reduced-motion-preference";
import spreadLeft from "@/assets/images/kruger/issue-29-spread-01-page-l.jpg?format=webp;jpg&as=picture";
import spreadRight from "@/assets/images/kruger/issue-29-spread-01-page-r.jpg?format=webp;jpg&as=picture";

/**
 * Homepage showpiece: one frame that starts as a Kruger Magazine spread,
 * becomes a browser window and ends as a phone, driven by scroll position.
 * It carries the positioning statement ("why a magazine designer makes
 * better websites") by demonstration.
 *
 * - The spread is composited in code from the two single-page exports, never
 *   a pre-merged file (CLAUDE.md, section 4).
 * - Only opacity, width and border radius change, on a single element.
 * - No artwork is ever cropped: the spread is shown whole with no gutter
 *   shadow across the photograph, and each screenshot fades out to the dark
 *   frame before the frame changes shape.
 * - The pinned part must always fit the viewport. On small screens the
 *   heading and paragraph scroll above it; on short desktop windows the
 *   paragraph is dropped and the heading set smaller.
 * - Under prefers-reduced-motion the three states are laid out side by side
 *   and nothing is pinned.
 */

const DESKTOP = "/work/web/riette-gara-desktop.webp";
const MOBILE = "/work/web/riette-gara-mobile.webp";

const stages = [
  { title: "On the page.", note: "Kruger Magazine, issue 29" },
  { title: "On the screen.", note: "Riette Gara, artist website" },
  { title: "In the hand.", note: "The same site on a phone" },
];

/**
 * Opacity mapped in JS. A plain useTransform(progress, input, output) on
 * opacity is handed to a native scroll timeline, which ignored the tracked
 * element's offsets here and left every layer at its first value.
 */
function useFade(progress: MotionValue<number>, input: number[], output: number[]) {
  const map = transform(input, output);
  return useTransform(() => map(progress.get()));
}

function Spread({ className = "" }: { className?: string }) {
  return (
    <div className={`relative flex h-full w-full ${className}`}>
      <div className="h-full w-1/2 overflow-hidden"><Picture pic={spreadLeft} alt="Kruger Magazine feature opener, left page" className="h-full w-full object-cover" sizes="(min-width: 768px) 30vw, 50vw" /></div>
      <div className="h-full w-1/2 overflow-hidden"><Picture pic={spreadRight} alt="Kruger Magazine feature opener, right page" className="h-full w-full object-cover" sizes="(min-width: 768px) 30vw, 50vw" /></div>
    </div>
  );
}

function Heading() {
  return (
    <>
      <h2 className="font-serif text-3xl leading-tight tracking-tight md:text-5xl [@media(min-width:768px)_and_(max-height:760px)]:text-3xl">Why a magazine designer makes better websites.</h2>
      <SketchLine className="mt-4 w-44" />
      <p className="mt-5 max-w-xl text-base leading-relaxed text-crd-forest/85 md:mt-7 md:text-lg [@media(min-width:768px)_and_(max-height:760px)]:hidden">A magazine has to make sense of a lot of content, fast: what to lead with, what to cut and where to let a picture breathe. A website has the same job. I bring that discipline and years of print production to every publication, brand and site.</p>
    </>
  );
}

function StageLabel({ index, progress }: { index: number; progress: MotionValue<number> }) {
  const ranges: [number[], number[]][] = [
    [[0, 0.24, 0.4], [1, 1, 0.32]],
    [[0.26, 0.42, 0.62, 0.78], [0.32, 1, 1, 0.32]],
    [[0.64, 0.8, 1], [0.32, 1, 1]],
  ];
  const opacity = useFade(progress, ranges[index][0], ranges[index][1]);
  return (
    <motion.li style={{ opacity }} className="flex items-baseline gap-4 border-t border-crd-forest/20 py-3">
      <span className="text-xs tracking-widest">0{index + 1}</span>
      <span className="font-serif text-xl italic md:text-2xl">{stages[index].title}</span>
      <span className="ml-auto hidden text-xs text-crd-forest/75 sm:inline">{stages[index].note}</span>
    </motion.li>
  );
}

function StaticPageToScreen() {
  return (
    <section className="px-6 py-14 md:px-12 md:py-20" aria-label="Why a magazine designer makes better websites">
      <div className="mx-auto max-w-7xl border-y border-crd-forest/20 py-12 md:py-16">
        <Heading />
        <div className="mt-10 grid items-end gap-8 md:grid-cols-[1.5fr_1.5fr_0.5fr]">
          <figure><div className="aspect-[1536/1006] overflow-hidden shadow-[0_18px_44px_-20px_rgba(14,35,32,0.45)]"><Spread /></div><figcaption className="mt-3 font-serif text-lg italic">{stages[0].title}</figcaption></figure>
          <figure><div className="aspect-[1536/1006] overflow-hidden rounded-xl border border-crd-forest/50"><img src={DESKTOP} alt="Riette Gara website on a desktop screen" loading="lazy" className="h-full w-full object-cover object-top" /></div><figcaption className="mt-3 font-serif text-lg italic">{stages[1].title}</figcaption></figure>
          <figure><div className="aspect-[390/800] overflow-hidden rounded-3xl border border-crd-forest/50"><img src={MOBILE} alt="Riette Gara website on a phone" loading="lazy" className="h-full w-full object-cover object-top" /></div><figcaption className="mt-3 font-serif text-lg italic">{stages[2].title}</figcaption></figure>
        </div>
      </div>
    </section>
  );
}

export function PageToScreen() {
  const reduce = useReducedMotionPreference();
  const track = useRef<HTMLDivElement>(null);
  const { scrollYProgress: p } = useScroll({ target: track, offset: ["start start", "end end"] });

  // 0 to 0.24 spread, 0.24 to 0.42 becomes a browser, hold, 0.62 to 0.8 becomes a phone, hold.
  const width = useTransform(p, [0.64, 0.78], ["100%", "31%"]);
  const radius = useTransform(p, [0.24, 0.42, 0.64, 0.78], [0, 12, 12, 30]);
  const chrome = useFade(p, [0.24, 0.42], [0, 1]);
  const barHeight = useTransform(p, [0.24, 0.42, 0.64, 0.78], ["0%", "7%", "7%", "0%"]);
  const barOpacity = useFade(p, [0.24, 0.42, 0.58, 0.64], [0, 1, 1, 0]);
  const borderColor = useTransform(chrome, (v) => `rgba(14, 35, 32, ${0.55 * v})`);
  const spreadOpacity = useFade(p, [0.24, 0.4], [1, 0]);
  const desktopOpacity = useFade(p, [0.28, 0.44, 0.57, 0.64], [0, 1, 1, 0]);
  const mobileOpacity = useFade(p, [0.76, 0.86], [0, 1]);
  const progressScale = useTransform(p, [0, 1], [0, 1]);

  if (reduce) return <StaticPageToScreen />;

  return (
    <section aria-label="Why a magazine designer makes better websites">
      {/* Small screens: the heading and paragraph scroll normally above the
          pinned stage, so the pinned part (labels and frame) always fits,
          including short viewports such as 375 by 667. */}
      <div className="px-6 pt-14 md:hidden"><Heading /></div>
      <div ref={track} className="relative h-[240vh] md:h-[300vh]">
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden px-6 pt-16 md:px-12 md:pt-20">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-5 md:grid-cols-[0.9fr_1.1fr] md:gap-16">
          <div>
            <div className="hidden md:block"><Heading /></div>
            <ol className="border-b border-crd-forest/20 md:mt-10">
              {stages.map((stage, index) => <StageLabel key={stage.title} index={index} progress={p} />)}
            </ol>
            <div aria-hidden="true" className="mt-4 h-px w-full bg-crd-forest/10"><motion.div style={{ scaleX: progressScale }} className="h-px origin-left bg-crd-gold" /></div>
          </div>

          <div className="relative flex aspect-[1536/1006] w-full items-center justify-center">
            <p aria-hidden="true" className="absolute -top-9 right-2 hidden items-center gap-3 font-serif text-lg italic md:flex">Keep scrolling.<SketchArrow className="w-14 rotate-90" /></p>
            <motion.div style={{ width, borderRadius: radius, borderColor }}
              className="relative flex h-full flex-col overflow-hidden border-[1.5px] bg-crd-forest shadow-[0_26px_60px_-26px_rgba(14,35,32,0.55)]">
              <motion.svg style={{ opacity: chrome }} className="crd-browser-pencil" viewBox="0 0 1000 600" preserveAspectRatio="none" aria-hidden="true"><path d="M9 11 C245 6 530 12 986 9 Q992 12 991 25 L993 578 Q990 589 976 587 C743 591 311 585 22 590 Q9 586 11 574 L8 27" /></motion.svg>
              <motion.div aria-hidden="true" style={{ height: barHeight, opacity: barOpacity }} className="flex shrink-0 items-center gap-2 overflow-hidden bg-crd-parchment px-3">
                <span className="crd-browser-dots shrink-0"><i /><i /><i /></span>
                <span className="min-w-0 flex-1 truncate text-center text-[0.6rem] tracking-wide">riettegara.com</span>
              </motion.div>
              <div className="relative min-h-0 flex-1">
                <motion.img src={MOBILE} alt="Riette Gara website on a phone" loading="lazy" style={{ opacity: mobileOpacity }} className="absolute inset-0 h-full w-full object-cover object-top" />
                <motion.img src={DESKTOP} alt="Riette Gara website on a desktop screen" loading="lazy" style={{ opacity: desktopOpacity }} className="absolute inset-0 h-full w-full object-cover object-top" />
                <motion.div style={{ opacity: spreadOpacity }} className="absolute inset-0"><Spread /></motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}
