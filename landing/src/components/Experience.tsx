import { useEffect, useRef, useState } from "react";
import { useAppState } from "../AppState";
import { useReveal } from "../hooks/useReveal";

export function Experience() {
  const { t } = useAppState();
  const { ref, visible } = useReveal<HTMLElement>();
  const timelineRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const tl = timelineRef.current;
    if (!tl) return;

    const measure = () => {
      const rect = tl.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh * 0.8;
      const end = vh * 0.25;
      const p = Math.min(1, Math.max(0, (start - rect.top) / (start - end)));
      setProgress(p);
    };

    measure();
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <section
      id="experience"
      data-scroll-anchor
      ref={ref}
      className={`section section-narrow reveal ${visible ? "is-visible" : ""}`}
    >
      <div className="timeline-wrap">
        <div className="section-heading">
          <div className="kicker">{t.expKicker}</div>
          <h2>{t.expTitle}</h2>
        </div>
        <div className="timeline" ref={timelineRef} style={{ "--tl-progress": `${Math.round(progress * 100)}%` } as React.CSSProperties}>
          {t.experience.map((exp) => (
            <div key={`${exp.year}-${exp.title}`} className="timeline-item">
              <div className="timeline-dot" />
              <div className="timeline-year">{exp.year}</div>
              <div className="glass-card timeline-card">
                <h3>{exp.title}</h3>
                <div className="timeline-org">{exp.org}</div>
                {exp.desc.map((line) => (
                  <div key={line} className="timeline-desc-line">
                    <span className="bullet">—</span>
                    <span>{line}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
