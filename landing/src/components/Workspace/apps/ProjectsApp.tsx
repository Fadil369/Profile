import { useAppState } from "../../../AppState";

export function ProjectsApp() {
  const { t } = useAppState();

  return (
    <div className="workspace-app workspace-app--projects">
      {t.projects.map((proj) => (
        <a
          key={proj.name}
          href={proj.link}
          target="_blank"
          rel="noopener noreferrer"
          className="workspace-project-card"
        >
          <div className="workspace-project-top">
            <span className={`project-status project-status--${String(proj.status).toLowerCase()}`}>
              {t.statuses[proj.status]}
            </span>
            <span className="project-year">{proj.year}</span>
          </div>
          <h3>{proj.name}</h3>
          <p>{proj.desc}</p>
          <div className="workspace-project-tech">
            {proj.tech.map((tech) => (
              <span key={tech}>{tech}</span>
            ))}
          </div>
        </a>
      ))}
    </div>
  );
}
