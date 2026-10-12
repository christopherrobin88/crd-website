import { useEffect, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Leaf, X } from "lucide-react";
import { useLocation } from "wouter";
import { SketchLine } from "@/components/SketchLine";
import { newsletterAvailable, newsletterOpenEvent, newsletterUrl } from "@/lib/newsletter";

const storageKey = "crd:studio-notes-dismissed-until";
const quietPeriod = 90 * 24 * 60 * 60 * 1000;

function wasDismissed() {
  try { return Number(localStorage.getItem(storageKey)) > Date.now(); }
  catch { return false; }
}

export function NewsletterPopup() {
  const [path] = useLocation();
  const [open, setOpen] = useState(false);
  const dismissed = useRef(false);
  const started = useRef(0);
  const opener = useRef<HTMLElement | null>(null);
  const closeButton = useRef<HTMLButtonElement | null>(null);

  const changeOpen = (value: boolean) => {
    if (!value) {
      dismissed.current = true;
      try { localStorage.setItem(storageKey, String(Date.now() + quietPeriod)); }
      catch { /* Keep dismissal in memory if browser storage is unavailable. */ }
    }
    setOpen(value);
  };

  useEffect(() => {
    if (!newsletterAvailable) return;
    started.current = Date.now();
    const onOpen = () => {
      opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      setOpen(true);
    };
    window.addEventListener(newsletterOpenEvent, onOpen);
    return () => window.removeEventListener(newsletterOpenEvent, onOpen);
  }, []);

  useEffect(() => {
    if (!newsletterAvailable || open || path.startsWith("/contact")) return;
    const check = () => {
      if (dismissed.current || wasDismissed() || document.visibilityState !== "visible" ||
          !window.matchMedia("(min-width: 768px)").matches ||
          document.querySelector('[role="dialog"]') || document.documentElement.classList.contains("crd-changing-channel")) return;
      const distance = document.documentElement.scrollHeight - window.innerHeight;
      if (Date.now() - started.current < 45000 || distance <= 0 || window.scrollY / distance < 0.35) return;
      opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      setOpen(true);
    };
    const timer = window.setInterval(check, 1000);
    return () => window.clearInterval(timer);
  }, [path, open]);

  if (!newsletterAvailable) return null;

  return <Dialog.Root open={open} onOpenChange={changeOpen}>
    <Dialog.Portal>
      <Dialog.Overlay data-lenis-prevent className="fixed inset-0 z-[80] bg-crd-forest/35" />
      <Dialog.Content data-lenis-prevent
        className="fixed left-1/2 top-1/2 z-[81] max-h-[calc(100dvh_-_2rem)] w-[calc(100%_-_2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-xl border border-crd-forest/20 bg-crd-parchment p-7 text-crd-forest shadow-2xl outline-none sm:p-10"
        onOpenAutoFocus={(event) => { event.preventDefault(); closeButton.current?.focus(); }}
        onCloseAutoFocus={(event) => { event.preventDefault(); opener.current?.focus({ preventScroll: true }); }}>
        <Dialog.Close ref={closeButton} aria-label="Close studio notes"
          className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full hover:bg-crd-forest/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crd-forest">
          <X className="h-5 w-5" aria-hidden="true" />
        </Dialog.Close>
        <Leaf className="mb-5 h-7 w-7 text-crd-moss" strokeWidth={1.25} aria-hidden="true" />
        <p className="mb-4 text-xs uppercase tracking-[0.22em]">Studio notes</p>
        <Dialog.Title className="font-serif text-4xl leading-tight tracking-tight sm:text-5xl">A little of what<br /><span className="italic">goes into the work.</span></Dialog.Title>
        <SketchLine className="my-5 w-40 text-crd-moss" />
        <Dialog.Description className="text-base leading-relaxed">Occasional project updates, design notes and news from Christopher Robin Design. Editorial, branding and the web.</Dialog.Description>
        {newsletterUrl ? <div className="mt-5">
          <iframe src={newsletterUrl} title="CRD email signup form" className="h-[360px] w-full border-0" referrerPolicy="no-referrer" />
          <a href={newsletterUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block border-b border-crd-forest/40 text-sm">Open the signup form in a new tab</a>
        </div> : <div className="mt-6" aria-label="Signup design preview">
          <label htmlFor="studio-notes-email" className="text-sm">Email address</label>
          <input id="studio-notes-email" type="email" placeholder="you@example.com" disabled className="mt-2 w-full rounded-none border-0 border-b border-crd-forest/40 bg-transparent py-3 text-base placeholder:text-crd-forest/60 disabled:opacity-100" />
          <label className="mt-4 flex items-start gap-3 text-sm leading-relaxed">
            <input type="checkbox" disabled className="mt-1 h-4 w-4 shrink-0 accent-crd-forest" />
            I'd like to receive CRD marketing emails. I can unsubscribe at any time.
          </label>
          <button type="button" disabled className="mt-5 w-full rounded-full bg-crd-forest px-6 py-3 text-sm font-medium text-crd-parchment">Send me studio notes</button>
          <p className="mt-4 text-sm leading-relaxed text-crd-forest/80">Design preview. Signups will open once the email account is connected.</p>
        </div>}
        <p className="mt-5 text-xs leading-relaxed text-crd-forest/80">Only the occasional note. Unsubscribe whenever you like.</p>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>;
}
