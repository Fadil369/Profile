import { useAppState } from "../AppState";
import { useReveal } from "../hooks/useReveal";
import { useCountUp } from "../hooks/useCountUp";

function parseStatValue(value: string): { end: number; decimals: number; suffix: string } {
  const clean = value.replace(/[+\s]/g, "");
  if (clean.toLowerCase().includes("k")) {
    const num = parseFloat(clean.toLowerCase().replace("k", ""));
    return { end: num * 1000, decimals: 0, suffix: "k" };
  }
  return { end: parseFloat(clean), decimals: 0, suffix: "" };
}

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
      <div className="about-grid">
        <div className="about-copy">
          <div className="kicker">{t.aboutKicker}</div>
          <p className="about-p1">{t.aboutP1}</p>
          <p className="about-p2">{t.aboutP2}</p>
        </div>
        <div className="stats-col">
          {t.stats.map((stat) => {
            const { end, decimals, suffix } = parseStatValue(stat.value);
            const displayValue = useCountUp({
              end,
              decimals,
              suffix,
              trigger: visible,
            });
            return (
              <div key={stat.label} className="glass-card stat-card">
                <div className="stat-value">{displayValue}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
