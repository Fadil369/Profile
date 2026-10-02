import { useState } from 'react';
import type { Lang } from '../../content';
import type { ThemeName } from '../../content';
import { PROFILE, BOOKING_URL, BOOKING_AVAILABLE, CONTACT_EMAIL } from '../../workspace/content';
import { BookOpen, Bot, Heart } from 'lucide-react';

interface AboutAppProps {
  lang: Lang;
  theme: ThemeName;
  quality?: 'low' | 'high';
  onClose: () => void;
}

export default function AboutApp({ lang, theme, quality = 'high', onClose }: AboutAppProps) {
  const [selectedPrinciple, setSelectedPrinciple] = useState<number>(0);

  const principles = PROFILE.principles;

  const heroGreeting = lang === 'ar'
    ? 'أنا د. فاضل'
    : "I'm Dr. Fadil";

  const heroRole = PROFILE.role;

  const bioParagraphs = PROFILE.bio;

  return (
    <div className="about-app" data-theme={theme} data-quality={quality}>
      <div className="about-hero">
        <div className="about-portrait">
          <div className="portrait-placeholder">
            <div className="portrait-graphic">
              <Bot size={32} aria-hidden="true" />
            </div>
          </div>
        </div>
        <div className="about-text">
          <h1 className="about-name">{heroGreeting}</h1>
          <p className="about-role">{(heroRole as any)}</p>
          <p className="about-tagline">{(PROFILE.tagline[lang] as any)}</p>
          <p className="about-intro">{(PROFILE.intro[lang] as any)}</p>
        </div>
      </div>

      <div className="about-content">
        <section className="about-section">
          <h3 className="section-title">
            <BookOpen size={20} aria-hidden="true" />
            {lang === 'ar' ? 'نبذة عني' : 'About'}
          </h3>
          <p className="section-subtitle">
            {lang === 'ar' ? getAboutSubtitle(lang) : getAboutSubtitle(lang)}
          </p>
          <div className="about-story">
            {bioParagraphs.map((paragraph, index) => (
              <p key={index} className="story-paragraph">
                {paragraph[lang]}
              </p>
            ))}
          </div>
        </section>

        <section className="about-section principles-section">
          <h3 className="section-title">
            <Heart size={20} aria-hidden="true" />
            {lang === 'ar' ? 'مبادئ عملي' : 'My Principles'}
          </h3>
          <p className="section-subtitle">
            {lang === 'ar'
              ? 'أسائل عملي من خلال التجربة، وأستجيب بالتقنية.'
              : 'My process questions experience. My response is technology.'}
          </p>

          <div className="principles-grid">
            {principles.map((principle, index) => (
              <button
                key={index}
                className={`principle-card ${index === selectedPrinciple ? 'active' : ''}`}
                onClick={() => setSelectedPrinciple(index)}
              >
                <div className="principle-header">
                  <div className="principle-number">{index + 1}</div>
                  <h4 className="principle-title">{principle.title[lang]}</h4>
                </div>
                <p className="principle-body">{principle.body[lang]}</p>
              </button>
            ))}
          </div>
        </section>

        <section className="about-section actions-section">
          <div className="actions-grid">
            {BOOKING_AVAILABLE && (
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="action-button primary-button"
              >
                <span className="button-text">
                  {lang === 'ar' ? 'احجز موعداً' : 'Book a meeting'}
                </span>
                <span className="button-icon">📅</span>
              </a>
            )}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="action-button secondary-button"
            >
              <span className="button-text">
                {lang === 'ar' ? 'تواصل عبر البريد' : 'Email me'}
              </span>
              <span className="button-icon">✉️</span>
            </a>
          </div>
        </section>
      </div>

      <button className="close-button" onClick={onClose} aria-label={lang === 'ar' ? 'إغلاق النافذة' : 'Close window'}>
        ✕
      </button>
    </div>
  );
}

function getAboutSubtitle(lang: Lang): string {
  return lang === 'ar'
    ? 'مدون من الطبيب، ومؤسس من الفاعل، وصانع من المستخدم'
    : 'Written by a physician, founded by an actor, built by a user';
}