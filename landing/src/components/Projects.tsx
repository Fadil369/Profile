import { useAppState } from "../AppState";
import { useReveal } from "../hooks/useReveal";

export function Projects() {
  const { t } = useAppState();
  const { ref, visible } = useReveal<HTMLElement>();

  return (
    <section
      id="projects"
      data-scroll-anchor
      ref={ref}
      className={`section reveal ${visible ? "is-visible" : ""}`}
    >
      <div className="projects-wrap">
        <div className="section-heading">
          <div className="kicker">{t.projectsKicker}</div>
          <h2>{t.projectsTitle}</h2>
        </div>
        <div className="projects-grid">
          {t.projects.map((proj) => (
            <a
              key={proj.name}
              href={proj.link}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card project-card"
            >
              <div className="project-top">
                <span className="project-status">{t.statuses[proj.status]}</span>
                <span className="project-year">{proj.year}</span>
              </div>
              <h3>{proj.name}</h3>
              <p className="project-desc">{proj.desc}</p>
              <div className="project-tech">
                {proj.tech.map((tech) => (
                  <span key={tech}>{tech}</span>
                ))}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
