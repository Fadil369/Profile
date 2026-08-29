import { useAppState } from "../AppState";
import { useReveal } from "../hooks/useReveal";

export function Experience() {
  const { t } = useAppState();
  const { ref, visible } = useReveal<HTMLElement>();

  return (
    <section
      id="experience"
      data-scroll-anchor
      ref={ref}
      className={`section section-narrow reveal ${visible ? "is-visible" : ""}`}
    >
      <div className="timeline-wrap">
        <div className="section-heading">
          <div className="kicker">{t.expKicker}</div>
          <h2>{t.expTitle}</h2>
        </div>
        <div className="timeline">
          {t.experience.map((exp) => (
            <div key={`${exp.year}-${exp.title}`} className="timeline-item">
              <div className="timeline-dot" />
              <div className="timeline-year">{exp.year}</div>
              <div className="glass-card timeline-card">
                <h3>{exp.title}</h3>
                <div className="timeline-org">{exp.org}</div>
                {exp.desc.map((line) => (
                  <div key={line} className="timeline-desc-line">
                    <span className="bullet">—</span>
                    <span>{line}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
