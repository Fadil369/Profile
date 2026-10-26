import { useAppState } from "../../../AppState";

export function AboutApp() {
  const { t } = useAppState();

  return (
    <div className="workspace-app workspace-app--about">
      <p className="workspace-app-lead">
        <strong>{t.heroName}</strong> — {t.heroKicker}
      </p>
      {t.founderBio.map((p) => (
        <p key={p} className="workspace-app-para">
          {p}
        </p>
      ))}
      <ol className="timeline timeline--compact">
        {t.timeline.map((e) => (
          <li key={e.year + e.title}>
            <span className="timeline-year" dir="ltr">
              {e.year}
            </span>
            <div>
              <h3>{e.title}</h3>
              <div className="timeline-org">{e.org}</div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
