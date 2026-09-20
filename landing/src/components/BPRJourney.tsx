import { useAppState } from "../AppState";
import { useReveal } from "../hooks/useReveal";
import { UsersIcon, ClockIcon, BrainIcon, SparklesIcon } from "../Icons";

const ICONS = [UsersIcon, ClockIcon, BrainIcon, SparklesIcon];

export function BPRJourney() {
  const { t } = useAppState();
  const { ref, visible } = useReveal<HTMLElement>();

  return (
    <section
      id="journey"
      data-scroll-anchor
      ref={ref}
      className={`section section--tint reveal ${visible ? "is-visible" : ""}`}
    >
      <div className="journey-wrap">
        <div className="section-heading">
          <div className="kicker">{t.bprJourneyKicker}</div>
          <h2>{t.bprJourneyTitle}</h2>
        </div>
        <div className="journey-grid">
          {t.bprJourneySteps.map((step, i) => {
            const Icon = ICONS[i];
            return (
              <div
                key={step.title}
                className="journey-card glass-card"
                style={{ "--journey-i": i } as React.CSSProperties}
              >
                <div className="journey-step">0{i + 1}</div>
                <div className="journey-icon">
                  <Icon size={24} />
                </div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            );
          })}
        </div>
        <div className="journey-progress" aria-hidden="true">
          <span />
        </div>
      </div>
    </section>
  );
}
