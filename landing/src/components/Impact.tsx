import { useAppState } from "../AppState";
import { useReveal } from "../hooks/useReveal";
import { useCountUp } from "../hooks/useCountUp";
import type { StatItem } from "../content";

function ImpactValue({ stat, visible }: { stat: StatItem; visible: boolean }) {
  const { isAr } = useAppState();

  const raw = stat.value.replace(/[^\d.]/g, "");
  const prefix = stat.value.includes("+") ? "+" : "";
  const suffix = stat.value.replace(/[+\d.]/g, "");
  const numeric = parseFloat(raw) || 0;

  const count = useCountUp({
    end: numeric,
    duration: 1600,
    suffix,
    trigger: visible && numeric > 0,
  });

  if (numeric <= 0) {
    return <>{stat.value}</>;
  }

  return (
    <span dir={isAr ? "rtl" : "ltr"}>
      {prefix}
      {count}
    </span>
  );
}

export function Impact() {
  const { t } = useAppState();
  const { ref, visible } = useReveal<HTMLElement>();

  return (
    <section
      id="impact"
      data-scroll-anchor
      ref={ref}
      className={`section section--tint reveal ${visible ? "is-visible" : ""}`}
    >
      <div className="impact-wrap">
        <div className="section-heading">
          <div className="kicker">{t.impactKicker}</div>
          <h2>{t.impactTitle}</h2>
        </div>
        <div className="impact-grid">
          {t.impactStats.map((stat) => (
            <div key={stat.label} className="glass-card impact-card">
              <div className="impact-value">
                <ImpactValue stat={stat} visible={visible} />
              </div>
              <div className="impact-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}