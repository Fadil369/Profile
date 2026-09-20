import { useState, useEffect } from "react";
import { useAppState } from "../AppState";
import { useBooking } from "../BookingContext";
import { CalendarIcon, ChevronDownIcon, ShieldIcon, TerminalIcon } from "../Icons";
import { scrollToSection } from "../scrollTo";
import { LinkedInBadge } from "./LinkedInBadge";

const HERO_STAGES = [
  {
    ar: "من الطبيب المستخدم للنظام…",
    en: "From the physician who uses the system…",
  },
  {
    ar: "… إلى الطبيب الذي يُشغّل النظام.",
    en: "… to the physician who runs the system.",
  },
  {
    ar: "هوية. تحقق. تشغيل.",
    en: "Identity. Verification. Operation.",
  },
  {
    ar: "برينسايت أو آي دي بروفايدر ريجيستري.",
    en: "BrainSAIT OID Provider Registry.",
  },
];

const CREDENTIAL_CHIPS = [
  { label: "OID", hint: "Provider Identity" },
  { label: "FHIR R4", hint: "Interoperability" },
  { label: "NPHIES", hint: "Claims Network" },
  { label: "HIPAA", hint: "Compliance" },
];

export function Hero() {
  const { t, isAr } = useAppState();
  const { open: openBooking } = useBooking();
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStage((prev) => (prev + 1) % HERO_STAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="hero">
      <div className="hero-bg-glow" />
      <div className="hero-grid-overlay" aria-hidden="true" />
      <div className="hero-photo">
        <div className="hero-ring" aria-hidden="true" />
        <img src="/assets/img/prof_pic.jpg" alt="Dr. Mohamed El Fadil" />
        <div className="hero-badge">
          <ShieldIcon size={18} />
          <span>OID Provider</span>
        </div>
        {CREDENTIAL_CHIPS.map((chip, i) => (
          <div key={chip.label} className={`hero-chip hero-chip--${i + 1}`} aria-hidden="true">
            <span className="hero-chip-label">{chip.label}</span>
            <span className="hero-chip-hint">{chip.hint}</span>
          </div>
        ))}
      </div>
      <div className="hero-copy">
        <div className="hero-kicker">
          {t.heroKicker}
          <span className="hero-kicker-accent">· BPR Ecosystem</span>
        </div>
        <h1 className="hero-name">{t.heroName}</h1>
        <p className="hero-quote">
          {HERO_STAGES[stage][isAr ? "ar" : "en"]}
          <span className="hero-quote-en">
            {isAr ? HERO_STAGES[stage].en : HERO_STAGES[stage].ar}
          </span>
        </p>
        <p className="hero-subtitle">{t.heroSubtitle}</p>
        <div className="hero-ctas">
          <button className="btn btn-primary" onClick={openBooking}>
            <CalendarIcon />
            {t.heroCtaMeet}
          </button>
          <a href="#registry" className="btn btn-secondary">
            <TerminalIcon />
            Explore Registry
          </a>
        </div>
      </div>
      <div className="hero-meta">
        <div className="hero-location">{t.heroLocation}</div>
      </div>
      <LinkedInBadge />
      <button className="hero-scroll-hint" aria-label="scroll to about" onClick={() => scrollToSection("about")}>
        <ChevronDownIcon />
      </button>
    </section>
  );
}