import { useAppState } from "../AppState";
import { useReveal } from "../hooks/useReveal";
import {
  ArrowRightIcon,
  ShieldIcon,
  TargetIcon,
  CheckCircleIcon,
  ClockIcon,
  BrainIcon,
  CodeIcon,
  BriefcaseIcon,
} from "../Icons";

const ICON_MAP: Record<string, (p: { size: number }) => JSX.Element> = {
  Brain: BrainIcon,
  Code: CodeIcon,
  Briefcase: BriefcaseIcon,
  Shield: ShieldIcon,
  Target: TargetIcon,
  CheckCircle: CheckCircleIcon,
  Clock: ClockIcon,
};

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
          <div className="kicker">{t.servicesKicker}</div>
          <h2>{t.servicesTitle}</h2>
          <p className="section-subtitle">{t.servicesSubtitle}</p>
        </div>
        <div className="services-grid">
          {t.services.map((service, i) => {
            const Icon = ICON_MAP[service.icon] ?? TargetIcon;
            return (
              <div
                key={service.title}
                className="glass-card service-card"
                style={{ "--service-i": i } as React.CSSProperties}
              >
                <div className="service-icon">
                  <Icon size={28} />
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
                <a href="#registry" className="service-cta">
                  {t.heroCtaRegistry} <ArrowRightIcon size={14} />
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}