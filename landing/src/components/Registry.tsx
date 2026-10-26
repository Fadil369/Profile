import { useAppState } from "../AppState";
import { useWorkspace } from "../WorkspaceContext";
import { useReveal } from "../hooks/useReveal";
import { ShieldIcon, ArrowRightIcon, CheckCircleIcon } from "../Icons";
import { VerifyConsole } from "../bpr/VerifyConsole";
import { BPR_TEXT } from "../bpr/modules";
import { REGISTRY, SPID, short, useBprLive } from "../bpr/live";

export function Registry() {
  const { t, lang } = useAppState();
  const { open } = useWorkspace();
  const { ref, visible } = useReveal<HTMLElement>();
  const live = useBprLive();
  const T = BPR_TEXT[lang];
  const s = live.claims?.credentialSubject;

  return (
    <section
      id="registry"
      data-scroll-anchor
      ref={ref}
      className={`section reveal ${visible ? "is-visible" : ""}`}
    >
      <div className="registry-layout">
        <div className="registry-card glass-card">
          <div className="registry-card-head">
            <div className="registry-icon">
              <ShieldIcon size={20} />
            </div>
            <div>
              <div className="kicker">{t.registryKicker}</div>
              <h2 className="registry-title">
                <span className="grad">{t.registryBadge}</span> {t.registryTitle}
              </h2>
            </div>
          </div>
          <p className="registry-desc">{t.registryDesc}</p>

          <VerifyConsole />

          <div className="registry-ctas">
            <a href={`${REGISTRY}/join.php`} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              {t.registryCta}
              <ArrowRightIcon />
            </a>
            <a href={`${REGISTRY}/verify`} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
              {t.registryCtaSecondary}
            </a>
            <button className="btn btn-secondary btn-3d" onClick={() => open("verify")}>
              {T.openIn3d}
            </button>
          </div>
        </div>

        <div className="registry-side">
          <div className="glass-card registry-status-card">
            <div className="registry-status-title">
              <CheckCircleIcon />
              <span>{t.registryStatusTitle}</span>
            </div>
            <div className="registry-status-grid">
              <div>
                <div className="status-key">{t.registryKeys.provider}</div>
                <div className="status-val">
                  <a href={`${REGISTRY}/p/${SPID}`} target="_blank" rel="noopener noreferrer">
                    {SPID}
                  </a>
                </div>
              </div>
              <div>
                <div className="status-key">{T.console.membership}</div>
                <div className="status-val">{s?.membership ? `${s.membership.state} · ${s.membership.validTo}` : "…"}</div>
              </div>
              <div>
                <div className="status-key">{t.registryKeys.network}</div>
                <div className="status-val">OID 1.3.6.1.4.1.61026</div>
              </div>
              <div>
                <div className="status-key">{T.console.chain}</div>
                <div className="status-val">{live.head ? `#${live.head.size} · ${short(live.head.hash, 6)}` : "…"}</div>
              </div>
              <div>
                <div className="status-key">{T.console.providers}</div>
                <div className="status-val">{live.providers ?? "…"}</div>
              </div>
              <div>
                <div className="status-key">{t.registryKeys.layer}</div>
                <div className="status-val">FHIR R4 · VC 2.0</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
