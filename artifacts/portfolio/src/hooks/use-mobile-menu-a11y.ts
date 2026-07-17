import { useEffect, type RefObject } from "react";

/**
 * Keyboard behaviour shared by the two mobile menu implementations (SiteNav
 * and the Landing header): Escape closes the menu and returns focus to the
 * trigger, and opening the menu moves focus to its first link so keyboard
 * users land inside the overlay they just opened.
 */
export function useMobileMenuA11y({
  open,
  close,
  triggerRef,
  menuRef,
}: {
  open: boolean;
  close: () => void;
  triggerRef: RefObject<HTMLButtonElement | null>;
  menuRef: RefObject<HTMLElement | null>;
}) {
  useEffect(() => {
    if (!open) return;

    menuRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
        triggerRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, close, triggerRef, menuRef]);
}
