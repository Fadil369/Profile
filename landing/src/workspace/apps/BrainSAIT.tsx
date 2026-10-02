import React, { useState } from 'react';
import type { Lang, Localized } from '../../workspace/content';
import type { ThemeName } from '../../workspace/content';
import { ArrowRight, GraduationCap, Code, Rocket, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';

interface BrainSAITAppProps {
  lang: Lang;
  theme: ThemeName;
  quality?: 'low' | 'high';
  onClose: () => void;
}

export default function BrainSAITApp({ lang, theme, quality = 'high', onClose }: BrainSAITAppProps) {
  const [currentStep, setCurrentStep] = useState<number>(0);

const steps: Array<{
    complete: boolean;
    number: number;
    title: Localized;
    subtitle: string;
    explored: string;
    link: string;
  }> = [
      {
        complete: true,
        number: 1,
        title: { ar: 'تعلّم', en: 'Learn' },
        subtitle: lang === 'ar'
          ? 'فهم العرض والمنصة'
          : 'Understand the landscape and platform',
        explored: lang === 'ar'
        ? 'تمعّنا في RAG ولغة ALLAM وسير العمل السريري'
        : 'Explored RAG and ALLAM language with clinical workflows',
      link: 'https://academy.brainsait.org/',
    },
    {
      complete: true,
      number: 2,
      title: { ar: 'ابنِ', en: 'Build' },
      subtitle: lang === 'ar'
        ? 'بني وحدات ذكاء اصطناعي'
        : 'Build AI units',
      explored: lang === 'ar'
        ? 'أطلق نموذجاً بقبض وحدات وكيل بسيطة'
        : 'Launched prototype with simple agent units',
      link: 'https://github.com/Fadil369',
    },
    {
      complete: lang === 'ar' ? false : true,
      number: 3,
      title: { ar: 'أطلق', en: 'Launch' },
      subtitle: lang === 'ar'
        ? 'نزّل إلى المستشفيات'
        : 'Deploy to hospitals',
      explored: lang === 'ar'
        ? 'نشر AKR0 وملفات ووكلاء'
        : 'Deployed AKR0 and workflow files and agents',
      link: '//',
    },
    {
      complete: false,
      number: 4,
      title: { ar: 'حسّن', en: 'Improve' },
      subtitle: lang === 'ar'
        ? 'راجع وطبّق التعلمات'
        : 'Review and apply feedback',
      explored: lang === 'ar'
        ? 'مراجعة نكات الحلول وإدخال التحسينات'
        : 'Reviewing solution hits and applying improvements',
      link: '//',
    },
    {
      complete: false,
      number: 5,
      title: { ar: 'توسّع', en: 'Scale' },
      subtitle: lang === 'ar'
        ? 'جيِّب الأنظمة المتوسطة والكبيرة'
        : 'Serve mid and large hospitals',
      explored: lang === 'ar'
        ? 'زرع ملفات مترابطة مع وكلاء شبكيين'
        : 'Deploying integrated files with networked agents',
      link: '//',
    },
  ];

const categories: Array<{
      icon: React.ReactNode;
      title: Localized;
      subtitle: Localized;
      url: string;
    }> = [
      {
        icon: <GraduationCap size={20} aria-hidden="true" />,
        title: { ar: 'BrainSAIT Academy', en: 'BrainSAIT Academy' },
        subtitle: { ar: 'دليل تعليمي عربي', en: 'Arabic learning guide' },
        url: 'https://academy.brainsait.org/',
      },
      {
        icon: <Code size={20} aria-hidden="true" />,
        title: { ar: 'LINC Agent Suite', en: 'LINC Agent Suite' },
        subtitle: { ar: 'وكلاء ذكاء اصطناعي سريريون', en: 'Clinical AI agents' },
        url: 'https://github.com/Fadil369/brainsait-linc-docs',
      },
      {
        icon: <Rocket size={20} aria-hidden="true" />,
        title: { ar: 'Healthcare Platform', en: 'Healthcare Platform' },
        subtitle: { ar: 'منصة الذكاء الاصطناعي للرعاية الصحية', en: 'AI healthcare platform' },
        url: 'https://brainsait.org/',
      },
    ];

  const jumpTo = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };

  const goTo = (direction: 'prev' | 'next') => {
    setCurrentStep(prev => {
      if (direction === 'next' && prev < steps.length - 1) return prev + 1;
      if (direction === 'prev' && prev > 0) return prev - 1;
      return prev;
    });
  };

  return (
    <div className="brainsait-app" data-theme={theme} data-quality={quality}>
      <div className="app-header">
        <h1 className="app-title">
          <span className="app-title-icon">🧠</span>
          <span className="app-title-text">{lang === 'ar' ? 'برين سايت' : 'BrainSAIT'}</span>
        </h1>
      </div>

      <div className="app-content">
        <div className="journey-section">
          <h2 className="section-title">
            <ArrowRight size={20} aria-hidden="true" />
            {lang === 'ar' ? 'رحلة التحول: من التعلم إلى التوسعة' : 'The Journey: From Learn to Scale'}
          </h2>

          <div className="journey-steps">
            {steps.map((step, index) => (
              <button
                key={step.number}
                className={`journey-step ${currentStep === index ? 'active' : ''} ${step.complete ? 'complete' : 'pending'}`}
                onClick={() => jumpTo(index)}
                aria-label={`${lang === 'ar' ? 'الخطوة' : 'Step'} ${step.number}: ${step.title[lang]}`}
              >
                <div className="step-number-wrapper">
                  <div className={`step-number ${step.complete ? 'complete' : ''}`}>
                    {step.complete ? <CheckCircle size={18} aria-hidden="true" /> : step.number}
                  </div>
                </div>
                <div className="step-content">
                  <h3 className="step-title">{step.title[lang]}</h3>
                  <p className="step-subtitle">{step.subtitle}</p>
                </div>
              </button>
            ))}
          </div>

          <div className="journey-detail">
            <div className="detail-header">
              <h3 className="detail-title">{steps[currentStep]?.title[lang]}</h3>
              <div className="detail-navigation">
                <button
                  className={`step-nav-button ${currentStep === 0 ? 'disabled' : ''}`}
                  onClick={() => goTo('prev')}
                  disabled={currentStep === 0}
                  aria-label={lang === 'ar' ? 'خطوة سابقة' : 'Previous step'}
                >
                  <ChevronLeft size={16} aria-hidden="true" />
                </button>
                <button
                  className={`step-nav-button ${currentStep === steps.length - 1 ? 'disabled' : ''}`}
                  onClick={() => goTo('next')}
                  disabled={currentStep === steps.length - 1}
                  aria-label={lang === 'ar' ? 'خطوة تالية' : 'Next step'}
                >
                  <ChevronRight size={16} aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="detail-body">
              <p className="detail-exploration">
                <span className="exploration-label">
                  {lang === 'ar' ? 'تم استكشافه:' : 'Explored:'}
                </span>
                {steps[currentStep]?.explored}
              </p>
            </div>

            {steps[currentStep]?.link && steps[currentStep]?.link !== '//' && (
              <a
                href={steps[currentStep]?.link}
                target="_blank"
                rel="noopener noreferrer"
                className="journey-cta-button"
              >
                <span className="cta-icon">→</span>
                <span className="cta-text">{lang === 'ar' ? 'استكشف الآن' : 'Explore Now'}</span>
                <ArrowRight size={14} aria-hidden="true" />
              </a>
            )}
          </div>
        </div>

        <div className="categories-section">
          <h2 className="section-title">
            <ArrowRight size={20} aria-hidden="true" />
            {lang === 'ar' ? 'مسارات التعلم والأداة' : 'Learning & Tool Paths'}
          </h2>

          <div className="categories-grid">
            {categories.map((cat, index) => (
              <a
                key={index}
                href={cat.url}
                target="_blank"
                rel="noopener noreferrer"
                className="category-card"
              >
                <div className="category-header">
                  <div className="category-icon">
                    {cat.icon}
                  </div>
                  <h3 className="category-title">{cat.title[lang]}</h3>
                </div>
                <p className="category-description">{cat.subtitle[lang]}</p>
              </a>
            ))}
          </div>
        </div>
      </div>

      <button className="close-button" onClick={onClose} aria-label={lang === 'ar' ? 'إغلاق النافذة' : 'Close window'}>
        ✕
      </button>
    </div>
  );
}