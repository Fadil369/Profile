import { useAppState } from "../AppState";
import { useReveal } from "../hooks/useReveal";
import { StarIcon } from "../Icons";

export function Testimonials() {
  const { t } = useAppState();
  const { ref, visible } = useReveal<HTMLElement>();

  return (
    <section
      id="testimonials"
      data-scroll-anchor
      ref={ref}
      className={`section section-narrow reveal ${visible ? "is-visible" : ""}`}
    >
      <div className="testimonials-wrap">
        <div className="section-heading">
          <div className="kicker">Voices</div>
          <h2>What Partners Say</h2>
        </div>
        <div className="testimonials-grid">
          {t.testimonials.map((tst) => (
            <div key={tst.name} className="glass-card testimonial-card">
              <div className="testimonial-stars">
                <StarIcon size={14} />
                <StarIcon size={14} />
                <StarIcon size={14} />
                <StarIcon size={14} />
                <StarIcon size={14} />
              </div>
              <p className="testimonial-text">{tst.text}</p>
              <div className="testimonial-author">
                <img src={tst.avatar} alt={tst.name} className="testimonial-avatar" />
                <div>
                  <div className="testimonial-name">{tst.name}</div>
                  <div className="testimonial-role">{tst.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
