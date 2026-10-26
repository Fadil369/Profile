import { useEffect, useRef, useState } from "react";
import { useAppState } from "../AppState";
import { useRelease } from "./release";

const TEXT = {
  en: {
    build: "build",
    verified: "files match the release manifest",
    mismatch: "a loaded file does not match the manifest",
    loading: "checking…",
    title: "Release provenance",
    lead: "This page hashed the code it loaded, in your browser, and compared it with the release manifest. Rebuild the commit to reproduce the same hashes.",
    commit: "commit",
    built: "built",
    dirty: "built from uncommitted changes — not reproducible from the commit",
    notes: "What's new",
    manifest: "release.json"
  },
  ar: {
    build: "إصدار",
    verified: "الملفات مطابقة لبيان الإصدار",
    mismatch: "ملف محمّل لا يطابق البيان",
    loading: "جارٍ التحقق…",
    title: "مصدر الإصدار",
    lead: "حسبت هذه الصفحة تجزئة الشيفرة التي حمّلتها، في متصفحك، وقارنتها ببيان الإصدار. أعد بناء الالتزام لتحصل على التجزئات نفسها.",
    commit: "الالتزام",
    built: "وقت البناء",
    dirty: "بُني من تغييرات غير ملتزمة — لا يمكن إعادة إنتاجه من الالتزام",
    notes: "الجديد",
    manifest: "release.json"
  }
};

export function ReleaseChip() {
  const { lang } = useAppState();
  const T = TEXT[lang];
  const rel = useRelease();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey, true);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey, true);
    };
  }, [open]);

  if (rel.status === "unavailable") return null;
  const m = rel.manifest;
  const mark = rel.status === "verified" ? "✓" : rel.status === "mismatch" ? "✗" : "…";

  return (
    <div className="release" ref={ref}>
      <button
        className={`release-chip release-chip--${rel.status}`}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        title={rel.status === "verified" ? T.verified : rel.status === "mismatch" ? T.mismatch : T.loading}
      >
        <span className="release-mark">{mark}</span>
        <span dir="ltr">
          {T.build} {m?.short ?? "…"}
        </span>
      </button>
      {open && m && (
        <div className="release-panel" role="dialog" aria-label={T.title}>
          <div className="release-title">{T.title}</div>
          <p className="release-lead">{T.lead}</p>
          <dl className="release-meta" dir="ltr">
            <dt>{T.commit}</dt>
            <dd>
              <a href={`${m.repo}/commit/${m.commit}`} target="_blank" rel="noopener noreferrer">
                {m.short}
              </a>{" "}
              · {m.branch}
            </dd>
            <dt>{T.built}</dt>
            <dd>{m.builtAt.replace("T", " ").slice(0, 16)} UTC</dd>
          </dl>
          {m.dirty && <p className="release-warn">{T.dirty}</p>}
          <ul className="release-files" dir="ltr">
            {rel.checks.map((c) => (
              <li key={c.path} className={c.ok ? "is-ok" : "is-bad"}>
                <span>{c.ok ? "✓" : "✗"}</span> {c.path}
                <code>{m.files[c.path]?.slice(0, 16)}…</code>
              </li>
            ))}
          </ul>
          {m.notes[0] && (
            <>
              <div className="release-subtitle">
                {T.notes} · {m.notes[0].date}
              </div>
              <ul className="release-notes">
                {m.notes[0][lang].map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
            </>
          )}
          <a className="release-link" href="/release.json" target="_blank" rel="noopener noreferrer">
            {T.manifest} ↗
          </a>
        </div>
      )}
    </div>
  );
}
