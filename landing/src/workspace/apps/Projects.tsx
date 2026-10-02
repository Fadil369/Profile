import { useState } from 'react';
import type { Lang, Localized } from '../../workspace/content';
import type { ThemeName } from '../../workspace/content';
import { PROJECTS } from '../../workspace/content';
import { ArrowUpRight, RefreshCw, ExternalLink, Download, Box, Network, Book } from 'lucide-react';

interface ProjectsAppProps {
  lang: Lang;
  theme: ThemeName;
  quality?: 'low' | 'high';
  onClose: () => void;
}

type ProjectCategory = 'healthcare' | 'ai' | 'identity' | 'education' | 'creative';
const CATEGORIES: Array<{ type: ProjectCategory; label: Localized }> = [
  { type: 'healthcare', label: { ar: 'الرعاية الصحية', en: 'Healthcare' } },
  { type: 'ai', label: { ar: 'الذكاء الاصطناعي', en: 'AI' } },
  { type: 'identity', label: { ar: 'الهوية الرقمية', en: 'Identity' } },
  { type: 'education', label: { ar: 'التعليم', en: 'Education' } },
  { type: 'creative', label: { ar: 'إبداعي', en: 'Creative' } },
];

export default function ProjectsApp({ lang, theme, quality = 'high', onClose }: ProjectsAppProps) {
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory>('healthcare');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set());

  const filteredProjects = PROJECTS.filter(p => {
    const matchesCategory = p.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      p.name[lang].toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.summary[lang].toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const icons: Record<string, React.JSX.Element> = {
    RefreshCw: <RefreshCw />,
    ExternalLink: <ExternalLink />,
    Download: <Download />,
    Book: <Book />,
    Network: <Network />,
    Box: <Box />,
    ArrowUpRight: <ArrowUpRight />,
  };

  const categoryIcons: Record<ProjectCategory, React.JSX.Element> = {
    healthcare: <Box size={16} aria-hidden="true" />,
    ai: <RefreshCw size={16} aria-hidden="true" />,
    identity: <Network size={16} aria-hidden="true" />,
    education: <Book size={16} aria-hidden="true" />,
    creative: <Download size={16} aria-hidden="true" />,
  };

  const toggleExpand = (slug: string) => {
    setExpandedProjects(prev => {
      const next = new Set(prev);
      if (next.has(slug)) {
        next.delete(slug);
      } else {
        next.add(slug);
      }
      return next;
    });
  };

  return (
    <div className="projects-app" data-theme={theme} data-quality={quality}>
      <div className="app-header">
        <h1 className="app-title">
          <span className="app-title-icon">🚀</span>
          <span className="app-title-text">{lang === 'ar' ? 'مشاريعي' : 'Projects'}</span>
        </h1>

        <div className="search-container">
          <input
            type="search"
            className="search-input"
            placeholder={lang === 'ar' ? 'بحث... شارك، نهج، حالة' : 'Search... Share, approach, status'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label={lang === 'ar' ? 'بحث في المشاريع' : 'Search projects'}
          />
        </div>
      </div>

      <div className="app-content">
        <div className="category-tabs">
          {CATEGORIES.map(cat => (
            <button
              key={cat.type}
              className={`category-tab ${selectedCategory === cat.type ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.type)}
            >
              <span className="category-icon">{categoryIcons[cat.type]}</span>
              <span className="category-label">{cat.label[lang]}</span>
            </button>
          ))}
        </div>

        {filteredProjects.length === 0 ? (
          <div className="empty-state">
            <p className="empty-message">
              {lang === 'ar' ? 'لا توجد مشاريع في هذه الفئة' : 'No projects in this category'}
            </p>
          </div>
        ) : (
          <div className="projects-grid">
            {filteredProjects.map(project => {
              const isExpanded = expandedProjects.has(project.slug);
              const Icon = icons[project.slug] || <RefreshCw size={16} aria-hidden="true" />;

              return (
                <div key={project.slug} className="project-card">
                  <button type="button" className="project-header" aria-expanded={isExpanded} onClick={() => toggleExpand(project.slug)}>
                    <div className="project-icon">{Icon}</div>
                    <div className="project-info">
                      <h3 className="project-name">{project.name[lang]}</h3>
                      <p className="project-summary">{project.summary[lang]}</p>
                    </div>
                    <span className={`expand-icon ${isExpanded ? 'expanded' : 'collapsed'}`}>
                      {isExpanded ? '−' : '+'}
                    </span>
                  </button>

                  {isExpanded && (
                    <div className="project-details">
                      <div className="detail-section">
                        <h4 className="detail-label">
                          <ArrowUpRight size={14} aria-hidden="true" />
                          {lang === 'ar' ? 'المشكلة' : 'The Problem'}
                        </h4>
                        <p className="detail-text">{project.problem[lang]}</p>
                      </div>

                      <div className="detail-section">
                        <h4 className="detail-label">
                          <Network size={14} aria-hidden="true" />
                          {lang === 'ar' ? 'من يخدم' : 'Who It Serves'}
                        </h4>
                        <p className="detail-text">{project.audience[lang]}</p>
                      </div>

                      <div className="detail-section">
                        <h4 className="detail-label">
                          <Download size={14} aria-hidden="true" />
                          {lang === 'ar' ? 'مساهمتي' : 'What I Contributed'}
                        </h4>
                        <p className="detail-text">{project.contribution[lang]}</p>
                      </div>

                      <div className="detail-section">
                        <h4 className="detail-label">
                          <RefreshCw size={14} aria-hidden="true" />
                          {lang === 'ar' ? 'كيف يعمل الحل' : 'How It Works'}
                        </h4>
                        <p className="detail-text">{project.approach[lang]}</p>
                      </div>

                      <div className="detail-section status-section">
                        <h4 className="detail-label">
                          <ExternalLink size={14} aria-hidden="true" />
                          {lang === 'ar' ? 'الحالة' : 'Status'}
                        </h4>
                        <div className="status-badge status-active">
                          {project.status[lang]}
                        </div>
                      </div>

                      {project.url && (
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="project-cta-button"
                        >
                          <span className="cta-icon">→</span>
                          <span className="cta-text">{project.action[lang]}</span>
                          <ArrowUpRight size={14} aria-hidden="true" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <button className="close-button" onClick={onClose} aria-label={lang === 'ar' ? 'إغلاق النافذة' : 'Close window'}>
        ✕
      </button>
    </div>
  );
}