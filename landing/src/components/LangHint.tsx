import { useEffect, useState } from "react";
import { useAppState } from "../AppState";
import { CloseIcon } from "../Icons";
import { PATHS } from "../seo";

// A visitor whose browser prefers the other language gets one quiet offer to switch.
// No automatic redirect: each language keeps its own address for search engines and sharing.
const KEY = "elfadil-langhint-dismissed";

export function LangHint() {
  const { lang } = useAppState();
  const [show, setShow] = useState(false);

  useEffect(() => {
    let dismissed = false;
    try {
      dismissed = window.localStorage.getItem(KEY) === "1";
    } catch {
      /* storage blocked */
    }
    const prefs = (navigator.languages?.length ? navigator.languages : [navigator.language]).map((l) => l.toLowerCase());
    const first = prefs.find((l) => l.startsWith("ar") || l.startsWith("en"));
    const wants = first?.startsWith("ar") ? "ar" : first?.startsWith("en") ? "en" : null;
    setShow(!dismissed && wants !== null && wants !== lang);
  }, [lang]);

  if (!show) return null;
  const toAr = lang === "en";
  const dismiss = () => {
    setShow(false);
    try {
      window.localStorage.setItem(KEY, "1");
    } catch {
      /* storage blocked */
    }
  };

  return (
    <div className="lang-hint" role="note" lang={toAr ? "ar" : "en"} dir={toAr ? "rtl" : "ltr"}>
      <span>{toAr ? "هذه الصفحة متاحة بالعربية" : "This page is also in English"}</span>
      <a href={PATHS[toAr ? "ar" : "en"]}>{toAr ? "اقرأ بالعربية" : "Read in English"}</a>
      <button onClick={dismiss} aria-label={toAr ? "إغلاق" : "Dismiss"}>
        <CloseIcon size={14} />
      </button>
    </div>
  );
}
