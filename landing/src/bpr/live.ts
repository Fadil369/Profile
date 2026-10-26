import { useSyncExternalStore } from "react";

// Live BPR data for the landing. Everything here is public registry data:
//   - credential, DID document, transparency log/head and status come straight from
//     registry.brainsait.de (those endpoints send Access-Control-Allow-Origin: *);
//   - provider count, research footprint and FHIR metadata go through /bpr.php, a
//     same-origin, read-only, whitelisted proxy (those endpoints have no CORS).
// Signatures are checked on the visitor's device with WebCrypto Ed25519, exactly the
// way registry.brainsait.de/verify does it; the registry's /vc/verify is only a fallback
// for browsers without Ed25519.

export const REGISTRY = "https://registry.brainsait.de";
export const SPID = "SA-PHY-000003";
const PROXY = "/bpr.php";

export type CheckState = "pending" | "ok" | "fail" | "unavailable";
export interface Check {
  state: CheckState;
  detail?: string;
  how?: "device" | "server";
}

export interface Jwk {
  kty: string;
  crv: string;
  x: string;
  kid?: string;
}

export interface CredentialClaims {
  id: string;
  validFrom: string;
  validUntil: string;
  issuer: { id: string; name: string };
  credentialSubject: {
    id: string;
    spid: string;
    name: string;
    nameAr?: string;
    profession: string;
    specialty?: string;
    orcid?: string;
    verificationLevel?: string;
    membership?: { state: string; validTo?: string };
    qualifications?: { kind: string; issuer?: string; state: string }[];
    fhir?: string;
  };
}

export interface LogEntry {
  seq: number;
  at: string;
  event: string;
  spid: string;
  hash: string;
  prev: string;
}

export interface ResearchWork {
  title: string;
  kind: string;
  year: string;
  url: string;
  doi?: string;
}

export interface BprLive {
  started: boolean;
  jwt?: string;
  header?: { alg: string; kid: string; typ?: string };
  claims?: CredentialClaims;
  jwks: Jwk[];
  signature: Check;
  status: Check & { value?: string };
  head?: { size: number; hash: string; at: string };
  headSignature: Check;
  chain: Check & { entries: LogEntry[]; genesis?: string };
  providers?: number;
  research?: {
    counts: { orcid: number; zenodo: number; hf: number; in_community: number; dois: number };
    metrics: { zenodo_views: number; zenodo_downloads: number; hf_downloads: number };
    works: ResearchWork[];
    communityUrl?: string;
  };
  fhir?: { version: string; resources: { type: string; interactions: string[] }[] };
  github?: { publicRepos: number };
}

const initial: BprLive = {
  started: false,
  jwks: [],
  signature: { state: "pending" },
  status: { state: "pending" },
  headSignature: { state: "pending" },
  chain: { state: "pending", entries: [] }
};

let state: BprLive = initial;
const listeners = new Set<() => void>();
function set(patch: Partial<BprLive>) {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
}

const enc = new TextEncoder();
const dec = new TextDecoder();

