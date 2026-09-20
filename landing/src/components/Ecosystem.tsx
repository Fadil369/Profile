import { useAppState } from "../AppState";
import { useReveal } from "../hooks/useReveal";
import { useEcosystemPulse } from "../hooks/useEcosystemPulse";

function monogram(name: string) {
  return name.replace(/[^A-Za-z\u0600-\u06FF]/g, "")[0] || "•";
}

export function Ecosystem() {
  const { t } = useAppState();
  const { ref, visible } = useReveal<HTMLElement>();
  const urls = t.ecosystem.map((eco) => eco.url);
  const pulse = useEcosystemPulse(urls);

  return (
    <section
      id="ecosystem"
      data-scroll-anchor
      ref={ref}
      className={`section section--tint reveal ${visible ? "is-visible" : ""}`}
    >
      <div className="ecosystem-wrap">
        <div className="section-heading">
          <div className="kicker">{t.ecosystemKicker}</div>
          <h2>{t.ecosystemTitle}</h2>
          <p className="section-subtitle">{t.ecosystemSubtitle}</p>
        </div>
        <div className="ecosystem-grid">
          {t.ecosystem.map((eco) => {
            const state = pulse[eco.url] ?? "checking";
            return (
              <a
                key={eco.url}
                href={eco.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`glass-card ecosystem-card${eco.featured ? " ecosystem-card--featured" : ""}`}
              >
                <span className={`pulse-dot pulse-${state}`} aria-label={state} />
                <div className="ecosystem-mono">{eco.badge ?? monogram(eco.name)}</div>
                <div className="ecosystem-text">
                  <span className="ecosystem-name">{eco.name}</span>
                  <span className="ecosystem-url">{eco.urlLabel}</span>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}