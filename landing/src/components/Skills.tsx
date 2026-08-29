import { useAppState } from "../AppState";
import { useReveal } from "../hooks/useReveal";

export function Skills() {
  const { t } = useAppState();
  const { ref, visible } = useReveal<HTMLElement>();

  return (
    <section
      id="skills"
      data-scroll-anchor
      ref={ref}
      className={`section reveal ${visible ? "is-visible" : ""}`}
    >
      <div className="skills-wrap">
        <div className="section-heading">
          <div className="kicker">{t.skillsKicker}</div>
          <h2>{t.skillsTitle}</h2>
        </div>
        <div className="skills-grid">
          {t.skillCategories.map((cat) => (
            <div key={cat.name} className="glass-card skill-card">
              <h4>{cat.name}</h4>
              <div className="skill-tags">
                {cat.skills.map((skill) => (
                  <span key={skill.name} className="skill-tag">
                    {skill.name}
                    <span className="level">· {t.levels[skill.level]}</span>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
