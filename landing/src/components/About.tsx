import { useAppState } from "../AppState";
import { useReveal } from "../hooks/useReveal";

export function About() {
  const { t } = useAppState();
  const { ref, visible } = useReveal<HTMLElement>();

  return (
    <section
      id="about"
      data-scroll-anchor
      ref={ref}
      className={`section reveal ${visible ? "is-visible" : ""}`}
    >
      <div className="about-grid">
        <div className="about-copy">
          <div className="kicker">{t.aboutKicker}</div>
          <p className="about-p1">{t.aboutP1}</p>
          <p className="about-p2">{t.aboutP2}</p>
        </div>
        <div className="stats-col">
          {t.stats.map((stat) => (
            <div key={stat.label} className="glass-card stat-card">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
