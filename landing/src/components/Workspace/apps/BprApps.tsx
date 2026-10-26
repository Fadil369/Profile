import { useEffect, useMemo, useState } from "react";
import { useAppState } from "../../../AppState";
import { ArrowRightIcon } from "../../../Icons";
import { BprIcon } from "../../../bpr/BprIcon";
import { BPR_TEXT, bprModules, type BprAppId, type BprModule } from "../../../bpr/modules";
import { VerifyConsole } from "../../../bpr/VerifyConsole";
import { decodeClaims, forgeName, short, useBprLive, verifyJwt, type Check } from "../../../bpr/live";

function useModule(id: BprAppId): BprModule {
  const { lang } = useAppState();
  return bprModules(lang).find((m) => m.id === id)!;
}

function ModuleHead({ m }: { m: BprModule }) {
  const { lang } = useAppState();
  return (
    <header className="bpr-app-head" style={{ "--mod": m.color } as React.CSSProperties}>
      <div className="bpr-app-icon">
        <BprIcon name={m.icon} size={22} />
      </div>
      <div>
        <div className="bpr-app-tag">
          {m.tag}
          {m.live && <span className="bpr-live-dot">{BPR_TEXT[lang].liveBadge}</span>}
        </div>
        <p className="bpr-app-desc">{m.desc}</p>
      </div>
    </header>
  );
}

