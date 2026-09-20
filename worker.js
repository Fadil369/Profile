// Server-side reachability probe for the elfadil.com ecosystem section.
// Serves static assets normally; /__pulse?u=<url>&u=<url> returns {results: {url: "online"|"probe"}}.
const PROBE_TIMEOUT_MS = 5000;
const CACHE_TTL_SECONDS = 60;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/__pulse") {
      return handlePulse(url);
    }

    return env.ASSETS.fetch(request);
  },
};

async function handlePulse(url) {
  const targets = url.searchParams.getAll("u").filter(Boolean);

  const cacheKey = new Request(url.href, { method: "GET" });
  const cached = await caches.default.match(cacheKey);
  if (cached) return cached;

  const results = {};
  await Promise.allSettled(
    targets.map(async (t) => {
      try {
        const res = await fetch(t, {
          redirect: "follow",
          signal: AbortSignal.timeout(PROBE_TIMEOUT_MS),
        });
        results[t] = res.status > 0 ? "online" : "probe";
      } catch {
        results[t] = "probe";
      }
    })
  );

  const response = new Response(JSON.stringify({ results }), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "access-control-allow-origin": "*",
      "cache-control": `public, max-age=${CACHE_TTL_SECONDS}`,
    },
  });

  await caches.default.put(cacheKey, response.clone());
  return response;
}