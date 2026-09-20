import { useAppState } from "../AppState";
import { useReveal } from "../hooks/useReveal";
import { useTypewriter } from "../hooks/useTypewriter";
import { ShieldIcon, ArrowRightIcon, CheckCircleIcon } from "../Icons";

const REGISTRY_LINES = {
  ar: [
    "$ brainsait verify --provider SA-PHY-000001",
    "→ التحقق من سجل OID…",
    "✓ تم العثور  الدكتور محمد الفاضل",
    "✓ الدور    طبيب · مؤسس",
    "✓ النطاق   مطالبات · NPHIES · FHIR R4",
    "✓ الحالة    تم التحقق",
  ],
  en: [
    "$ brainsait verify --provider SA-PHY-000001",
    "→ querying OID registry…",
    "✓ FOUND  Dr. Mohamed El Fadil",
    "✓ ROLE   Physician · Founder",
    "✓ SCOPE  Claims · NPHIES · FHIR R4",
    "✓ STATUS VERIFIED",
  ],
};

export function Registry() {
  const { t, isAr } = useAppState();
  const { ref, visible } = useReveal<HTMLElement>();
  const { typed, doneTyping } = useTypewriter(REGISTRY_LINES[isAr ? "ar" : "en"]);

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

          <div className="registry-terminal" dir="ltr">
            <div className="terminal-bar">
              <span className="terminal-dot" />
              <span className="terminal-dot" />
              <span className="terminal-dot" />
              <span className="terminal-title">brainsait --verify</span>
            </div>
            <div className="terminal-body">
              <span className="terminal-output">{typed}</span>
              <span className={`terminal-caret ${doneTyping ? "is-blinking" : ""}`} />
            </div>
          </div>

          <div className="registry-ctas">
            <a
              href="https://registry.brainsait.org"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              {t.registryCta}
              <ArrowRightIcon />
            </a>
            <a
              href="https://verify.brainsait.org"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
            >
              {t.registryCtaSecondary}
            </a>
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
                <div className="status-val">SA-PHY-000001</div>
              </div>
              <div>
                <div className="status-key">{t.registryKeys.network}</div>
                <div className="status-val">OID · Registry</div>
              </div>
              <div>
                <div className="status-key">{t.registryKeys.region}</div>
                <div className="status-val">ME · Africa</div>
              </div>
              <div>
                <div className="status-key">{t.registryKeys.layer}</div>
                <div className="status-val">Identity</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}