function ModuleFoot({ m }: { m: BprModule }) {
  return (
    <div className="bpr-app-foot">
      <ul className="bpr-facts">
        {m.facts.map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>
      <div className="bpr-app-links">
        {m.links.map((l) => (
          <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer" className="btn btn-secondary bpr-link-btn">
            {l.label}
            <ArrowRightIcon size={14} />
          </a>
        ))}
      </div>
    </div>
  );
}

function CheckPill({ c, label }: { c: Check; label: string }) {
  const { lang } = useAppState();
  return (
    <span className={`bpr-pill bpr-pill--${c.state}`}>
      {c.state === "ok" ? "✓" : c.state === "pending" ? "…" : "✗"} {label}: {BPR_TEXT[lang].states[c.state]}
      {c.detail ? ` — ${c.detail}` : ""}
    </span>
  );
}

export function VerifyApp() {
  const { lang } = useAppState();
  const T = BPR_TEXT[lang];
  const m = useModule("verify");
  const live = useBprLive();
  const [forged, setForged] = useState<{ jwt: string; check: Check } | null>(null);
  const jwt = forged?.jwt ?? live.jwt;
  const claims = jwt ? decodeClaims(jwt) : undefined;
  const s = claims?.credentialSubject;

  const forge = async () => {
    if (!live.jwt) return;
    const f = forgeName(live.jwt, T.verify.forgedName);
    setForged({ jwt: f, check: { state: "pending" } });
    setForged({ jwt: f, check: await verifyJwt(f, live.jwks) });
  };

  const rows: [string, string][] = s
    ? [
        ["SPID", s.spid],
        ["name", s.name + (s.nameAr ? ` · ${s.nameAr}` : "")],
        ["profession", s.profession + (s.specialty ? ` · ${s.specialty}` : "")],
        ["orcid", s.orcid || "—"],
        ["membership", `${s.membership?.state ?? "—"} → ${s.membership?.validTo ?? "—"}`],
        ["verificationLevel", T.levels[s.verificationLevel || ""] || s.verificationLevel || "—"],
        ["qualifications", s.qualifications?.length ? s.qualifications.map((q) => `${q.kind} · ${q.state}`).join(", ") : "—"],
        ["validFrom", claims!.validFrom],
        ["validUntil", claims!.validUntil]
      ]
    : [];

  return (
    <div className="bpr-app">
      <ModuleHead m={m} />
      <p className="bpr-app-lead">{T.verify.lead}</p>
      <VerifyConsole />
      <div className={`bpr-cred${forged ? " is-forged" : ""}`}>
        <div className="bpr-cred-bar">
          <span>{forged ? T.verify.forged : T.verify.claims}</span>
          {forged ? (
            <CheckPill c={forged.check} label="Ed25519" />
          ) : (
            <CheckPill c={live.signature} label="Ed25519" />
          )}
        </div>
        <dl className="bpr-cred-grid" dir="ltr">
          {rows.map(([k, v]) => (
            <div key={k} className={forged && k === "name" ? "is-changed" : ""}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
        <div className="bpr-cred-actions">
          {forged ? (
            <button className="btn btn-secondary" onClick={() => setForged(null)}>
              {T.verify.restore}
            </button>
          ) : (
            <button className="btn btn-primary" onClick={forge} disabled={!live.jwt || live.signature.state !== "ok"}>
              {T.verify.tamper}
            </button>
          )}
          <span className="bpr-cred-hint">{T.verify.tamperHint}</span>
        </div>
        {jwt && (
          <details className="bpr-raw">
            <summary>{T.verify.raw}</summary>
            <code dir="ltr">{jwt}</code>
          </details>
        )}
      </div>
      <ModuleFoot m={m} />
    </div>
  );
}

export function LedgerApp() {
  const { lang } = useAppState();
  const T = BPR_TEXT[lang];
  const m = useModule("ledger");
  const live = useBprLive();
  const [step, setStep] = useState(0);
  const entries = live.chain.entries;
  const total = entries.length + 1;

  // Walks the chain one block at a time so the replay is visible.
  useEffect(() => {
    if (step >= total || live.chain.state === "pending") return;
    const id = window.setTimeout(() => setStep((s) => s + 1), 420);
    return () => window.clearTimeout(id);
  }, [step, total, live.chain.state]);

  return (
    <div className="bpr-app">
      <ModuleHead m={m} />
      <p className="bpr-app-lead">{T.ledger.lead}</p>
      <div className="bpr-chain" dir="ltr">
        <div className={`bpr-block bpr-block--genesis${step >= 1 ? " is-on" : ""}`}>
          <div className="bpr-block-seq">{T.ledger.genesis}</div>
          <code>{short(live.chain.genesis || "0".repeat(64), 8)}</code>
        </div>
        {entries.map((e, i) => (
          <div key={e.seq} className="bpr-block-wrap">
            <span className={`bpr-chain-link${step >= i + 2 ? " is-on" : ""}`} />
            <div className={`bpr-block${step >= i + 2 ? " is-on" : ""}`}>
              <div className="bpr-block-seq">
                #{e.seq} · {e.event}
              </div>
              <div className="bpr-block-meta">
                {e.spid} · {e.at.slice(0, 10)}
              </div>
              <code>prev {short(e.prev, 6)}</code>
              <code>hash {short(e.hash, 6)}</code>
            </div>
          </div>
        ))}
      </div>
      <div className="bpr-pills">
        <CheckPill c={live.chain} label={`${T.ledger.entries} ${entries.length}`} />
        <CheckPill c={live.headSignature} label="head" />
        <button className="btn btn-secondary bpr-small-btn" onClick={() => setStep(0)}>
          {T.ledger.replay}
        </button>
      </div>
      <ModuleFoot m={m} />
    </div>
  );
}

export function ResearchApp() {
  const { lang } = useAppState();
  const T = BPR_TEXT[lang].research;
  const m = useModule("research");
  const { research } = useBprLive();
  const stats = research
    ? [
        [research.counts.orcid, "ORCID " + T.works],
        [research.counts.dois, T.dois],
        [research.counts.in_community, T.community],
        [research.metrics.zenodo_downloads + research.metrics.hf_downloads, T.downloads]
      ]
    : [];
  return (
    <div className="bpr-app">
      <ModuleHead m={m} />
      <p className="bpr-app-lead">{T.lead}</p>
      <div className="bpr-stats">
        {research
          ? stats.map(([v, l]) => (
              <div key={String(l)} className="bpr-stat">
                <strong>{v}</strong>
                <span>{l}</span>
              </div>
            ))
          : [0, 1, 2, 3].map((i) => <div key={i} className="bpr-stat is-loading" />)}
      </div>
      <ul className="bpr-works" dir="ltr">
        {(research?.works || []).slice(0, 12).map((w) => (
          <li key={w.url}>
            <span className="bpr-work-year">{w.year}</span>
            <a href={w.url} target="_blank" rel="noopener noreferrer">
              {w.title}
            </a>
            <span className="bpr-work-kind">{w.kind}</span>
          </li>
        ))}
      </ul>
      <ModuleFoot m={m} />
    </div>
  );
}

// Same equation and unit rule as the registry cockpit (lib-tools.php, registry commit 280bafe):
// CKD-EPI 2021 race-free; creatinine ≤ 20 is read as mg/dL, larger values as µmol/L.
function ckdEpi2021(age: number, scrMgdl: number, female: boolean): number {
  const k = female ? 0.7 : 0.9;
  const a = female ? -0.241 : -0.302;
  const r = scrMgdl / k;
  return 142 * Math.pow(Math.min(r, 1), a) * Math.pow(Math.max(r, 1), -1.2) * Math.pow(0.9938, age) * (female ? 1.012 : 1);
}
const toMgdl = (scr: number) => (scr <= 20 ? scr : scr / 88.4);
function ckdStage(e: number) {
  return e >= 90 ? "G1" : e >= 60 ? "G2" : e >= 45 ? "G3a" : e >= 30 ? "G3b" : e >= 15 ? "G4" : "G5";
}

export function ToolkitApp() {
  const { lang } = useAppState();
  const T = BPR_TEXT[lang].toolkit;
  const m = useModule("toolkit");
  const [age, setAge] = useState(50);
  const [scr, setScr] = useState(1.0);
  const [female, setFemale] = useState(false);
  const mgdl = toMgdl(scr);
  const egfr = useMemo(() => (age >= 18 && scr > 0 ? ckdEpi2021(age, toMgdl(scr), female) : NaN), [age, scr, female]);
  const pct = Math.max(0, Math.min(1, (Number.isFinite(egfr) ? egfr : 0) / 120));

  return (
    <div className="bpr-app">
      <ModuleHead m={m} />
      <p className="bpr-app-lead">{T.lead}</p>
      <div className="bpr-calc">
        <div className="bpr-calc-title">{T.calc}</div>
        <div className="bpr-calc-grid">
          <label>
            <span>{T.age}</span>
            <input type="number" min={18} max={110} value={age} onChange={(e) => setAge(+e.target.value)} />
            <input type="range" min={18} max={100} value={age} onChange={(e) => setAge(+e.target.value)} aria-label={T.age} />
          </label>
          <label>
            <span>{T.scr}</span>
            <input type="number" min={0.2} max={1500} step={0.1} value={scr} onChange={(e) => setScr(+e.target.value)} />
            <input type="range" min={0.3} max={8} step={0.1} value={Math.min(8, mgdl)} onChange={(e) => setScr(+e.target.value)} aria-label={T.scr} />
            <small className="bpr-calc-unit" dir="ltr">
              {scr > 20 ? `${scr} µmol/L = ${mgdl.toFixed(2)} mg/dL` : `${scr} mg/dL`}
            </small>
          </label>
          <div className="bpr-calc-sex" role="radiogroup" aria-label={T.sex}>
            <span>{T.sex}</span>
            <div>
              <button className={!female ? "is-active" : ""} onClick={() => setFemale(false)} role="radio" aria-checked={!female}>
                {T.male}
              </button>
              <button className={female ? "is-active" : ""} onClick={() => setFemale(true)} role="radio" aria-checked={female}>
                {T.female}
              </button>
            </div>
          </div>
        </div>
        <div className="bpr-calc-out">
          <div className="bpr-calc-gauge" style={{ "--p": pct } as React.CSSProperties}>
            <span />
          </div>
          <div>
            <div className="bpr-calc-value" dir="ltr">
              {Number.isFinite(egfr) ? Math.round(egfr) : "—"} <small>{T.unit}</small>
            </div>
            <div className="bpr-calc-stage">
              {T.stage}: <strong>{Number.isFinite(egfr) ? ckdStage(egfr) : "—"}</strong>
            </div>
          </div>
        </div>
      </div>
      <ModuleFoot m={m} />
    </div>
  );
}

export function FhirApp() {
  const { lang } = useAppState();
  const T = BPR_TEXT[lang].fhir;
  const m = useModule("fhir");
  const { fhir } = useBprLive();
  return (
    <div className="bpr-app">
      <ModuleHead m={m} />
      <p className="bpr-app-lead">{T.lead}</p>
      <div className="bpr-fhir" dir="ltr">
        <div className="bpr-fhir-head">
          CapabilityStatement · {T.version} <strong>{fhir?.version ?? "…"}</strong>
        </div>
        {(fhir?.resources || []).map((r) => (
          <div key={r.type} className="bpr-fhir-row">
            <code>{r.type}</code>
            <span>
              {r.interactions.map((i) => (
                <em key={i}>{i}</em>
              ))}
            </span>
          </div>
        ))}
      </div>
      <ModuleFoot m={m} />
    </div>
  );
}

export function ModuleApp({ id }: { id: BprAppId }) {
  const m = useModule(id);
  return (
    <div className="bpr-app">
      <ModuleHead m={m} />
      <ModuleFoot m={m} />
    </div>
  );
}

export function BprHome({ onOpen }: { onOpen: (id: BprAppId) => void }) {
  const { lang } = useAppState();
  const T = BPR_TEXT[lang];
  const live = useBprLive();
  return (
    <div className="bpr-home">
      <div className="bpr-home-top">
        <div>
          <div className="kicker">{T.showcaseKicker}</div>
          <h2 className="bpr-home-title">
            <span className="grad">BPR</span> · BrainSAIT Provider Registry
          </h2>
          <p className="bpr-home-hint">{T.launcherHint}</p>
        </div>
        <VerifyConsole compact />
      </div>
      <div className="bpr-launcher">
        {bprModules(lang).map((m) => (
          <button key={m.id} className="bpr-tile" style={{ "--mod": m.color } as React.CSSProperties} onClick={() => onOpen(m.id)}>
            <span className="bpr-tile-icon">
              <BprIcon name={m.icon} size={22} />
            </span>
            <span className="bpr-tile-title">{m.title}</span>
            <span className="bpr-tile-tag">{m.tag}</span>
            {m.live && <span className="bpr-live-dot">{T.liveBadge}</span>}
          </button>
        ))}
      </div>
      {live.providers !== undefined && (
        <div className="bpr-home-foot">
          {live.providers} {T.console.providers} · OID 1.3.6.1.4.1.61026
        </div>
      )}
    </div>
  );
}
