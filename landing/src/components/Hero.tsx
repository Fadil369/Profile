import { useState, useEffect } from "react";
import { useAppState } from "../AppState";
import { useBooking } from "../BookingContext";
import { CalendarIcon, ChevronDownIcon, ShieldIcon } from "../Icons";
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

export function Hero() {
  const { t } = useAppState();
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
      <div className="hero-photo">
        <img src="/assets/img/prof_pic.jpg" alt="Dr. Mohamed El Fadil" />
        <div className="hero-badge">
          <ShieldIcon size={18} />
          <span>OID Provider</span>
        </div>
      </div>
      <div className="hero-copy">
        <div className="hero-kicker">
          {t.heroKicker}
          <span className="hero-kicker-accent">· BPR Ecosystem</span>
        </div>
        <h1 className="hero-name">{t.heroName}</h1>
        <p className="hero-quote">
          {HERO_STAGES[stage].ar}
          <span className="hero-quote-en">{HERO_STAGES[stage].en}</span>
        </p>
        <p className="hero-subtitle">
          طبيب منذ سنوات. مؤسس برينسايت. بنا نظامًا حوالي الطبيب بدل أن نطلب منه أن يتكيف مع أنظمة لم تُبنَ له.
        </p>
        <div className="hero-ctas">
          <button className="btn btn-primary" onClick={openBooking}>
            <CalendarIcon />
            {t.heroCtaMeet}
          </button>
          <a href="#registry" className="btn btn-secondary">
            Explore Registry
          </a>
        </div>
      </div>
      <LinkedInBadge />
      <button className="hero-scroll-hint" aria-label="scroll to about" onClick={() => scrollToSection("about")}>
        <ChevronDownIcon />
      </button>
    </section>
  );
}
