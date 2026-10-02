import { useAppState } from "./AppState";
import { APP_TITLES, ARTICLES, PROJECTS, PROFILE, FAQ, CONTACT_EMAIL, type AppId } from "./workspace/content";
import { BOOKING_URL } from "./booking";
import { Footer } from "./components/Footer";

/** Semantic, shareable pages reuse the same content as the optional workspace. */
export function ContentPage({ path }: { path: string }) {
  const { lang, isAr, toggleTheme, toggleLang } = useAppState();
  const [, locale, section, slug, ...extra] = path.split("/");
  const localized = locale === "ar" || locale === "en";
  const project = section === "projects" ? PROJECTS.find(p => p.slug === slug) : undefined;
  const article = section === "writing" ? ARTICLES.find(p => p.slug === slug) : undefined;
  const echo = path === "/echo-danah";
  const valid = echo || (localized && extra.length === 0 && (slug ? !!(project || article) : Object.prototype.hasOwnProperty.call(APP_TITLES, section)));
  const title = !valid ? (isAr ? "الصفحة غير موجودة" : "Page not found") : echo ? "Echo Danah" : project?.name[lang] || article?.title[lang] || APP_TITLES[section as AppId][lang];
  return <>
    <header className="content-nav">
      <a href={`/${lang}`}>{PROFILE.name[lang]}</a>
      <div><button className="btn btn-ghost" onClick={toggleLang}>{isAr ? "English" : "العربية"}</button><button className="btn btn-ghost" onClick={toggleTheme}>{isAr ? "تغيير المظهر" : "Change appearance"}</button></div>
    </header>
    <main id="main-content" tabIndex={-1} className="content-page">
      <nav className="content-links" aria-label={isAr ? "استكشف" : "Explore"}>{Object.entries(APP_TITLES).map(([id, name]) => <a key={id} href={`/${lang}/${id}`} aria-current={section === id ? "page" : undefined}>{name[lang]}</a>)}</nav>
      <h1>{title}</h1>
      {!valid && <><p>{isAr ? "تعذر العثور على هذه الصفحة. يمكنك العودة للرئيسية أو استكشاف المشاريع." : "We couldn't find this page. Return home or explore the projects."}</p><a className="btn btn-primary" href={`/${lang}`}>{isAr ? "الصفحة الرئيسية" : "Return home"}</a></>}
      {echo && <p>{isAr ? "Echo Danah مشروع إبداعي قيد الاستكشاف. تواصل معي لمعرفة المزيد." : "Echo Danah is a creative project under exploration. Get in touch to learn more."} <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></p>}
      {valid && !echo && <>
        {project ? <article><p className="content-lead">{project.summary[lang]}</p>{([['problem', 'المشكلة', 'The problem'], ['audience', 'لمن', 'Who it serves'], ['contribution', 'مساهمتي', 'My contribution'], ['approach', 'النهج', 'The approach'], ['status', 'الحالة', 'Status']] as const).map(([key, ar, en]) => <section key={key}><h2>{isAr ? ar : en}</h2><p>{project[key][lang]}</p></section>)}{project.url && <a className="btn btn-primary" href={project.url} target="_blank" rel="noopener noreferrer">{project.action[lang]}</a>}</article>
        : article ? <article><p className="content-lead">{article.description[lang]}</p><p className="content-source">{article.sourceLabel[lang]}</p>{article.paragraphs.map((p, i) => <p key={i}>{p[lang]}</p>)}{article.sourceUrl && <a className="btn btn-secondary" href={article.sourceUrl}>{isAr ? "اقرأ المصدر" : "Read the source"}</a>}</article>
        : section === "projects" ? <div className="content-grid">{PROJECTS.map(p => <article className="glass-card" key={p.slug}><h2><a href={`/${lang}/projects/${p.slug}`}>{p.name[lang]}</a></h2><p>{p.summary[lang]}</p><p>{p.status[lang]}</p></article>)}</div>
        : section === "writing" ? <div className="content-grid">{ARTICLES.map(a => <article className="glass-card" key={a.slug}><h2><a href={`/${lang}/writing/${a.slug}`}>{a.title[lang]}</a></h2><p>{a.description[lang]}</p></article>)}</div>
        : section === "faq" ? FAQ.map((f, i) => <section key={i}><h2>{f.question[lang]}</h2><p>{f.answer[lang]}</p></section>)
        : section === "contact" ? <><p>{isAr ? "للاستشارات وورش العمل والتحدث والشراكات، أرسل لي موضوعك عبر البريد." : "For advisory work, workshops, speaking, and partnerships, email me about your project."}</p><a className="btn btn-primary" href={BOOKING_URL} target="_blank" rel="noopener noreferrer">{isAr ? "احجز موعدًا" : "Book a meeting"}</a> <a className="btn btn-secondary" href={`mailto:${CONTACT_EMAIL}`}>{isAr ? "افتح مسودة بريد" : "Open email draft"}</a><p>{CONTACT_EMAIL}</p></>
        : section === "terminal" ? <><p>{isAr ? "استكشف الطرفية من مساحة العمل التفاعلية في الصفحة الرئيسية." : "Explore the terminal in the interactive workspace on the homepage."}</p><a className="btn btn-primary" href={`/${lang}`}>{isAr ? "العودة لمساحة العمل" : "Explore the workspace"}</a></>
        : <>{PROFILE.bio.map((p,i) => <p key={i}>{p[lang]}</p>)}{section === "brainsait" ? <a className="btn btn-primary" href="https://brainsait.org/">{isAr ? "استكشف برين سايت" : "Explore BrainSAIT"}</a> : PROFILE.principles.map((p,i) => <section key={i}><h2>{p.title[lang]}</h2><p>{p.body[lang]}</p></section>)}</>}
      </>}
    </main><Footer />
  </>;
}
