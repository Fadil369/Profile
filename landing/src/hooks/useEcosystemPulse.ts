import { useEffect, useState } from "react";

export type PulseState = "checking" | "online" | "probe";

const TIMEOUT = 4500;

/** Best-effort reachability check per ecosystem URL. Falls back gracefully. */
export function useEcosystemPulse(urls: string[]) {
  const [statuses, setStatuses] = useState<Record<string, PulseState>>(() =>
    Object.fromEntries(urls.map((u) => [u, "checking"]))
  );

  useEffect(() => {
    const controllers: AbortController[] = [];

    for (const url of urls) {
      const controller = new AbortController();
      controllers.push(controller);

      const timer = setTimeout(() => controller.abort(), TIMEOUT);

      fetch(url, {
        method: "GET",
        mode: "no-cors",
        signal: controller.signal,
        cache: "no-store",
      })
        .then(() => {
          setStatuses((prev) => ({ ...prev, [url]: "online" }));
        })
        .catch(() => {
          setStatuses((prev) => ({ ...prev, [url]: "probe" }));
        })
        .finally(() => clearTimeout(timer));
    }

    return () => {
      for (const c of controllers) c.abort();
    };
  }, [urls]);

  return statuses;
}