import { useAppState } from "../AppState";
import { useReveal } from "../hooks/useReveal";
import { ArrowRightIcon } from "../Icons";

export function Work() {
  const { t } = useAppState();
  const { ref, visible } = useReveal<HTMLElement>();

  return (
    <section id="work" data-scroll-anchor ref={ref} className={`section reveal ${visible ? "is-visible" : ""}`}>
      <div className="work">
        <div className="section-heading">
          <div className="kicker">{t.workKicker}</div>
          <h2>{t.workTitle}</h2>
        </div>
        <div className="work-grid">
          {t.projects.map((p, i) => (
            <a
              key={p.name}
              className="glass-card work-card"
              href={p.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{ "--i": i } as React.CSSProperties}
            >
              <div className="work-meta">
                <span className={`project-status project-status--${p.status.toLowerCase()}`}>{t.statuses[p.status]}</span>
                {p.year && <span dir="ltr">{p.year}</span>}
              </div>
              <h3>{p.name}</h3>
              <p>{p.desc}</p>
              <div className="work-tech">
                {p.tech.map((x) => (
                  <span key={x}>{x}</span>
                ))}
              </div>
              <ArrowRightIcon size={16} />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
