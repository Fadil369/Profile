import { useAppState } from "../AppState";

export function Statement() {
  const { t } = useAppState();
  const isAr = t.statementLabel === "المشكلة";

  return (
    <section id="statement" data-scroll-anchor className="statement-section">
      <div className="statement-layer statement-layer--glow" />
      <div className="statement-inner">
        <div className="statement-label">{t.statementLabel}</div>

        <p className="statement-problem">{t.statementProblem}</p>

        <div className="statement-pivot">
          <span className="statement-pivot-line" />
          <span className="statement-pivot-text">
            {isAr ? "لكن الحل ليس في إضافة طبقات — بل في تغيير الأساس." : "But the answer isn't more layers — it's a different foundation."}
          </span>
        </div>

        <p className="statement-solution">{t.statementSolution}</p>

        <div className="statement-why">
          <div className="statement-why-col">
            <span className="statement-why-q">{isAr ? "لماذا هذا الحل؟" : "Why this solution?"}</span>
            <span className="statement-why-a">{t.statementWhyThis}</span>
          </div>
          <div className="statement-why-col">
            <span className="statement-why-q">{isAr ? "لماذا الآن؟" : "Why now?"}</span>
            <span className="statement-why-a">{t.statementWhyNow}</span>
          </div>
        </div>

        <p className="statement-why-why">{t.statementWhy}</p>
      </div>
    </section>
  );
}
