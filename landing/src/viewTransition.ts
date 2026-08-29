/**
 * Wraps a state update in the View Transitions API when the browser supports it
 * (mainly mobile Safari/Chrome), so theme/language/menu swaps cross-fade instead
 * of snapping. Falls back to a plain call everywhere else.
 */
export function withViewTransition(update: () => void) {
  const doc = document as Document & {
    startViewTransition?: (cb: () => void) => void;
  };
  if (typeof doc.startViewTransition === "function") {
    doc.startViewTransition(update);
  } else {
    update();
  }
}
