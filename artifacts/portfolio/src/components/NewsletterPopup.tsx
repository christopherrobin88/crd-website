import { useEffect, useRef, useState, type FormEvent } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Leaf, X } from "lucide-react";
import { useLocation } from "wouter";
import { SketchLine } from "@/components/SketchLine";
import { newsletterAvailable, newsletterOpenEvent, newsletterUrl, newsletterGmail, newsletterConsentText, newsletterConsentVersion } from "@/lib/newsletter";
import { CONTACT_EMAIL } from "@/lib/site";

const storageKey = "crd:studio-notes-dismissed-until";
const quietPeriod = 90 * 24 * 60 * 60 * 1000;

function wasDismissed() {
  try { return Number(localStorage.getItem(storageKey)) > Date.now(); }
  catch { return false; }
}

export function NewsletterPopup() {
  const [path] = useLocation();
  const [open, setOpen] = useState(false);
  const [signupStatus, setSignupStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [signupError, setSignupError] = useState("");
  const sending = useRef(false);
  const dismissed = useRef(false);
  const started = useRef(0);
  const opener = useRef<HTMLElement | null>(null);
  const closeButton = useRef<HTMLButtonElement | null>(null);

  async function submitSignup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending.current) return;
    const data = new FormData(event.currentTarget);
    sending.current = true;
    setSignupStatus("sending");
    setSignupError("");
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.get("email"), consent: data.get("consent") === "on", consentVersion: newsletterConsentVersion, website: data.get("website") }),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || result?.ok !== true) {
        setSignupError(typeof result?.error === "string" ? result.error : "Your signup could not be sent. Please try again later.");
        setSignupStatus("error");
        return;
      }
      setSignupStatus("sent");
    } catch {
      setSignupError("Your signup could not be sent. Please check your connection and try again.");
      setSignupStatus("error");
    } finally { sending.current = false; }
  }

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
        {newsletterGmail ? <div className="mt-6">
          {signupStatus === "sent" ? <p role="status" className="border-t border-crd-forest/20 pt-5 text-base leading-relaxed">Thank you. Your signup request has been sent to the studio. We’ll keep you posted with the occasional note.</p> : <form onSubmit={submitSignup} aria-busy={signupStatus === "sending"}>
            <fieldset disabled={signupStatus === "sending"}>
              <label htmlFor="studio-notes-email" className="text-sm">Email address</label>
              <input id="studio-notes-email" name="email" type="email" required maxLength={254} autoComplete="email" placeholder="you@example.com" className="mt-2 w-full rounded-none border-0 border-b border-crd-forest/40 bg-transparent py-3 text-base placeholder:text-crd-forest/60 focus:outline-2 focus:outline-offset-2 focus:outline-crd-forest" />
              <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden"><label htmlFor="studio-notes-website">Website</label><input id="studio-notes-website" name="website" tabIndex={-1} autoComplete="off" /></div>
              <label className="mt-4 flex min-h-11 items-start gap-3 text-sm leading-relaxed"><input name="consent" type="checkbox" required className="mt-1 h-5 w-5 shrink-0 accent-crd-forest" />{newsletterConsentText}</label>
              <button type="submit" className="mt-5 min-h-11 w-full rounded-full bg-crd-forest px-6 py-3 text-sm font-medium text-crd-parchment disabled:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-crd-forest">{signupStatus === "sending" ? "Sending…" : "Send me studio notes"}</button>
            </fieldset>
            {signupStatus === "error" && <p role="alert" className="mt-4 text-sm leading-relaxed">{signupError}</p>}
          </form>}
          <p className="mt-4 text-xs leading-relaxed text-crd-forest/80">Your email and consent are sent to CRD’s inbox to keep a private signup record. To unsubscribe or request removal, email <a href={`mailto:${CONTACT_EMAIL}?subject=Unsubscribe%20from%20CRD%20Studio%20notes`} className="underline">{CONTACT_EMAIL}</a>.</p>
        </div> : newsletterUrl ? <div className="mt-5">
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
