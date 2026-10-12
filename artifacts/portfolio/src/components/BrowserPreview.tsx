import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { Pause, Play } from "lucide-react";
import { useReducedMotionPreference } from "@/hooks/use-reduced-motion-preference";
import { gsap } from "@/lib/motion";

/** Supplied screenshots or recorded interactions in a browser window. */
export function BrowserPreview({ title, image, mobileImage, previewVideo, href, fromWork, onOpen }: {
  title: string; image: string; mobileImage: string; previewVideo?: string; href: string; fromWork?: boolean; onOpen?: () => void;
}) {
  const frame = useRef<HTMLDivElement>(null);
  const screen = useRef<HTMLDivElement>(null);
  const artwork = useRef<HTMLImageElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const animation = useRef<gsap.core.Tween | null>(null);
  const visible = useRef(false);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotionPreference();
  const canPlay = useRef(false);
  canPlay.current = !paused && !reduce;

  useEffect(() => {
    if (!frame.current || !screen.current || !artwork.current || reduce) return;
    const imageNode = artwork.current;
    const screenNode = screen.current;
    const desktop = window.matchMedia("(min-width: 768px)");
    const updatePlayback = () => {
      if (canPlay.current && visible.current && !document.hidden && (!previewVideo || !desktop.matches)) animation.current?.play();
      else animation.current?.pause();
    };
    const measure = () => {
      animation.current?.kill();
      const travel = Math.max(0, imageNode.offsetHeight - screenNode.clientHeight);
      animation.current = gsap.fromTo(imageNode, { y: 0 }, {
        y: -travel, duration: 8, ease: "sine.inOut", repeat: -1,
        yoyo: true, repeatDelay: 1.5, paused: true,
      });
      updatePlayback();
    };
    const resize = new ResizeObserver(measure);
    resize.observe(screenNode);
    const observer = new IntersectionObserver(([entry]) => {
      visible.current = entry.isIntersecting;
      updatePlayback();
    }, { threshold: 0.2 });
    observer.observe(frame.current);
    imageNode.addEventListener("load", measure);
    desktop.addEventListener("change", measure);
    document.addEventListener("visibilitychange", updatePlayback);
    measure();
    return () => {
      resize.disconnect(); observer.disconnect(); animation.current?.kill();
      gsap.set(imageNode, { clearProps: "transform" });
      imageNode.removeEventListener("load", measure);
      desktop.removeEventListener("change", measure);
      document.removeEventListener("visibilitychange", updatePlayback);
    };
  }, [image, mobileImage, reduce, previewVideo]);

  useEffect(() => {
    const media = video.current;
    const container = frame.current;
    if (!media || !container || reduce) return;
    const desktop = window.matchMedia("(min-width: 768px)");
    const update = () => {
      if (canPlay.current && visible.current && !document.hidden && desktop.matches) void media.play().catch(() => {});
      else media.pause();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible.current = entry.isIntersecting; update();
    }, { threshold: 0.2 });
    observer.observe(container);
    document.addEventListener("visibilitychange", update);
    desktop.addEventListener("change", update);
    return () => { observer.disconnect(); media.pause(); document.removeEventListener("visibilitychange", update); desktop.removeEventListener("change", update); };
  }, [previewVideo, reduce]);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 768px)").matches;
    if (canPlay.current && visible.current && !document.hidden && (!previewVideo || !desktop)) animation.current?.play();
    else animation.current?.pause();
    if (canPlay.current && visible.current && !document.hidden && desktop) void video.current?.play().catch(() => {});
    else video.current?.pause();
  }, [paused, reduce]);

  return (
    <div ref={frame} className="crd-browser">
      <svg className="crd-browser-pencil" viewBox="0 0 1000 600" preserveAspectRatio="none" aria-hidden="true"><path d="M9 11 C245 6 530 12 986 9 Q992 12 991 25 L993 578 Q990 589 976 587 C743 591 311 585 22 590 Q9 586 11 574 L8 27" /></svg>
      <div className="crd-browser-bar">
        <span className="crd-browser-dots" aria-hidden="true"><i /><i /><i /></span>
        <span className="min-w-0 flex-1 truncate text-center text-[0.65rem] tracking-wide">{title} / <span className="md:hidden">mobile</span><span className="hidden md:inline">website</span> preview</span>
        {!reduce && <button type="button" onClick={() => setPaused((value) => !value)}
          aria-label={`${paused ? "Play" : "Pause"} ${title} preview`} aria-pressed={paused}
          className="rounded-full p-2 hover:bg-crd-forest/10 focus-visible:outline-2 focus-visible:outline-crd-forest">
          {paused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
        </button>}
      </div>
      <Link href={href} state={fromWork ? { fromWork: true } : undefined} onClick={onOpen}
        aria-label={`Explore ${title} website design`} className="block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-crd-forest">
        <div ref={screen} className="crd-browser-screen">
          {previewVideo && !reduce && <video ref={video} src={previewVideo} poster={image} muted loop playsInline preload="none" aria-label={`${title} website interaction recording`} className="hidden h-full w-full object-contain md:block" />}
          <picture className={previewVideo && !reduce ? "block md:hidden" : "block"}>
            <source media="(max-width: 767px)" srcSet={mobileImage} />
            <img ref={artwork} src={image} alt={`${title} responsive website design`} width={1440} height={1000} loading="lazy" className="block h-auto w-full" />
          </picture>
        </div>
      </Link>
    </div>
  );
}
