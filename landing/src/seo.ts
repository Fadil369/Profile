import type { Lang } from "./content";

// One address per language: English at /, Arabic at /ar/. Each is self-canonical and names the
// other via hreflang (static tags in index.html). The prerender step (scripts/prerender.mjs)
// snapshots both pages, so crawlers, link previews and no-JS readers get the real text.

export const SITE = "https://elfadil.brainsait.de";

export const PATHS: Record<Lang, string> = { en: "/", ar: "/ar/" };

export const META: Record<Lang, { title: string; description: string; locale: string; image: string; imageAlt: string }> = {
  en: {
    title: "Dr. Mohamed El Fadil — Physician, founder of BrainSAIT, builder of BPR",
    description:
      "Physician and founder of BrainSAIT. I build BPR — the BrainSAIT Provider Registry: a signed, verifiable identity for every clinician, with FHIR R4, research and clinical tools around it.",
    locale: "en_US",
    image: `${SITE}/og/og-en.png`,
    imageAlt: "Dr. Mohamed El Fadil — BPR: a verifiable identity for every clinician"
  },
  ar: {
    title: "د. محمد الفاضل — طبيب ومؤسس برينسايت وباني سجل BPR",
    description:
      "طبيب ومؤسس برينسايت. أبني BPR — سجل برينسايت لمقدمي الخدمة: هوية موقّعة قابلة للتحقق لكل ممارس صحي، مع FHIR R4 والأبحاث والأدوات السريرية من حولها.",
    locale: "ar_SA",
    image: `${SITE}/og/og-ar.png`,
    imageAlt: "د. محمد الفاضل — BPR: هوية قابلة للتحقق لكل ممارس صحي"
  }
};

export function langFromPath(pathname: string): Lang {
  return /^\/ar(\/|$)/.test(pathname) ? "ar" : "en";
}

function setMeta(selector: string, attr: string, value: string) {
  const el = document.head.querySelector<HTMLElement>(selector);
  if (el) el.setAttribute(attr, value);
}

/** Keeps <head> in step with the language (also what the prerender captures). */
export function applyHead(lang: Lang) {
  const m = META[lang];
  const url = SITE + PATHS[lang];
  document.title = m.title;
  setMeta('meta[name="description"]', "content", m.description);
  setMeta('link[rel="canonical"]', "href", url);
  setMeta('meta[property="og:title"]', "content", m.title);
  setMeta('meta[property="og:description"]', "content", m.description);
  setMeta('meta[property="og:url"]', "content", url);
  setMeta('meta[property="og:locale"]', "content", m.locale);
  setMeta('meta[property="og:locale:alternate"]', "content", lang === "ar" ? META.en.locale : META.ar.locale);
  setMeta('meta[property="og:image"]', "content", m.image);
  setMeta('meta[property="og:image:alt"]', "content", m.imageAlt);
  setMeta('meta[name="twitter:title"]', "content", m.title);
  setMeta('meta[name="twitter:description"]', "content", m.description);
  setMeta('meta[name="twitter:image"]', "content", m.image);
}