export function b64u(s: string): Uint8Array {
  const b = atob(s.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - (s.length % 4)) % 4));
  return Uint8Array.from(b, (c) => c.charCodeAt(0));
}
function toB64u(bytes: Uint8Array): string {
  let s = "";
  bytes.forEach((b) => (s += String.fromCharCode(b)));
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function getJson<T>(url: string): Promise<T> {
  const r = await fetch(url, { cache: "no-store" });
  if (!r.ok) throw new Error(`${r.status} ${url}`);
  return r.json() as Promise<T>;
}

async function edVerify(jwk: Jwk, sig: Uint8Array, data: Uint8Array): Promise<boolean> {
  const key = await crypto.subtle.importKey("jwk", { kty: jwk.kty, crv: jwk.crv, x: jwk.x }, { name: "Ed25519" }, false, [
    "verify"
  ]);
  return crypto.subtle.verify({ name: "Ed25519" }, key, sig as BufferSource, data as BufferSource);
}

async function sha256Hex(s: string): Promise<string> {
  const d = new Uint8Array(await crypto.subtle.digest("SHA-256", enc.encode(s)));
  return [...d].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** Verifies a VC-JOSE credential against the registry keys. Falls back to the registry server
 * only when this browser has no Ed25519 in WebCrypto. */
export async function verifyJwt(jwt: string, jwks: Jwk[]): Promise<Check> {
  const parts = jwt.trim().split(".");
  if (parts.length !== 3) return { state: "fail", detail: "not a JWS" };
  let header: { alg: string; kid: string };
  try {
    header = JSON.parse(dec.decode(b64u(parts[0])));
  } catch {
    return { state: "fail", detail: "unreadable header" };
  }
  const jwk = jwks.find((k) => k.kid === header.kid);
  if (!jwk) return { state: "fail", detail: `unknown key ${header.kid}` };
  try {
    const ok = header.alg === "EdDSA" && (await edVerify(jwk, b64u(parts[2]), enc.encode(parts[0] + "." + parts[1])));
    return ok ? { state: "ok", how: "device" } : { state: "fail", detail: "signature does not match", how: "device" };
  } catch {
    try {
      const r = await (await fetch(`${REGISTRY}/vc/verify`, { method: "POST", body: jwt })).json();
      return r.ok
        ? { state: "ok", how: "server" }
        : { state: "fail", detail: (r.reasons || []).join("; ") || "rejected", how: "server" };
    } catch {
      return { state: "unavailable", detail: "no Ed25519 in this browser and the registry is unreachable" };
    }
  }
}

/** Returns the same credential with one claim changed but the original signature kept —
 * what a forger would hand over. */
export function forgeName(jwt: string, name: string): string {
  const [h, p, s] = jwt.split(".");
  const claims = JSON.parse(dec.decode(b64u(p)));
  claims.credentialSubject.name = name;
  return [h, toB64u(enc.encode(JSON.stringify(claims))), s].join(".");
}

export function decodeClaims(jwt: string): CredentialClaims {
  return JSON.parse(dec.decode(b64u(jwt.split(".")[1])));
}

async function loadCredential() {
  const did = await getJson<{ verificationMethod: { publicKeyJwk: Jwk }[] }>(`${REGISTRY}/.well-known/did.json`);
  const jwks = did.verificationMethod.map((m) => m.publicKeyJwk);
  set({ jwks });
  const vc = await getJson<{ jwt: string }>(`${REGISTRY}/vc/${SPID}`);
  const header = JSON.parse(dec.decode(b64u(vc.jwt.split(".")[0])));
  const claims = decodeClaims(vc.jwt);
  set({ jwt: vc.jwt, header, claims });
  const sig = await verifyJwt(vc.jwt, jwks);
  if (sig.state === "ok" && Date.parse(claims.validUntil) < Date.now())
    set({ signature: { state: "fail", detail: `expired ${claims.validUntil}` } });
  else set({ signature: sig });
  try {
    const st = await getJson<{ credential?: { state: string } }>(
      `${REGISTRY}/vc/status/${SPID}?jti=${encodeURIComponent(claims.id)}`
    );
    const value = st.credential?.state || "unknown";
    set({ status: { state: value === "current" ? "ok" : "fail", value } });
  } catch {
    set({ status: { state: "unavailable" } });
  }
  return jwks;
}

async function loadLedger(jwksP: Promise<Jwk[]>) {
  const log = await getJson<{
    head: { size: number; hash: string; at: string; signed: string; sig: string; kid: string };
    genesis: string;
    entries: { seq: number; line: string; hash: string }[];
  }>(`${REGISTRY}/transparency/log.json`);
  const entries: LogEntry[] = [];
  let prev = log.genesis;
  let bad = "";
  for (const [i, e] of log.entries.entries()) {
    const line = JSON.parse(e.line);
    const h = await sha256Hex(e.line);
    if (line.seq !== i + 1 || line.prev !== prev || h !== e.hash) {
      bad = `#${i + 1}`;
      break;
    }
    entries.push({ seq: line.seq, at: line.at, event: line.event, spid: line.spid, hash: h, prev });
    prev = h;
  }
  if (!bad && log.head.hash !== prev) bad = "head ≠ chain";
  set({
    head: { size: log.head.size, hash: log.head.hash, at: log.head.at },
    chain: bad ? { state: "fail", detail: bad, entries, genesis: log.genesis } : { state: "ok", entries, genesis: log.genesis }
  });
  const jwks = await jwksP;
  const jwk = jwks.find((k) => k.kid === log.head.kid);
  if (!jwk) return set({ headSignature: { state: "fail", detail: "unknown key" } });
  try {
    const ok = await edVerify(jwk, b64u(log.head.sig), enc.encode(log.head.signed));
    set({ headSignature: ok ? { state: "ok", how: "device" } : { state: "fail", detail: "signature does not match" } });
  } catch {
    set({ headSignature: { state: "unavailable", detail: "no Ed25519 in this browser" } });
  }
}

async function loadProxied() {
  const tasks: Promise<void>[] = [
    getJson<{ providers: number }>(`${PROXY}?r=api`).then((d) => set({ providers: d.providers })),
    // GitHub's API allows browser requests; 60/hour per visitor IP is plenty for one call.
    getJson<{ public_repos: number }>("https://api.github.com/users/Fadil369").then((d) => set({ github: { publicRepos: d.public_repos } })),
    getJson<{
      counts: { orcid: number; zenodo: number; hf: number; in_community: number; dois: number };
      metrics: { zenodo_views: number; zenodo_downloads: number; hf_downloads: number };
      works: ResearchWork[];
      community_url?: string;
    }>(`${PROXY}?r=research`).then((d) =>
      set({ research: { counts: d.counts, metrics: d.metrics, works: d.works, communityUrl: d.community_url } })
    ),
    getJson<{ fhirVersion: string; rest: { resource: { type: string; interaction?: { code: string }[] }[] }[] }>(
      `${PROXY}?r=fhir`
    ).then((d) =>
      set({
        fhir: {
          version: d.fhirVersion,
          resources: d.rest[0].resource.map((r) => ({ type: r.type, interactions: (r.interaction || []).map((i) => i.code) }))
        }
      })
    )
  ];
  await Promise.allSettled(tasks);
}

function fail(key: "signature" | "status" | "headSignature", detail: string) {
  if (state[key].state === "pending") set({ [key]: { state: "unavailable", detail } } as Partial<BprLive>);
}

/** Starts loading once per page; later calls are no-ops. */
export function startBprLive() {
  if (state.started) return;
  set({ started: true });
  const jwksP = loadCredential().catch((e) => {
    fail("signature", String(e.message || e));
    fail("status", "offline");
    return [] as Jwk[];
  });
  loadLedger(jwksP).catch((e) => {
    set({ chain: { state: "unavailable", detail: String(e.message || e), entries: [] } });
    fail("headSignature", "offline");
  });
  loadProxied();
}

export function useBprLive(): BprLive {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      startBprLive();
      return () => listeners.delete(l);
    },
    () => state,
    () => initial
  );
}

export const short = (h?: string, n = 10) => (h ? `${h.slice(0, n)}…${h.slice(-4)}` : "…");
