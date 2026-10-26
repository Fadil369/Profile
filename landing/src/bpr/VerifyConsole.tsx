import { useAppState } from "../AppState";
import { BPR_TEXT } from "./modules";
import { short, SPID, useBprLive, type Check } from "./live";

// The live verification readout used by the Registry section and the 3D workspace.
// Each row is a real check that just ran in this browser.

function Mark({ c }: { c: Check }) {
  const sym = c.state === "ok" ? "✓" : c.state === "pending" ? "…" : "✗";
  return <span className={`bpr-mark bpr-mark--${c.state}`}>{sym}</span>;
}

export function VerifyConsole({ compact = false }: { compact?: boolean }) {
  const { lang } = useAppState();
  const T = BPR_TEXT[lang];
  const C = T.console;
  const live = useBprLive();
  const s = live.claims?.credentialSubject;
  const how = live.signature.how === "server" ? C.sigServer : C.sigDevice;

  const rows: { c: Check; k: string; v: string }[] = [
    { c: live.signature, k: C.sig, v: live.signature.state === "ok" ? how : T.states[live.signature.state] + (live.signature.detail ? ` — ${live.signature.detail}` : "") },
    { c: live.status, k: C.status, v: live.status.value || T.states[live.status.state] },
    {
      c: live.chain,
      k: C.chain,
      v: live.chain.state === "ok" ? `#${live.chain.entries.length} · ${short(live.head?.hash, 8)}` : T.states[live.chain.state] + (live.chain.detail ? ` ${live.chain.detail}` : "")
    },
    { c: live.headSignature, k: C.head, v: T.states[live.headSignature.state] }
  ];

  return (
    <div className={`registry-terminal bpr-console${compact ? " bpr-console--compact" : ""}`} dir="ltr">
      <div className="terminal-bar">
        <span className="terminal-dot" />
        <span className="terminal-dot" />
        <span className="terminal-dot" />
        <span className="terminal-title">{C.title} --provider {SPID}</span>
      </div>
      <div className="terminal-body bpr-console-body">
        <div className="bpr-console-cmd">$ brainsait verify --provider {SPID}</div>
        {!s && <div className="bpr-console-muted">→ {C.fetching}</div>}
        {s && (
          <>
            <div className="bpr-console-who">
              <span className="bpr-mark bpr-mark--ok">✓</span> {s.name}
              {s.nameAr && <span className="bpr-console-ar"> · {s.nameAr}</span>}
            </div>
            <div className="bpr-console-muted">
              {s.profession} · {live.claims?.issuer.id}
            </div>
          </>
        )}
        {rows.map((r) => (
          <div className="bpr-console-row" key={r.k}>
            <Mark c={r.c} />
            <span className="bpr-console-k">{r.k}</span>
            <span className="bpr-console-v">{r.v}</span>
          </div>
        ))}
        {s && !compact && (
          <>
            <div className="bpr-console-row">
              <span className="bpr-mark bpr-mark--info">·</span>
              <span className="bpr-console-k">{C.membership}</span>
              <span className="bpr-console-v">
                {s.membership?.state} → {s.membership?.validTo}
              </span>
            </div>
            <div className="bpr-console-row">
              <span className="bpr-mark bpr-mark--info">·</span>
              <span className="bpr-console-k">{C.level}</span>
              <span className="bpr-console-v">{T.levels[s.verificationLevel || ""] || s.verificationLevel}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
