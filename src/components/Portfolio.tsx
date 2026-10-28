'use client';

import { useTranslations } from 'next-intl';
import { projects } from '@/content/projects';

const Portfolio = () => {
  const t = useTranslations('Portfolio');
  return (
    <section id="portfolio" className="section">
      <div className="section__inner">
        <div className="section__header">
          <h2 className="section__title">{t('title')}</h2>
          <p className="section__subtitle">{t('subtitle')}</p>
        </div>
        <div className="project-grid">
          {projects.map((project) => (
            <a
              key={project.key}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="project-card"
            >
              <div className="project-card__image">
                <img
                  src={project.image}
                  srcSet={project.imageSrcSet}
                  sizes="(max-width: 760px) calc(100vw - 48px), 460px"
                  alt=""
                  width={project.width}
                  height={project.height}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="project-card__content">
                <h3 className="project-card__title">
                  {project.name}
                  <svg
                    className="project-card__external"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </h3>
                <p className="project-card__description">{t(`projects.${project.key}.description`)}</p>
                <p className="project-card__highlight">{t(`projects.${project.key}.result`)}</p>
                <div className="project-card__meta">
                  <div className="project-card__meta-row">
                    <span className="project-card__meta-label">{t('roleLabel')}</span>
                    <span className="project-card__meta-value">{t(`projects.${project.key}.role`)}</span>
                  </div>
                  <div className="project-card__meta-row">
                    <span className="project-card__meta-label">{t('stackLabel')}</span>
                    <span className="project-card__meta-value">{t(`projects.${project.key}.stack`)}</span>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
