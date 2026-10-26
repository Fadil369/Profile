import { useAppState } from "../AppState";
import { useReveal } from "../hooks/useReveal";
import { ArrowRightIcon, BookIcon } from "../Icons";

const ORCID = "https://orcid.org/0009-0003-7485-3575";
const COMMONS = {
  en: "https://zenodo.org/records/23606022/files/The_Clinical_Commons_EN_v1.2.pdf?download=1",
  ar: "https://zenodo.org/records/23606022/files/The_Clinical_Commons_AR_v1.2.pdf?download=1",
  record: "https://doi.org/10.5281/zenodo.23606022"
};

export function Research() {
  const { t } = useAppState();
  const { ref, visible } = useReveal<HTMLElement>();

  return (
    <section id="research" data-scroll-anchor ref={ref} className={`section section--tint reveal ${visible ? "is-visible" : ""}`}>
      <div className="research">
        <div className="section-heading research-head">
          <div className="kicker">{t.researchKicker}</div>
          <h2>{t.researchTitle}</h2>
        </div>

        <article className="commons">
          <div className="commons-cover" aria-hidden="true">
            <BookIcon size={28} />
            <span>The Clinical Commons</span>
            <span lang="ar" dir="rtl">
              المشاع السريري
            </span>
          </div>
          <div className="commons-body">
            <div className="commons-tag">{t.commonsTag}</div>
            <h3>{t.commonsTitle}</h3>
            <p>{t.commonsDesc}</p>
            <p className="commons-status">{t.commonsStatus}</p>
            <div className="commons-actions">
              <a className="btn btn-primary" href={COMMONS.en} target="_blank" rel="noopener noreferrer">
                {t.commonsRead.en}
              </a>
              <a className="btn btn-secondary" href={COMMONS.ar} target="_blank" rel="noopener noreferrer" lang="ar">
                {t.commonsRead.ar}
              </a>
              <a className="btn-ghost-link" href={COMMONS.record} target="_blank" rel="noopener noreferrer" dir="ltr">
                10.5281/zenodo.23606022
              </a>
            </div>
          </div>
        </article>

        <div className="pubs">
          <div className="pubs-head">
            <h3>{t.publicationsTitle}</h3>
            <a href={ORCID} target="_blank" rel="noopener noreferrer" className="pubs-orcid">
              ORCID <ArrowRightIcon size={13} />
            </a>
          </div>
          <ol className="pubs-list" dir="ltr">
            {t.publications.map((p) => (
              <li key={p.url}>
                <span className="pubs-year">{p.year}</span>
                <a href={p.url} target="_blank" rel="noopener noreferrer">
                  {p.title}
                </a>
                <span className="pubs-venue">{p.venue}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
