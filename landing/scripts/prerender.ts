import { build } from "esbuild";
import { mkdtemp, readFile, mkdir, writeFile, rm } from "node:fs/promises";
import { resolve, join, dirname } from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { APP_TITLES, ARTICLES, PROFILE, PROJECTS, type Lang, type AppId } from "../src/workspace/content";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const origin = "https://elfadil.com";
for (const legacy of ["assets/index-C0OSmpvm.js", "assets/index-DBpWhUmV.css"]) {
  await rm(join(dist, legacy), { force: true });
}
const template = await readFile(join(dist, "index.html"), "utf8");
if (!template.includes("<!--app-html-->") || !template.includes("<!--page-head-->")) {
  throw new Error("The built index must include the app-html and page-head placeholders.");
}

type Page = {
  path: string;
  lang: Lang;
  title: string;
  description: string;
  counterpart?: string;
  article?: (typeof ARTICLES)[number];
  notFound?: boolean;
  output?: string;
};

const descriptions: Record<AppId, { ar: string; en: string }> = {
  about: { ar: "تعرّف إلى د. فاضل، ومسيرته بين الطب وريادة الأعمال والتقنية، والمبادئ التي توجّه عمله.", en: "Meet Dr. Fadil and explore the clinical experience and principles behind his work in technology and entrepreneurship." },
  projects: { ar: "مشاريع د. فاضل في الرعاية الصحية والذكاء الاصطناعي والهوية الرقمية والتعليم والكتابة.", en: "Explore Dr. Fadil's work in healthcare, AI, digital identity, education, and writing." },
  brainsait: { ar: "كيف ترتبط خبرة د. فاضل السريرية بمهمة برين سايت في ربط الأنظمة وتسهيل العمل.", en: "How Dr. Fadil's clinical experience connects to BrainSAIT's mission of integrated systems and practical automation." },
  writing: { ar: "كتابات وأفكار د. فاضل حول الرعاية الصحية والتقنية والأنظمة وريادة الأعمال.", en: "Writing and ideas from Dr. Fadil on healthcare, technology, systems, and entrepreneurship." },
  contact: { ar: "تواصل مع د. فاضل بشأن الاستشارات وورش العمل والتحدث والشراكات وبناء المنتجات.", en: "Connect with Dr. Fadil about advisory work, workshops, speaking, partnerships, and product collaboration." },
  faq: { ar: "إجابات مستندة إلى المحتوى العام عن عمل د. فاضل ومشاريعه وسبل التعاون معه.", en: "Find answers about Dr. Fadil's work, projects, and collaboration opportunities from public website content." },
  terminal: { ar: "استكشف المحتوى العام ومشاريع د. فاضل من خلال واجهة أوامر بسيطة.", en: "Explore Dr. Fadil's public work and projects through a small, optional command interface." },
};

const pages: Page[] = [{
  path: "/", lang: "ar", title: "د. فاضل | رؤية طبيب. وعقلية صانع.",
  description: PROFILE.bio[0].ar, counterpart: "/en",
}];

for (const lang of ["ar", "en"] as const) {
  const other = lang === "ar" ? "en" : "ar";
  const name = lang === "ar" ? "د. فاضل" : "Dr. Fadil";
  pages.push({ path: `/${lang}`, lang, title: `${name} | ${PROFILE.tagline[lang]}`, description: PROFILE.bio[0][lang], counterpart: `/${other}` });
  for (const app of Object.keys(APP_TITLES) as AppId[]) {
    pages.push({ path: `/${lang}/${app}`, lang, title: `${APP_TITLES[app][lang]} | ${name}`, description: descriptions[app][lang], counterpart: `/${other}/${app}` });
  }
  for (const project of PROJECTS) {
    pages.push({ path: `/${lang}/projects/${project.slug}`, lang, title: `${project.name[lang]} | ${name}`, description: project.summary[lang], counterpart: `/${other}/projects/${project.slug}` });
  }
  for (const article of ARTICLES) {
    pages.push({ path: `/${lang}/writing/${article.slug}`, lang, title: `${article.title[lang]} | ${name}`, description: article.description[lang], counterpart: `/${other}/writing/${article.slug}`, article });
  }
  pages.push({ path: `/${lang}/404`, lang, title: lang === "ar" ? "الصفحة غير موجودة | د. فاضل" : "Page not found | Dr. Fadil", description: descriptions.about[lang], notFound: true, output: `${lang}/404.html` });
}

pages.push({ path: "/echo-danah", lang: "ar", title: "Echo Danah | د. فاضل", description: "صفحة مشروع Echo Danah ضمن مساحة د. فاضل. Echo Danah project information in Dr. Fadil's workspace." });
pages.push({ path: "/404", lang: "ar", title: "الصفحة غير موجودة | د. فاضل", description: descriptions.about.ar, notFound: true, output: "404.html" });

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]!);
}

