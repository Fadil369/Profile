import { useAppState } from "../AppState";
import { useReveal } from "../hooks/useReveal";
import { MailIcon, CalendarIcon } from "../Icons";

export function Newsletter() {
  const { t } = useAppState();
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
            <div className="kicker">Stay Connected</div>
            <h2>Join the Pipeline</h2>
            <p className="newsletter-desc">
              Get early access to executive AI masterclasses, research publications, and partnership opportunities.
            </p>
            <div className="newsletter-ctas">
              <button className="btn btn-primary">
                <CalendarIcon />
                Book a Meeting
              </button>
              <a href="#contact" className="btn btn-secondary">
                <MailIcon />
                Get in Touch
              </a>
            </div>
          </div>
          <div className="newsletter-social">
            <div className="social-heading">Follow the Work</div>
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
