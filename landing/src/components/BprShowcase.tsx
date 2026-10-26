import { useAppState } from "../AppState";
import { useWorkspace } from "../WorkspaceContext";
import { useReveal } from "../hooks/useReveal";
import { ArrowRightIcon } from "../Icons";
import { BprIcon } from "../bpr/BprIcon";
import { BPR_TEXT, bprModules, type BprAppId } from "../bpr/modules";
import { useBprLive, type BprLive } from "../bpr/live";

// "Inside BPR": the eight systems of the registry, each opening its live app in the 3D workspace.

function liveFact(id: BprAppId, live: BprLive, lang: "ar" | "en"): string | null {
  const T = BPR_TEXT[lang];
  switch (id) {
    case "verify":
      return live.signature.state === "pending" ? null : `${live.signature.state === "ok" ? "✓" : "✗"} ${T.console.sig}: ${T.states[live.signature.state]}`;
    case "ledger":
      return live.chain.state === "pending" ? null : `${live.chain.state === "ok" ? "✓" : "✗"} #${live.chain.entries.length} · ${T.states[live.chain.state]}`;
    case "identity":
      return live.providers === undefined ? null : `${live.providers} ${T.console.providers}`;
    case "research":
      return live.research ? `${live.research.counts.dois} ${T.research.dois} · ${live.research.counts.in_community} ${T.research.community}` : null;
    case "fhir":
      return live.fhir ? `FHIR ${live.fhir.version} · ${live.fhir.resources.map((r) => r.type).join(", ")}` : null;
    default:
      return null;
  }
}

export function BprShowcase() {
  const { lang } = useAppState();
  const { open } = useWorkspace();
  const { ref, visible } = useReveal<HTMLElement>();
  const live = useBprLive();
  const T = BPR_TEXT[lang];

  return (
    <section id="bpr" data-scroll-anchor ref={ref} className={`section reveal ${visible ? "is-visible" : ""}`}>
      <div className="bpr-showcase">
        <div className="section-heading bpr-showcase-head">
          <div className="kicker">
            <span className="bpr-live-dot">{T.liveBadge}</span> {T.showcaseKicker}
          </div>
          <h2>
            <span className="grad">BPR</span> — {T.showcaseTitle}
          </h2>
          <p className="section-subtitle">{T.showcaseSub}</p>
          <button className="btn btn-primary btn-3d bpr-showcase-cta" onClick={() => open()}>
            {T.enter3d}
            <ArrowRightIcon />
          </button>
        </div>

        <div className="bpr-grid">
          {bprModules(lang).map((m, i) => {
            const fact = liveFact(m.id, live, lang);
            return (
              <button
                key={m.id}
                className="glass-card bpr-card"
                style={{ "--mod": m.color, "--i": i } as React.CSSProperties}
                onClick={() => open(m.id)}
              >
                <div className="bpr-card-top">
                  <span className="bpr-card-icon">
                    <BprIcon name={m.icon} size={22} />
                  </span>
                  {m.live && <span className="bpr-live-dot">{T.liveBadge}</span>}
                </div>
                <h3>{m.title}</h3>
                <div className="bpr-card-tag">{m.tag}</div>
                <p>{m.desc}</p>
                <div className={`bpr-card-fact${fact ? " is-on" : ""}`} dir="auto">
                  {fact ?? (m.live ? "…" : m.facts[0])}
                </div>
                <span className="bpr-card-open">
                  {T.openIn3d}
                  <ArrowRightIcon size={14} />
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
