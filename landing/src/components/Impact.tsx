import { useAppState } from "../AppState";
import { useBprLive } from "../bpr/live";
import { useReveal } from "../hooks/useReveal";
import { useCountUp } from "../hooks/useCountUp";
import type { StatItem } from "../content";

function ImpactValue({ stat, visible }: { stat: StatItem; visible: boolean }) {
  const { isAr } = useAppState();

  const raw = stat.value.replace(/[^\d.]/g, "");
  const prefix = stat.value.includes("+") ? "+" : "";
  const suffix = stat.value.replace(/[+\d.]/g, "");
  const numeric = parseFloat(raw) || 0;
  // A year ("2010") is a label, not a quantity: no count-up, no thousands separator.
  const isYear = /^(19|20)\d\d$/.test(stat.value);

  const count = useCountUp({
    end: numeric,
    duration: 1600,
    suffix,
    trigger: visible && numeric > 0 && !isYear,
  });

  if (numeric <= 0 || isYear) {
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
  const { research } = useBprLive();
  // The ORCID and Zenodo figures are read live from the registry's research API when available.
  const stats = t.impactStats.map((stat) => {
    if (!research) return stat;
    if (stat.label.includes("ORCID")) return { ...stat, value: String(research.counts.orcid) };
    if (stat.label.includes("Zenodo")) return { ...stat, value: String(research.counts.in_community) };
    return stat;
  });

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
          {stats.map((stat) => (
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