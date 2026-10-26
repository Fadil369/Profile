import { useAppState } from "../AppState";
import { useReveal } from "../hooks/useReveal";

export function Why() {
  const { t } = useAppState();
  const { ref, visible } = useReveal<HTMLElement>();

  return (
    <section id="why" data-scroll-anchor ref={ref} className={`section section--tint reveal ${visible ? "is-visible" : ""}`}>
      <div className="why">
        <div className="kicker">{t.whyKicker}</div>
        <h2 className="why-title">{t.whyTitle}</h2>
        <ol className="why-beats">
          {t.whyBeats.map((b, i) => (
            <li key={b.label} style={{ "--i": i } as React.CSSProperties}>
              <span className="why-num">0{i + 1}</span>
              <h3>{b.label}</h3>
              <p>{b.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
