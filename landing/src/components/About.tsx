import { useAppState } from "../AppState";
import { useReveal } from "../hooks/useReveal";
import { ShieldIcon } from "../Icons";

export function About() {
  const { t } = useAppState();
  const { ref, visible } = useReveal<HTMLElement>();

  return (
    <section
      id="about"
      data-scroll-anchor
      ref={ref}
      className={`section reveal ${visible ? "is-visible" : ""}`}
    >
      <div className="about-grid about-grid--story">
        <div className="about-copy">
          <div className="kicker">{t.aboutKicker}</div>
          <p className="about-story about-story--first">
            <strong>أنا الدكتور محمد الفاضل.</strong>
            <br />
            طبيب. ومؤسس برينسايت.
          </p>
          <p className="about-story">
            قبل أن أتحدث عن الذكاء الاصطناعي، أو الأنظمة الصحية، أو مستقبل عمل الأطباء…
            <br />
            أريد أن أوضح شيئًا مهمًا:
          </p>
          <p className="about-story">
            أنا لا أتحدث عن هذه الأشياء من خلف مكتب بعيد عن المستشفى.
            <br />
            ولا من شاشة تعرض أرقامًا جميلة في عرض تقديمي.
            <br />
            <strong>أنا أتحدث عنها من داخل التجربة.</strong>
          </p>
          <p className="about-story about-story--highlight">
            من المناوبات. من الطوارئ. من القلق. من التعب. من ضغط المرضى.
            <br />
            من الملفات. من أنظمة المستشفيات. من المطالبات.
            <br />
            ومن تلك اللحظة التي ينتهي فيها يوم الطبيب… لكن العمل لا ينتهي.
          </p>
          <p className="about-story">
            ثم جاءت كوفيد-19.
            <br />
            كوفيد لم يكن مجرد أزمة صحية — كان اختبار ضغط كامل لكل الأنظمة الصحية في العالم.
            <br />
            <strong>وفي وسط كل ذلك… كان الطبيب في الصف الأول.</strong>
          </p>
          <p className="about-story">
            إذا كان الطبيب هو من يقف في الخط الأول عند أصعب الأزمات…
            <br />
            فلماذا لا تكون التقنية مبنية حوله؟
            <br />
            <strong>لماذا نطلب منه أن يتكيف دائمًا مع أنظمة لم تُصمم له؟</strong>
          </p>
          <p className="about-story about-story--cta">
            من هنا بدأت رؤية برينسايت.
            <br />
            <strong>نظام يعمل حول الطبيب — ليس الطبيب حول النظام.</strong>
          </p>
        </div>
        <div className="about-visual">
          <div className="glass-card about-hero-card">
            <div className="about-hero-badge">
              <ShieldIcon size={32} />
              <span className="about-hero-label">BPR Ecosystem</span>
            </div>
            <h2 className="about-hero-title">من الطبيب المستخدم للنظام</h2>
            <h3 className="about-hero-subtitle">
              إلى الطبيب الذي يُشغّل النظام
            </h3>
            <div className="about-hero-divider" />
            <p className="about-hero-desc">
              هوية رقمية موثوقة. صلاحيات قابلة للتحقق. أدوات تظهر حسب السياق.
              <br />
              ذكاء اصطناعي يراقب النقص قبل أن يتحول إلى رفض.
              <br />
              أنظمة تتحدث مع بعضها بدل أن يكون الطبيب هو الجسر البشري بينها.
            </p>
            <a href="#registry" className="btn btn-primary">
              Explore Registry
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
