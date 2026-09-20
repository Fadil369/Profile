import { useAppState } from "../AppState";
import { useBooking } from "../BookingContext";
import { useReveal } from "../hooks/useReveal";
import { MailIcon, CalendarIcon } from "../Icons";

export function Newsletter() {
  const { t } = useAppState();
  const { open: openBooking } = useBooking();
  const { ref, visible } = useReveal<HTMLElement>();

  return (
    <section
      id="newsletter"
      data-scroll-anchor
      ref={ref}
      className={`section section-tight reveal ${visible ? "is-visible" : ""}`}
    >
      <div className="newsletter-wrap">
        <div className="newsletter-inner">
          <div className="newsletter-content">
            <div className="kicker">{t.newsletterKicker}</div>
            <h2>{t.newsletterTitle}</h2>
            <p className="newsletter-desc">{t.newsletterDesc}</p>
            <div className="newsletter-ctas">
              <button className="btn btn-primary" onClick={openBooking}>
                <CalendarIcon />
                {t.newsletterBookCta}
              </button>
              <a href="#contact" className="btn btn-secondary">
                <MailIcon />
                {t.newsletterContactCta}
              </a>
            </div>
          </div>
          <div className="newsletter-social">
            <div className="social-heading">{t.newsletterSocialTitle}</div>
            <div className="social-links">
              {t.socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link-btn"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}