import { useAppState } from "../AppState";
import { useReveal } from "../hooks/useReveal";
import { ShieldIcon, ArrowRightIcon } from "../Icons";

export function Registry() {
  const { t } = useAppState();
  const { ref, visible } = useReveal<HTMLElement>();

  return (
    <section
      id="registry"
      data-scroll-anchor
      ref={ref}
      className={`section reveal ${visible ? "is-visible" : ""}`}
    >
      <div className="registry-wrap glass-card">
        <div className="registry-icon">
          <ShieldIcon size={32} />
        </div>
        <div className="section-heading">
          <div className="kicker">{t.registryKicker}</div>
          <h2>{t.registryTitle}</h2>
        </div>
        <p className="registry-desc">{t.registryDesc}</p>
        <div className="registry-ctas">
          <a href="https://registry.brainsait.org" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            {t.registryCta}
            <ArrowRightIcon />
          </a>
          <a href="https://verify.brainsait.org" target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
            {t.registryCtaSecondary}
          </a>
        </div>
      </div>
    </section>
  );
}