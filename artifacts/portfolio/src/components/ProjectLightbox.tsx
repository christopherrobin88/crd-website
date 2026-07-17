import { useEffect } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Picture } from "@/components/Picture";
import type { Pic } from "@/components/Picture";
import { prefersReducedMotion } from "@/lib/motion";

export interface LightboxItem {
  pic: Pic;
  alt: string;
}

interface ProjectLightboxProps {
  items: LightboxItem[];
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
  label?: string;
}

/**
 * Full-viewport image viewer for a single article's pages/spreads. Navigation
 * is scoped to whatever `items` list the caller passes in — ProjectContentFlow
 * only ever passes one editorial group's flattened pages, so prev/next can't
 * wander into a different feature or issue.
 */
export function ProjectLightbox({
  items,
  index,
  onIndexChange,
  onClose,
  label,
}: ProjectLightboxProps) {
  const open = items.length > 0;
  const current = items[index];

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") onIndexChange((index + 1) % items.length);
      if (e.key === "ArrowLeft")
        onIndexChange((index - 1 + items.length) % items.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, index, items.length, onIndexChange]);

  if (!current) return null;

  const fadeDuration = prefersReducedMotion() ? 0 : 0.25;

  return (
    <DialogPrimitive.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-crd-forest/95 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 outline-none md:p-12"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <DialogPrimitive.Title className="sr-only">
            {label ? `${label} — image viewer` : "Image viewer"}
          </DialogPrimitive.Title>

          <div className="relative flex max-h-full max-w-full flex-1 items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: fadeDuration }}
                className="max-h-full max-w-full"
              >
                <Picture
                  pic={current.pic}
                  alt={current.alt}
                  className="max-h-[80vh] max-w-full object-contain md:max-h-[85vh]"
                  loading="eager"
                  sizes="90vw"
                />
              </motion.div>
            </AnimatePresence>

            {items.length > 1 && (
              <>
                <button
                  type="button"
                  aria-label="Previous page"
                  onClick={() =>
                    onIndexChange((index - 1 + items.length) % items.length)
                  }
                  className="absolute left-0 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-crd-parchment/10 text-crd-parchment transition-colors hover:bg-crd-parchment/20 md:-left-4"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  aria-label="Next page"
                  onClick={() => onIndexChange((index + 1) % items.length)}
                  className="absolute right-0 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-crd-parchment/10 text-crd-parchment transition-colors hover:bg-crd-parchment/20 md:-right-4"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}
          </div>

          <div className="mt-6 flex items-center gap-4 font-sans text-xs uppercase tracking-widest text-crd-parchment/70">
            {label && <span>{label}</span>}
            {items.length > 1 && (
              <span>
                {index + 1} / {items.length}
              </span>
            )}
          </div>

          <DialogPrimitive.Close
            aria-label="Close"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full text-crd-parchment/80 transition-colors hover:bg-crd-parchment/10 hover:text-crd-parchment md:right-8 md:top-8"
          >
            <X className="h-5 w-5" />
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
