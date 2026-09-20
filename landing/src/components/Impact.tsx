import { useAppState } from "../AppState";
import { useReveal } from "../hooks/useReveal";

export function Impact() {
  const { t } = useAppState();
  const { ref, visible } = useReveal<HTMLElement>();

  return (
    <section
      id="impact"
      data-scroll-anchor
      ref={ref}
      className={`section reveal ${visible ? "is-visible" : ""}`}
    >
      <div className="impact-wrap">
        <div className="section-heading">
          <div className="kicker">{t.impactKicker}</div>
          <h2>{t.impactTitle}</h2>
        </div>
        <div className="impact-grid">
          {t.impactStats.map((stat) => (
            <div key={stat.label} className="impact-card glass-card">
              <div className="impact-value">{stat.value}</div>
              <div className="impact-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}