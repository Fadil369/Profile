import { useAppState } from "../AppState";
import { useReveal } from "../hooks/useReveal";

function monogram(name: string) {
  return name.replace(/[^A-Za-z؀-ۿ]/g, "")[0] || "•";
}

export function Ecosystem() {
  const { t } = useAppState();
  const { ref, visible } = useReveal<HTMLElement>();

  return (
    <section
      id="ecosystem"
      data-scroll-anchor
      ref={ref}
      className={`section reveal ${visible ? "is-visible" : ""}`}
    >
      <div className="ecosystem-wrap">
        <div className="section-heading">
          <div className="kicker">{t.ecosystemKicker}</div>
          <h2>{t.ecosystemTitle}</h2>
        </div>
        <div className="ecosystem-grid">
          {t.ecosystem.map((eco) => (
            <a
              key={eco.url}
              href={eco.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`glass-card ecosystem-card${eco.featured ? " ecosystem-card--featured" : ""}`}
            >
              <div className="ecosystem-mono">{eco.badge ?? monogram(eco.name)}</div>
              <div className="ecosystem-text">
                <span className="ecosystem-name">{eco.name}</span>
                <span className="ecosystem-url">{eco.urlLabel}</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
