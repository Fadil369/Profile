import { useEffect, useState } from "react";
export type PulseState = "checking" | "online" | "probe";

/** Best-effort HTTP reachability only; no assertion about service operation. */
export function useEcosystemPulse(urls: string[]) {
  const [statuses, setStatuses] = useState<Record<string, PulseState>>({});
  const key = urls.join("|");
  useEffect(() => {
    const controller = new AbortController();
    const targets = key.split("|").filter(Boolean);
    for (let i = 0; i < targets.length; i += 8) {
      const batch = targets.slice(i, i + 8);
      const query = new URLSearchParams(batch.map(u => ["u", u]));
      fetch(`/__pulse?${query}`, { signal: controller.signal })
        .then(async r => { if (!r.ok) throw new Error("Probe unavailable"); return r.json(); })
        .then(data => { if (!controller.signal.aborted) setStatuses(prev => ({ ...prev, ...Object.fromEntries(batch.map(u => [u, data.results?.[u] === "online" ? "online" : "probe"])) })); })
        .catch(() => { if (!controller.signal.aborted) setStatuses(prev => ({ ...prev, ...Object.fromEntries(batch.map(u => [u, "probe" as const])) })); });
    }
    return () => controller.abort();
  }, [key]);
  return statuses;
}
