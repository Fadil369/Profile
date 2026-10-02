import { useAppState } from "../AppState";
import { PROFILE } from "../workspace/content";

export function Impact() {
  const { lang, isAr } = useAppState();
  return <section id="impact" data-scroll-anchor className="section section--tint">
    <div className="impact-wrap"><div className="section-heading"><div className="kicker">{isAr ? "ما يوجّه عملي" : "What guides my work"}</div><h2>{isAr ? "مبادئ تتحوّل إلى عمل" : "Principles put into practice"}</h2></div>
      <div className="impact-grid">{PROFILE.principles.map(p => <article className="glass-card impact-card" key={p.title.en}><h3>{p.title[lang]}</h3><p className="impact-label">{p.body[lang]}</p></article>)}</div>
    </div>
  </section>;
}
