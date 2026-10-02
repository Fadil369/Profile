import { useEffect, type RefObject } from "react";

/** Trap keyboard focus, hide background content, and restore the trigger on close. */
export function useDialog(ref: RefObject<HTMLElement>, open: boolean, close: () => void) {
  useEffect(() => {
    const node = ref.current;
    if (!open || !node) return;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    const siblings: Array<[HTMLElement, boolean]> = [];
    let branch: HTMLElement = node;
    while (branch.parentElement && branch !== document.body) {
      for (const sibling of Array.from(branch.parentElement.children)) {
        if (sibling !== branch && sibling instanceof HTMLElement) {
          siblings.push([sibling, sibling.inert]);
          sibling.inert = true;
        }
      }
      branch = branch.parentElement;
    }
    document.body.style.overflow = "hidden";
    node.focus();
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); close(); return; }
      if (event.key !== "Tab") return;
      const items = Array.from(node.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), iframe, [tabindex="0"]')).filter(el => el.getClientRects().length && !el.closest('[inert]'));
      const first = items[0], last = items[items.length - 1];
      if (!first) { event.preventDefault(); node.focus(); }
      else if (event.shiftKey && (document.activeElement === first || document.activeElement === node || !node.contains(document.activeElement))) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && (document.activeElement === last || document.activeElement === node || !node.contains(document.activeElement))) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", keydown);
    return () => {
      document.removeEventListener("keydown", keydown);
      document.body.style.overflow = overflow;
      siblings.forEach(([element, inert]) => { element.inert = inert; });
      if (previous?.isConnected) previous.focus();
    };
  }, [open, close, ref]);
}
