import { useState } from 'react';
import type { Lang } from '../../content';
import type { ThemeName } from '../../content';
import { BOOKING_URL, BOOKING_AVAILABLE, CONTACT_EMAIL } from '../../workspace/content';
import { Mail, Calendar, MessageCircle, Briefcase, Mic, Network, ArrowUpRight } from 'lucide-react';

interface CollaborateAppProps {
  lang: Lang;
  theme: ThemeName;
  quality?: 'low' | 'high';
  onClose: () => void;
}

interface FormField {
  name: string;
  value: string;
  error?: boolean;
}

export default function CollaborateApp({ lang, theme, quality = 'high', onClose }: CollaborateAppProps) {
  const [activeSection, setActiveSection] = useState('advisory');
  const [formData, setFormData] = useState<Record<string, FormField>>({
    name: { name: 'name', value: '' },
    email: { name: 'email', value: '' },
    company: { name: 'company', value: '' },
    role: { name: 'role', value: '' },
    message: { name: 'message', value: '' },
  });

  const inquiryTypes = [
    {
      id: 'advisory',
      icon: <Mic size={20} aria-hidden="true" />,
      title: { ar: 'الاستشارات', en: 'Advisory' },
      description: { ar: 'استشارات استراتيجية للذكاء الاصطناعي الصحي', en: 'AI healthcare strategy consulting' },
      category: 'consult',
    },
    {
      id: 'workshop',
      icon: <MessageCircle size={20} aria-hidden="true" />,
      title: { ar: 'ورش عمل', en: 'Workshops' },
      description: { ar: 'ورش عمل وتدريب تنفيذي', en: 'Workshops and executive training' },
      category: 'workshop',
    },
    {
      id: 'speaking',
      icon: <Briefcase size={20} aria-hidden="true" />,
      title: { ar: 'الالقاءات', en: 'Speaking' },
      description: { ar: 'الالقاءات في المؤتمرات والفعاليات', en: 'Speaking at conferences and events' },
      category: 'speaking',
    },
    {
      id: 'collaboration',
      icon: <Network size={20} aria-hidden="true" />,
      title: { ar: 'التعاون', en: 'Collaboration' },
      description: { ar: 'شراكات منتجات وسير عمل', en: 'Product and workflow collaboration' },
      category: 'collab',
    },
  ];

  const handleInputChange = (fieldId: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: { ...prev[fieldId], value, error: false },
    }));
  };

  const handleSubmit = () => {
    const fields = ['name', 'email', 'message'];
    let hasError = false;

    fields.forEach(field => {
      if (formData[field].value.trim() === '') {
        setFormData(prev => ({
          ...prev,
          [field]: { ...prev[field], error: true },
        }));
        hasError = true;
      }
    });

    if (!hasError) {
      const subject = encodeURIComponent(`Website inquiry: ${activeSection}`);
      const body = encodeURIComponent(`${formData.message.value}\n\n${formData.name.value}\n${formData.email.value}\n${formData.company.value}`);
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    }
  };

  return (
    <div className="collaborate-app" data-theme={theme} data-quality={quality}>
      <div className="app-header">
        <h1 className="app-title">
          <span className="app-title-icon">🤝</span>
          <span className="app-title-text">{lang === 'ar' ? 'لنتعاون' : 'Collaborate'}</span>
        </h1>

        <p className="app-subtitle">
          {lang === 'ar'
            ? 'اختر مساراً، ثم املأ النموذج أو تواصل مباشرة'
            : 'Choose a path, then fill the form or contact directly'}
        </p>
      </div>

      <div className="app-content">
        <div className="section-tabs">
          {inquiryTypes.map(type => (
            <button
              key={type.id}
              className={`section-tab ${activeSection === type.id ? 'active' : ''}`}
              onClick={() => setActiveSection(type.id)}
            >
              <span className="tab-icon">{type.icon}</span>
              <span className="tab-label">{type.title[lang]}</span>
              <span className="tab-description">{type.description[lang]}</span>
            </button>
          ))}
        </div>

        <div className="collaborate-content">
          <div className="form-container">
            <form className="collaborate-form" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
              <div className="form-header">
                <h2 className="form-title">
                  {lang === 'ar'
                    ? `راسلني بسؤال حول ${inquiryTypes.find(t => t.id === activeSection)?.title[lang]}`
                    : `Reach out with a question about ${inquiryTypes.find(t => t.id === activeSection)?.title[lang]}`}
                </h2>
                <p className="form-intro">
                  {lang === 'ar'
                    ? 'يفتح النموذج مسودة في تطبيق البريد لديك. راجعها وأرسلها من هناك.'
                    : 'This opens a draft in your email app. Review and send it there.'}
                </p>
              </div>

              <div className="form-field-group">
                <label className="form-label" htmlFor="name">
                  {lang === 'ar' ? 'الاسم' : 'Your name'}
                </label>
                <input
                  required
                  autoComplete="name"
                  id="name"
                  type="text"
                  className={`form-input ${formData.name.error ? 'error' : ''}`}
                  placeholder={lang === 'ar' ? 'كيف يمكنني عليك' : 'How can I call you'}
                  value={formData.name.value}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  aria-invalid={formData.name.error}
                />
                {formData.name.error && (
                  <span className="form-error">
                    {lang === 'ar' ? 'الرجاء إدخال الاسم' : 'Please enter your name'}
                  </span>
                )}
              </div>

              <div className="form-field-group">
                <label className="form-label" htmlFor="email">
                  {lang === 'ar' ? 'البريد الإلكتروني' : 'Email address'}
                </label>
                <input
                  required
                  autoComplete="email"
                  id="email"
                  type="email"
                  className={`form-input ${formData.email.error ? 'error' : ''}`}
                  placeholder={lang === 'ar' ? 'example@email.com' : 'example@email.com'}
                  value={formData.email.value}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  aria-invalid={formData.email.error}
                />
                {formData.email.error && (
                  <span className="form-error">
                    {lang === 'ar' ? 'الرجاء إدخال بريد صحيح' : 'Please enter a valid email'}
                  </span>
                )}
              </div>

              <div className="form-field-group">
                <label className="form-label" htmlFor="company">
                  {lang === 'ar' ? 'المؤسسة (اختياري)' : 'Organization (optional)'}
                </label>
                <input
                  id="company"
                  type="text"
                  className="form-input"
                  placeholder={lang === 'ar' ? 'اسم المؤسسة' : 'Organization name'}
                  value={formData.company.value}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                />
              </div>

              <div className="form-field-group">
                <label className="form-label" htmlFor="message">
                  {lang === 'ar' ? 'الرسالة' : 'Your message'}
                </label>
                <textarea
                  required
                  id="message"
                  className={`form-input ${formData.message.error ? 'error' : ''}`}
                  rows={5}
                  placeholder={lang === 'ar'
                    ? 'اكتب رسالتك هنا...'
                    : 'Write your message here...'}
                  value={formData.message.value}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  aria-invalid={formData.message.error}
                />
                {formData.message.error && (
                  <span className="form-error">
                    {lang === 'ar' ? 'الرجاء كتابة رسالة' : 'Please write a message'}
                  </span>
                )}
              </div>

              <button
                type="submit"
                className="form-submit-button"
              >
                <span className="button-text">
                  {lang === 'ar' ? 'افتح مسودة بريد' : 'Open email draft'}
                </span>
                <span className="button-icon">
                  <ArrowUpRight size={16} aria-hidden="true" />
                </span>
              </button>
            </form>
          </div>

          <div className="alternative-contact">
            <h3 className="alternative-header">
              {lang === 'ar' ? 'أو اتصل مباشرة' : 'Or contact directly'}
            </h3>
            <div className="contact-options">
              {BOOKING_AVAILABLE && (
                <a
                  href={BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-link"
                >
                  <Calendar size={18} aria-hidden="true" />
                  <span className="contact-label">
                    {lang === 'ar' ? 'الحجز عبر Google Calendar' : 'Schedule via Google Calendar'}
                  </span>
                </a>
              )}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="contact-link"
              >
                <Mail size={18} aria-hidden="true" />
                <span className="contact-label">
                  {lang === 'ar' ? 'رسائل عبر البريد' : 'Email inquiries'}
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <button className="close-button" onClick={onClose} aria-label={lang === 'ar' ? 'إغلاق النافذة' : 'Close window'}>
        ✕
      </button>
    </div>
  );
}