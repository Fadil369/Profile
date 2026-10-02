import { useState } from 'react';
import type { Lang } from '../../workspace/content';
import { ARTICLES } from '../../workspace/content';
import type { ThemeName } from '../../workspace/content';
import { ArrowUpRight } from 'lucide-react';

interface WritingAppProps {
  lang: Lang;
  theme: ThemeName;
  quality?: 'low' | 'high';
  onClose: () => void;
}

export default function WritingApp({ lang, theme, quality = 'high', onClose }: WritingAppProps) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="writing-app" data-theme={theme} data-quality={quality}>
      <div className="app-header">
        <h1 className="app-title">
          <span className="app-title-icon">📖</span>
          <span className="app-title-text">{lang === 'ar' ? 'كتاباتي' : 'Writing'}</span>
        </h1>
      </div>

      <div className="app-content">
        <div className="writing-grid">
          {ARTICLES.map(article => {
            const selectedArticle = selected === article.slug;
            const timeToRead = Math.ceil(article.paragraphs.reduce((acc, p) => acc + p[lang].split(' ').length, 0) / 200);

            return (
              <article
                key={article.slug}
                className={`writing-card ${selectedArticle ? 'selected' : ''}`}
              >
                <div className="writing-header">
                  <h3 className="writing-title"><button type="button" aria-expanded={selectedArticle} onClick={() => setSelected(selectedArticle ? null : article.slug)}>{article.title[lang]}</button></h3>
                  <span className={`writing-external-icon ${selectedArticle ? 'hidden' : ''}`}>
                    <ArrowUpRight size={16} aria-hidden="true" />
                  </span>
                </div>

                <div className="writing-meta">
                  <div className="meta-item">
                    <span className="meta-icon">🏷️</span>
                    <span className="meta-text">{article.category[lang]}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-icon">⏱️</span>
                    <span className="meta-text">{timeToRead} {lang === 'ar' ? (timeToRead === 1 ? 'دقيقة' : 'دقائق') : 'min read'}</span>
                  </div>
                </div>

                <p className="writing-description">{article.description[lang]}</p>

                {selectedArticle && (
                  <div className="article-content">
                    <div className="article-body">
                      <span className="article-source">
                        {article.sourceLabel[lang]}
                      </span>
                      {article.paragraphs.map((paragraph, index) => (
                        <p key={index} className="article-paragraph">
                          {paragraph[lang]}
                        </p>
                      ))}
                    </div>

                    {article.sourceUrl && (
                      <a
                        href={article.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="article-cta-button"
                      >
                        <span className="cta-icon">→</span>
                        <span className="cta-text">
                          {lang === 'ar' ? 'اقرأ على المصدر' : 'Read on source'}
                        </span>
                        <ArrowUpRight size={14} aria-hidden="true" />
                      </a>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>

      <button className="close-button" onClick={onClose} aria-label={lang === 'ar' ? 'إغلاق النافذة' : 'Close window'}>
        ✕
      </button>
    </div>
  );
}