const PROBE_TIMEOUT_MS = 4000;
const CACHE_TTL_SECONDS = 60;
const MAX_PROBE_TARGETS = 8;
const PROBE_TARGETS = new Set([
  "https://brainsait.org/",
  "https://registry.brainsait.org/",
  "https://registry.brainsait.org/health",
  "https://hub.brainsait.org/",
  "https://learn.brainsait.de/",
  "https://store.brainsait.de/",
  "https://fadil369.github.io/",
  "https://github.com/Fadil369",
  "https://brainsait369.blogspot.com/",
  "https://spark.brainsait.org/",
  "https://brainsait.org/incubator",
  "https://hivi.brainsait.org/",
  "https://market.brainsait.de/",
  "https://dr.elfadil.com/",
  "https://son.elfadil.com/",
  "https://sa.linkedin.com/in/fadil369",
]);

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const isPreview = !["elfadil.com", "www.elfadil.com"].includes(url.hostname);
    let response;

    if (url.hostname === "www.elfadil.com") {
      url.hostname = "elfadil.com";
      url.protocol = "https:";
      response = Response.redirect(url.href, 308);
    } else if (!["GET", "HEAD"].includes(request.method)) {
      response = new Response("Method not allowed", {
        status: 405,
        headers: { Allow: "GET, HEAD" },
      });
    } else if (url.pathname === "/__pulse") {
      response = await handlePulse(url, ctx);
    } else if (isPreview && url.pathname === "/robots.txt") {
      response = new Response("User-agent: *\nDisallow: /\n", {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    } else {
      response = await handleAsset(request, url, env);
    }

    const headers = new Headers(response.headers);
    headers.set("X-Content-Type-Options", "nosniff");
    headers.set("X-Frame-Options", "DENY");
    headers.set("Content-Security-Policy", "frame-ancestors 'none'; object-src 'none'; base-uri 'self'");
    headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
    if (isPreview || response.status === 404) headers.set("X-Robots-Tag", "noindex, nofollow");
    return new Response(request.method === "HEAD" ? null : response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  },
};

async function handleAsset(request, url, env) {
  // Normalize document URLs before mapping them to prerendered HTML assets.
  const path = url.pathname;
  let canonicalPath = path;
  if (path.endsWith("/index.html")) canonicalPath = path.slice(0, -11) || "/";
  else if (path === "/the_leverage_point.html") canonicalPath = "/the_leverage_point";
  else if (path !== "/" && path.endsWith("/")) canonicalPath = path.replace(/\/+$/, "");

  if (canonicalPath !== path) {
    const destination = new URL(url);
    destination.pathname = canonicalPath;
    return Response.redirect(destination.href, 308);
  }

  const assetUrl = new URL(url);
  if (path === "/") assetUrl.pathname = "/index.html";
  else if (path === "/the_leverage_point") assetUrl.pathname = "/the_leverage_point.html";
  else if (!path.split("/").at(-1).includes(".")) assetUrl.pathname = `${path}/index.html`;

  const response = await env.ASSETS.fetch(new Request(assetUrl, request));
  if (response.status !== 404) return response;

  const notFoundUrl = new URL(url);
  notFoundUrl.pathname = path.startsWith("/en/") || path === "/en" ? "/en/404.html" : "/404.html";
  const notFound = await env.ASSETS.fetch(new Request(notFoundUrl, request));
  return new Response(notFound.body, {
    status: 404,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

async function handlePulse(url, ctx) {
  const input = url.searchParams.getAll("u");
  if (input.length > MAX_PROBE_TARGETS) return Response.json({ error: "Too many targets" }, { status: 400 });
  const targets = [];
  for (const target of input) {
    let normalized;
    try {
      normalized = new URL(target).href;
    } catch {
      return Response.json({ error: "Invalid target" }, { status: 400 });
    }
    if (!PROBE_TARGETS.has(normalized)) return Response.json({ error: "Unsupported target" }, { status: 400 });
    if (!targets.some(([original]) => original === target)) targets.push([target, normalized]);
  }

  if (!targets.length) return Response.json({ results: {} });
  const cacheUrl = new URL("https://elfadil.com/__pulse");
  targets.sort(([a], [b]) => a.localeCompare(b));
  for (const [original] of targets) cacheUrl.searchParams.append("u", original);
  const cacheKey = new Request(cacheUrl, { method: "GET" });
  const cached = await caches.default.match(cacheKey);
  if (cached) return cached;

  const results = {};
  await Promise.allSettled(
    targets.map(async ([original, target]) => {
      try {
        // Do not follow redirects to destinations outside the reviewed allowlist.
        const response = await fetch(target, {
          redirect: "manual",
          signal: AbortSignal.timeout(PROBE_TIMEOUT_MS),
        });
        results[original] = response.ok ? "online" : "probe";
        await response.body?.cancel();
      } catch {
        results[original] = "probe";
      }
    }),
  );

  const response = Response.json({ results }, {
    headers: { "Cache-Control": `public, max-age=${CACHE_TTL_SECONDS}` },
  });
  ctx.waitUntil(caches.default.put(cacheKey, response.clone()));
  return response;
}
