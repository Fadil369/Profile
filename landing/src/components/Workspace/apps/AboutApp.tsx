import { useAppState } from "../../../AppState";
import { ShieldIcon } from "../../../Icons";

export function AboutApp() {
  const { t } = useAppState();

  return (
    <div className="workspace-app workspace-app--about">
      <div className="workspace-app-badge">
        <ShieldIcon size={20} />
        <span>{t.aboutHeroLabel}</span>
      </div>
      <p className="workspace-app-lead">
        <strong>{t.aboutIntro}</strong>
      </p>
      {t.aboutStory.map((para, i) => (
        <p key={i} className="workspace-app-para">
          {para.lines.map((line, j) => (
            <span key={j}>
              {line}
              {j < para.lines.length - 1 && <br />}
            </span>
          ))}
        </p>
      ))}
    </div>
  );
}
