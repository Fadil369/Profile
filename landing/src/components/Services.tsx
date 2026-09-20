import { useAppState } from "../AppState";
import { useReveal } from "../hooks/useReveal";
import { ArrowRightIcon, SparklesIcon } from "../Icons";

export function Services() {
  const { t } = useAppState();
  const { ref, visible } = useReveal<HTMLElement>();

  return (
    <section
      id="services"
      data-scroll-anchor
      ref={ref}
      className={`section reveal ${visible ? "is-visible" : ""}`}
    >
      <div className="services-wrap">
        <div className="section-heading">
          <div className="kicker">What I Offer</div>
          <h2>Professional Services</h2>
          <p className="section-subtitle">
            From AI strategy to regulatory compliance — delivering measurable impact across the Saudi healthcare ecosystem.
          </p>
        </div>
        <div className="services-grid">
          {t.services.map((service) => (
            <div key={service.title} className="glass-card service-card">
              <div className="service-icon">
                <SparklesIcon size={24} />
              </div>
              <h3>{service.title}</h3>
              <p className="service-desc">{service.desc}</p>
              <ul className="service-features">
                {service.features.map((f) => (
                  <li key={f}>
                    <span className="feature-bullet" />
                    {f}
                  </li>
                ))}
              </ul>
              <a href="#contact" className="service-cta">
                Get Started <ArrowRightIcon size={14} />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
