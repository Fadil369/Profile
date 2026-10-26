import { useAppState } from "../AppState";
import { useBooking } from "../BookingContext";
import { useReveal } from "../hooks/useReveal";
import { CalendarIcon } from "../Icons";
import { REGISTRY } from "../bpr/live";

export function Contact() {
  const { t } = useAppState();
  const { open: openBooking } = useBooking();
  const { ref, visible } = useReveal<HTMLElement>();

  return (
    <section id="contact" data-scroll-anchor ref={ref} className={`section section-tight contact-wrap reveal ${visible ? "is-visible" : ""}`}>
      <div className="kicker">{t.contactKicker}</div>
      <h2>{t.contactTitle}</h2>
      <p className="contact-text">{t.contactText}</p>
      <div className="contact-actions">
        <button className="btn btn-primary" onClick={openBooking}>
          <CalendarIcon />
          {t.heroCtaMeet}
        </button>
        <a className="btn btn-secondary" href={`${REGISTRY}/join.php`} target="_blank" rel="noopener noreferrer">
          {t.contactJoin}
        </a>
      </div>
    </section>
  );
}
