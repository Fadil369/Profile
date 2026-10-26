import { useAppState } from "../AppState";
import { useBooking } from "../BookingContext";
import { useWorkspace } from "../WorkspaceContext";
import { ArrowRightIcon, CalendarIcon } from "../Icons";
import { SPID, useBprLive } from "../bpr/live";

// The hero's visual is the real thing: my BPR credential, fetched and verified in the visitor's
// browser. Clicking it opens the Verify app in the 3D workspace.
function HeroCredential() {
  const { t, isAr } = useAppState();
  const { open } = useWorkspace();
  const live = useBprLive();
  const s = live.claims?.credentialSubject;
  const sig = live.signature.state;
  const rows: [string, string, string][] = [
    ["Ed25519", sig === "ok" ? "✓" : sig === "pending" ? "…" : "✗", sig],
    [isAr ? "الحالة" : "Status", live.status.value ?? "…", live.status.state],
    [isAr ? "العضوية حتى" : "Member until", s?.membership?.validTo ?? "…", s ? "ok" : "pending"]
  ];

  return (
    <button className="hero-cred" onClick={() => open("verify")} aria-label={t.workspaceCta}>
      <div className="hero-cred-top">
        <span className="hero-cred-brand">
          <span className="grad">BPR</span> · Verifiable Credential
        </span>
        <span className={`hero-cred-seal hero-cred-seal--${sig}`}>{sig === "ok" ? "✓" : "…"}</span>
      </div>
      <div className="hero-cred-id">
        <img src="/assets/img/prof_pic.jpg" alt="" width={64} height={64} />
        <div>
          <div className="hero-cred-name">{s?.name ?? "Dr. Mohamed El Fadil"}</div>
          <div className="hero-cred-name-ar" dir="rtl">
            {s?.nameAr ?? "د. محمد الفاضل"}
          </div>
          <div className="hero-cred-spid" dir="ltr">
            {SPID} · physician
          </div>
        </div>
      </div>
      <dl className="hero-cred-rows" dir="ltr">
        {rows.map(([k, v, st]) => (
          <div key={k} className={`is-${st}`}>
            <dt>{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
      <div className="hero-cred-foot" dir="ltr">
        did:web:registry.brainsait.de
        <span className="hero-cred-open">
          3D <ArrowRightIcon size={13} />
        </span>
      </div>
    </button>
  );
}

export function Hero() {
  const { t } = useAppState();
  const { open: openBooking } = useBooking();
  const { open: openWorkspace } = useWorkspace();
  const live = useBprLive();
  const proof = live.signature.state === "ok" ? t.heroProofOk : live.signature.state === "pending" ? t.heroProofPending : t.heroProofFail;

  return (
    <section className="hero" id="top">
      <div className="hero-bg-glow" aria-hidden="true" />
      <div className="hero-inner">
        <div className="hero-copy">
          <div className="hero-kicker">{t.heroKicker}</div>
          <h1 className="hero-name">{t.heroName}</h1>
          <p className="hero-title">{t.heroTitle}</p>
          <p className="hero-lead">{t.heroLead}</p>
          <div className="hero-ctas">
            <button className="btn btn-primary btn-3d" onClick={() => openWorkspace()}>
              {t.workspaceCta}
            </button>
            <button className="btn btn-secondary" onClick={openBooking}>
              <CalendarIcon />
              {t.heroCtaMeet}
            </button>
          </div>
          <p className={`hero-proof hero-proof--${live.signature.state}`} aria-live="polite">
            <span className="hero-proof-dot" />
            {proof}
          </p>
        </div>
        <div className="hero-visual">
          <HeroCredential />
          <div className="hero-location">{t.heroLocation}</div>
        </div>
      </div>
    </section>
  );
}
