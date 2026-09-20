import { useReveal } from "../hooks/useReveal";
import { ArrowRightIcon, ShieldIcon, TargetIcon, CheckCircleIcon, ClockIcon } from "../Icons";

export function Services() {
  const { ref, visible } = useReveal<HTMLElement>();

  const services = [
    {
      icon: ShieldIcon,
      title: "OID Identity Layer",
      desc: "Every physician gets a verified identity — human-readable, machine-verifiable, and tied to their qualifications, role, and institution. The system knows who you are before you do anything.",
      features: ["Verified Identity", "Role-Based Access", "Institution Binding", "QR-Certified"],
    },
    {
      icon: TargetIcon,
      title: "Context-Aware Workflow",
      desc: "The system knows you're a cardiologist at a specific hospital. It surfaces the right tools, the right forms, the right coding — at the right moment. No more searching through ten systems.",
      features: ["Context-Aware", "Smart Surfacing", "Pre-Action Alerts", "Single Workspace"],
    },
    {
      icon: CheckCircleIcon,
      title: "Prevention Over Correction",
      desc: "The AI monitors for gaps before they become rejections. Missing documentation? The system flags it before you submit. Missing authorization? You're notified before the procedure. No surprise denials months later.",
      features: ["Gap Detection", "Pre-Submit Validation", "Authorization Alerts", "Real-Time Guardrails"],
    },
    {
      icon: ClockIcon,
      title: "Claims Protection",
      desc: "The system protects physicians from being blamed for system failures. When a claim is rejected, it traces the root cause — not the doctor. Documentation, coding, and authorization are handled intelligently.",
      features: ["Root Cause Analysis", "Liability Shield", "Audit Trail", "Rejection Forensics"],
    },
  ];

  return (
    <section
      id="services"
      data-scroll-anchor
      ref={ref}
      className={`section reveal ${visible ? "is-visible" : ""}`}
    >
      <div className="services-wrap">
        <div className="section-heading">
          <div className="kicker">The BPR Ecosystem</div>
          <h2>Provider Registry Infrastructure</h2>
          <p className="section-subtitle">
            Where the physician goes from user to operator — identity, verification, and intelligent workflow.
          </p>
        </div>
        <div className="services-grid">
          {services.map((service, i) => (
            <div
              key={service.title}
              className="glass-card service-card"
              style={{ "--service-i": i } as React.CSSProperties}
            >
              <div className="service-icon">
                <service.icon size={28} />
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
                Explore <ArrowRightIcon size={14} />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}