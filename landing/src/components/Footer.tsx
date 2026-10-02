import { useAppState } from "../AppState";

export function Footer() {
  const { t, lang, isAr } = useAppState();
  return <footer className="site-footer">{t.footerText}<nav className="content-links" aria-label={isAr ? "روابط الموقع" : "Site links"}>{["about", "projects", "writing", "contact", "faq"].map((id, i) => <a key={id} href={`/${lang}/${id}`}>{(isAr ? ["عنّي", "المشاريع", "الكتابات", "تواصل", "أسئلة شائعة"] : ["About", "Projects", "Writing", "Contact", "FAQ"])[i]}</a>)}</nav></footer>;
}
