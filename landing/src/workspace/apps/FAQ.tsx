import { useState } from 'react';
import type { Lang } from '../../content';
import type { ThemeName } from '../../content';
import { FAQ } from '../../workspace/content';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

interface FAQAppProps {
  lang: Lang;
  theme: ThemeName;
  quality?: 'low' | 'high';
  onClose: () => void;
}

export default function FAQApp({ lang, theme, quality = 'high', onClose }: FAQAppProps) {
  const [expanded, setExpanded] = useState<number>(0);

  return (
    <div className="faq-app" data-theme={theme} data-quality={quality}>
      <div className="app-header">
        <h1 className="app-title">
          <span className="app-title-icon">❓</span>
          <span className="app-title-text">{lang === 'ar' ? 'عن عملي' : 'About my work'}</span>
        </h1>
      </div>

      <div className="app-content">
        <div className="faq-list">
          {FAQ.map((item, index) => (
            <div
              key={index}
              className={`faq-item ${expanded === index ? 'expanded' : ''}`}
            >
              <button type="button" className="faq-header" onClick={() => setExpanded(expanded === index ? -1 : index)} aria-expanded={expanded === index}>
                <span className="faq-question">
                  <HelpCircle size={16} aria-hidden="true" />
                  {item.question[lang]}
                </span>
                <span className={`faq-icon ${expanded === index ? 'expanded' : ''}`}>
                  {expanded === index ? <ChevronUp size={14} aria-hidden="true" /> : <ChevronDown size={14} aria-hidden="true" />}
                </span>
              </button>
              <div className="faq-answer" hidden={expanded !== index}>
                <p className="answer-text">{item.answer[lang]}</p>
                <a
                  href={`/${lang}/${item.app}`}
                  className={`answer-cta ${item.app === 'contact' ? 'contact' : ''}`}
                >
                  <span className="cta-text">{getCtaText(item.app, lang)}</span>
                  <span className="cta-icon">
                    {expanded === index ? <ChevronDown size={12} aria-hidden="true" /> : <ChevronUp size={12} aria-hidden="true" />}
                  </span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button className="close-button" onClick={onClose} aria-label={lang === 'ar' ? 'إغلاق النافذة' : 'Close window'}>
        ✕
      </button>
    </div>
  );
}

function getCtaText(app: string, lang: Lang): string {
  const labels = {
    about: lang === 'ar' ? 'اقرأ المزيد' : 'Read more',
    projects: lang === 'ar' ? 'استكشف' : 'Explore',
    contact: lang === 'ar' ? 'لنتعاون الآن' : 'Collaborate now',
    writing: lang === 'ar' ? 'اقرأ الكتابات' : 'Read writings',
  };
  return labels[app as keyof typeof labels] || '';
}