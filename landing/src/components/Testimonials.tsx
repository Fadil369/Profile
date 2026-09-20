import { useAppState } from "../AppState";
import { useReveal } from "../hooks/useReveal";
import { StarIcon } from "../Icons";

function Stars() {
  return (
    <div className="testimonial-stars">
      <StarIcon size={14} />
      <StarIcon size={14} />
      <StarIcon size={14} />
      <StarIcon size={14} />
      <StarIcon size={14} />
    </div>
  );
}

function Card({ name, role, text, avatar }: { name: string; role: string; text: string; avatar: string }) {
  return (
    <div className="glass-card testimonial-card">
      <Stars />
      <p className="testimonial-text">{text}</p>
      <div className="testimonial-author">
        <img src={avatar} alt={name} className="testimonial-avatar" />
        <div>
          <div className="testimonial-name">{name}</div>
          <div className="testimonial-role">{role}</div>
        </div>
      </div>
    </div>
  );
}

export function Testimonials() {
  const { t } = useAppState();
  const { ref, visible } = useReveal<HTMLElement>();

  const doubled = [...t.testimonials, ...t.testimonials];

  return (
    <section
      id="testimonials"
      data-scroll-anchor
      ref={ref}
      className={`section reveal ${visible ? "is-visible" : ""}`}
    >
      <div className="testimonials-wrap">
        <div className="section-heading">
          <div className="kicker">{t.testimonialsKicker}</div>
          <h2>{t.testimonialsTitle}</h2>
        </div>
      </div>

      <div className="marquee">
        <div className="marquee-track">
          {doubled.map((tst, i) => (
            <div className="marquee-item" key={`${tst.name}-${i}`}>
              <Card name={tst.name} role={tst.role} text={tst.text} avatar={tst.avatar} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}