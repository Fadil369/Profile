import { useState, useEffect } from "react";
import { useAppState } from "../AppState";
import { useBooking } from "../BookingContext";
import { CalendarIcon, ChevronDownIcon } from "../Icons";
import { scrollToSection } from "../scrollTo";
import { LinkedInBadge } from "./LinkedInBadge";

const TYPING_SUBTITLES = [
  "Physician, Entrepreneur & Healthcare AI Innovator",
  "Founder & CEO, BrainSAIT",
  "NPHIES & FHIR Infrastructure Architect",
  "Healthcare AI Strategist & Executive Coach",
];

export function Hero() {
  const { t } = useAppState();
  const { open: openBooking } = useBooking();
  const [subtitleIndex, setSubtitleIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSubtitleIndex((prev) => (prev + 1) % TYPING_SUBTITLES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="hero">
      <div className="hero-photo">
        <img src="/assets/img/prof_pic.jpg" alt="Dr. Mohamed El Fadil" />
      </div>
      <div className="hero-copy">
        <div className="kicker">{t.heroKicker}</div>
        <h1>{t.heroName}</h1>
        <p className="hero-title">{TYPING_SUBTITLES[subtitleIndex]}</p>
        <div className="hero-location">{t.heroLocation}</div>
      </div>
      <div className="hero-ctas">
        <button className="btn btn-primary" onClick={openBooking}>
          <CalendarIcon />
          {t.heroCtaMeet}
        </button>
        <a href="#services" className="btn btn-secondary">
          Explore Services
        </a>
      </div>
      <LinkedInBadge />
      <button className="hero-scroll-hint" aria-label="scroll to about" onClick={() => scrollToSection("about")}>
        <ChevronDownIcon />
      </button>
    </section>
  );
}
