import { useAppState } from "../AppState";
import { useReveal } from "../hooks/useReveal";
import { ShieldIcon } from "../Icons";

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
      <div className="about-grid about-grid--story">
        <div className="about-copy">
          <div className="kicker">{t.aboutKicker}</div>
          <p className="about-story about-story--first">
            <strong>{t.aboutIntro}</strong>
          </p>
          {t.aboutStory.map((para, i) => (
            <p key={i} className={`about-story${para.highlight ? " about-story--highlight" : ""}${para.cta ? " about-story--cta" : ""}`}>
              {para.lines.map((line, j) => (
                <span key={j}>
                  {line}
                  {j < para.lines.length - 1 && <br />}
                </span>
              ))}
            </p>
          ))}
        </div>
        <div className="about-visual">
          <div className="glass-card about-hero-card">
            <div className="about-hero-badge">
              <ShieldIcon size={32} />
              <span className="about-hero-label">{t.aboutHeroLabel}</span>
            </div>
            <h2 className="about-hero-title">{t.aboutHeroTitle}</h2>
            <h3 className="about-hero-subtitle">{t.aboutHeroSubtitle}</h3>
            <div className="about-hero-divider" />
            <p className="about-hero-desc">
              {t.aboutHeroDesc.map((line, i) => (
                <span key={i}>
                  {line}
                  {i < t.aboutHeroDesc.length - 1 && <br />}
                </span>
              ))}
            </p>
            <a href="#registry" className="btn btn-primary">
              {t.aboutHeroCta}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}