function head(page: Page): string {
  const canonicalPath = page.path === "/" ? "/ar" : page.path;
  const canonical = `${origin}${canonicalPath}`;
  const alternate = page.counterpart ? `${origin}${page.counterpart}` : undefined;
  const arUrl = page.lang === "ar" ? canonical : alternate;
  const enUrl = page.lang === "en" ? canonical : alternate;
  const graph: Record<string, unknown>[] = [
    {
      "@type": "Person", "@id": `${origin}/#person`,
      name: "Dr. Mohamed El Fadil Abuagla", alternateName: "Dr. Fadil",
      url: origin, image: `${origin}/assets/img/prof_pic.jpg`,
      description: PROFILE.bio[0][page.lang],
      jobTitle: "Physician, technology entrepreneur, writer, and founder",
      worksFor: { "@id": `${origin}/#organization` },
      workLocation: { "@type": "Place", name: "Riyadh, Saudi Arabia" },
    },
    {
      "@type": "Organization", "@id": `${origin}/#organization`,
      name: "BrainSAIT Ltd", url: "https://brainsait.org/",
      founder: { "@id": `${origin}/#person` },
    },
    {
      "@type": "WebSite", "@id": `${origin}/#website`,
      name: "Dr. Fadil", url: origin, inLanguage: ["ar", "en"],
      author: { "@id": `${origin}/#person` },
    },
  ];
  if (page.article) {
    graph.push({
      "@type": "Article", headline: page.article.title[page.lang],
      description: page.description, inLanguage: page.lang, url: canonical,
      mainEntityOfPage: canonical, author: { "@id": `${origin}/#person` },
      wordCount: page.article.paragraphs.map((paragraph) => paragraph[page.lang]).join(" ").trim().split(/\s+/u).length,
    });
  }

  return [
    `<title>${escapeHtml(page.title)}</title>`,
    `<meta name="description" content="${escapeHtml(page.description)}" />`,
    page.notFound ? '<meta name="robots" content="noindex, nofollow" />' : `<link rel="canonical" href="${canonical}" />`,
    !page.notFound && arUrl ? `<link rel="alternate" hreflang="ar" href="${arUrl}" />` : "",
    !page.notFound && enUrl ? `<link rel="alternate" hreflang="en" href="${enUrl}" />` : "",
    !page.notFound && arUrl ? `<link rel="alternate" hreflang="x-default" href="${arUrl}" />` : "",
    `<meta property="og:title" content="${escapeHtml(page.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(page.description)}" />`,
    `<meta property="og:type" content="${page.article ? "article" : "website"}" />`,
    `<meta property="og:url" content="${canonical}" />`,
    '<meta property="og:site_name" content="Dr. Fadil" />',
    `<meta property="og:locale" content="${page.lang === "ar" ? "ar_SA" : "en_US"}" />`,
    `<meta property="og:locale:alternate" content="${page.lang === "ar" ? "en_US" : "ar_SA"}" />`,
    `<meta property="og:image" content="${origin}/assets/img/prof_pic.jpg" />`,
    '<meta property="og:image:alt" content="Dr. Mohamed El Fadil Abuagla" />',
    '<meta name="twitter:card" content="summary" />',
    `<meta name="twitter:title" content="${escapeHtml(page.title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(page.description)}" />`,
    `<meta name="twitter:image" content="${origin}/assets/img/prof_pic.jpg" />`,
    `<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c")}</script>`,
  ].filter(Boolean).join("\n    ");
}

const temporary = await mkdtemp(join(root, ".prerender-"));
try {
  const bundlePath = join(temporary, "app.mjs");
  await build({
    entryPoints: [join(root, "src/App.tsx")], outfile: bundlePath,
    bundle: true, platform: "node", format: "esm", packages: "external",
    loader: { ".css": "empty" }, jsx: "automatic", logLevel: "warning",
  });
  const { default: App } = await import(pathToFileURL(bundlePath).href);
  for (const page of pages) {
    const markup = renderToString(createElement(App, { initialPath: page.path }));
    const html = template
      .replace('<html lang="ar" dir="rtl"', `<html lang="${page.lang}" dir="${page.lang === "ar" ? "rtl" : "ltr"}"`)
      .replace("<!--page-head-->", head(page))
      .replace("<!--app-html-->", markup);
    const target = join(dist, page.output ?? (page.path === "/" ? "index.html" : `${page.path.slice(1)}/index.html`));
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, html);
  }
} finally {
  await rm(temporary, { recursive: true, force: true });
}

const indexable = pages.filter((page) => !page.notFound && page.path !== "/");
const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
  ...indexable.map((page) => {
    const alternates = page.counterpart
      ? [page, { path: page.counterpart, lang: page.lang === "ar" ? "en" : "ar" }].map((alternate) => `<xhtml:link rel="alternate" hreflang="${alternate.lang}" href="${origin}${alternate.path}" />`).join("")
      : "";
    return `<url><loc>${origin}${page.path}</loc>${alternates}</url>`;
  }),
  `<url><loc>${origin}/the_leverage_point</loc></url>`,
  '</urlset>',
].join("\n");
await writeFile(join(dist, "sitemap.xml"), sitemap);
await writeFile(join(dist, "robots.txt"), `User-agent: *\nAllow: /\nDisallow: /__pulse\n\nSitemap: ${origin}/sitemap.xml\n`);
console.log(`Prerendered ${pages.length} pages; sitemap includes ${indexable.length + 1} canonical URLs.`);
