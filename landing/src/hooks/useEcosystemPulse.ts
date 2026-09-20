import { useEffect, useState } from "react";

export type PulseState = "checking" | "online" | "probe";

/** Best-effort reachability check for each ecosystem URL.
 *  Probes run server-side via the same-origin /__pulse worker endpoint,
 *  which is immune to browser CORS/CORP blocks. Falls back gracefully. */
export function useEcosystemPulse(urls: string[]) {
  const [statuses, setStatuses] = useState<Record<string, PulseState>>(() =>
    Object.fromEntries(urls.map((u) => [u, "checking"]))
  );

  const key = urls.join("|");

  useEffect(() => {
    if (!urls.length) return;

    const controller = new AbortController();
    const qs = urls.map((u) => `u=${encodeURIComponent(u)}`).join("&");

    fetch(`/__pulse?${qs}`, {
      method: "GET",
      signal: controller.signal,
      cache: "no-cache",
    })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("bad status"))))
      .then((data) => {
        const results = data?.results;
        if (!results) return;
        setStatuses((prev) => {
          const next = { ...prev };
          for (const u of urls) {
            next[u] = results[u] === "online" ? "online" : "probe";
          }
          return next;
        });
      })
      .catch(() => {
        // Unreachable /__pulse → leave dots ambiguous (grey), not alarming.
      });

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return statuses;
}