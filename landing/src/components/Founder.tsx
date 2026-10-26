import { useAppState } from "../AppState";
import { useReveal } from "../hooks/useReveal";
import { useBprLive } from "../bpr/live";

export function Founder() {
  const { t } = useAppState();
  const { ref, visible } = useReveal<HTMLElement>();
  const { research, github } = useBprLive();
  // ORCID and Zenodo figures come live from the registry's research API, the repo count from GitHub.
  const stats = t.impactStats.map((stat) => {
    if (research && stat.label.includes("ORCID")) return { ...stat, value: String(research.counts.orcid) };
    if (research && stat.label.includes("Zenodo")) return { ...stat, value: String(research.counts.in_community) };
    if (github && stat.label.includes("GitHub")) return { ...stat, value: String(github.publicRepos) };
    return stat;
  });

  return (
    <section id="founder" data-scroll-anchor ref={ref} className={`section reveal ${visible ? "is-visible" : ""}`}>
      <div className="founder">
        <div className="founder-story">
          <div className="kicker">{t.founderKicker}</div>
          <h2 className="founder-title">{t.founderTitle}</h2>
          {t.founderBio.map((p) => (
            <p key={p} className="founder-bio">
              {p}
            </p>
          ))}
          <div className="founder-stats">
            {stats.map((s) => (
              <div key={s.label} className="founder-stat">
                <strong dir="ltr">{s.value}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
          <div className="founder-links">
            <span className="founder-links-title">{t.linksTitle}</span>
            {t.links.map((l) => (
              <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer">
                {l.label}
              </a>
            ))}
          </div>
        </div>
        <div className="founder-path">
          <div className="founder-path-title">{t.recognitionTitle}</div>
          <ul className="recognition">
            {t.recognition.map((r) => (
              <li key={r.url}>
                <a href={r.url} target="_blank" rel="noopener noreferrer">
                  {r.label}
                </a>
                {r.source && (
                  <span className="recognition-source" dir="ltr">
                    {r.source}
                  </span>
                )}
              </li>
            ))}
          </ul>
          <div className="founder-path-title">{t.timelineTitle}</div>
          <ol className="timeline">
            {t.timeline.map((e) => (
              <li key={e.year + e.title}>
                <span className="timeline-year" dir="ltr">
                  {e.year}
                </span>
                <div>
                  <h3>{e.title}</h3>
                  <div className="timeline-org">{e.org}</div>
                  <p>{e.line}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
