import { useEffect, useState } from "react";

// Build provenance: /release.json is written by release-manifest.mjs at build time. The page fetches
// the script and stylesheet it actually loaded, hashes them with WebCrypto and compares the hashes to
// the manifest. Both come from the same server, so this proves the page matches the published
// manifest — and the manifest names the commit anyone can rebuild to reproduce the hashes.

export interface ReleaseNote {
  date: string;
  en: string[];
  ar: string[];
}

export interface ReleaseManifest {
  repo: string;
  commit: string;
  short: string;
  branch: string;
  dirty: boolean;
  builtAt: string;
  notes: ReleaseNote[];
  files: Record<string, string>;
}

export interface FileCheck {
  path: string;
  ok: boolean;
}

export interface ReleaseState {
  status: "loading" | "verified" | "mismatch" | "unavailable";
  manifest?: ReleaseManifest;
  checks: FileCheck[];
}

async function sha256Hex(buf: ArrayBuffer) {
  const d = new Uint8Array(await crypto.subtle.digest("SHA-256", buf));
  return [...d].map((b) => b.toString(16).padStart(2, "0")).join("");
}

let cached: Promise<ReleaseState> | null = null;

async function check(): Promise<ReleaseState> {
  try {
    const r = await fetch("/release.json", { cache: "no-store" });
    if (!r.ok) return { status: "unavailable", checks: [] };
    const manifest = (await r.json()) as ReleaseManifest;
    const loaded = [
      ...[...document.querySelectorAll<HTMLScriptElement>('script[type="module"][src]')].map((s) => s.src),
      ...[...document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"][href^="/assets/"]')].map((l) => l.href)
    ];
    const checks: FileCheck[] = [];
    for (const url of loaded) {
      const path = new URL(url).pathname.replace(/^\//, "");
      const want = manifest.files[path];
      const got = await sha256Hex(await (await fetch(url)).arrayBuffer());
      checks.push({ path, ok: !!want && got === want });
    }
    const ok = checks.length > 0 && checks.every((c) => c.ok);
    return { status: ok ? "verified" : "mismatch", manifest, checks };
  } catch {
    return { status: "unavailable", checks: [] };
  }
}

export function useRelease(): ReleaseState {
  const [state, setState] = useState<ReleaseState>({ status: "loading", checks: [] });
  useEffect(() => {
    let alive = true;
    cached ??= check();
    cached.then((s) => alive && setState(s));
    return () => {
      alive = false;
    };
  }, []);
  return state;
}
