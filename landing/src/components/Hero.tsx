import { useAppState } from "../AppState";
import { useBooking } from "../BookingContext";
import { CalendarIcon, ChevronDownIcon } from "../Icons";
import { scrollToSection } from "../scrollTo";
import { LinkedInBadge } from "./LinkedInBadge";

export function Hero() {
  const { t } = useAppState();
  const { open: openBooking } = useBooking();

  return (
    <section className="hero">
      <div className="hero-photo">
        <img src="/assets/img/prof_pic.jpg" alt="Dr. Mohamed El Fadil" />
      </div>
      <div className="hero-copy">
        <div className="kicker">{t.heroKicker}</div>
        <h1>{t.heroName}</h1>
        <p className="hero-title">{t.heroTitle}</p>
        <div className="hero-location">{t.heroLocation}</div>
      </div>
      <div className="hero-ctas">
        <button className="btn btn-primary" onClick={openBooking}>
          <CalendarIcon />
          {t.heroCtaMeet}
        </button>
      </div>
      <LinkedInBadge />
      <button className="hero-scroll-hint" aria-label="scroll to about" onClick={() => scrollToSection("about")}>
        <ChevronDownIcon />
      </button>
    </section>
  );
}
