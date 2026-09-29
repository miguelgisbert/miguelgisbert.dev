'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
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
            <Link key={project.key} href={`/work/${project.key}`} className="project-card">
              <div className="project-card__image">
                <img
                  src={project.image}
                  alt=""
                  width={project.width}
                  height={project.height}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="project-card__content">
                <h3 className="project-card__title">{project.name}</h3>
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
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
