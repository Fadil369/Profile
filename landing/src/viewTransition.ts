/** Cosmetic transitions must never block an update or reject during rapid clicks. */
export function withViewTransition(update: () => void) {
  const doc = document as Document & {
    startViewTransition?: (cb: () => void) => { ready: Promise<void>; finished: Promise<void> };
  };
  if (typeof doc.startViewTransition === "function" && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const transition = doc.startViewTransition(update);
    void transition.ready.catch(() => {});
    void transition.finished.catch(() => {});
  } else {
    update();
  }
}
