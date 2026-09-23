'use client';

import { useTranslations } from 'next-intl';

const projects = [
  {
    key: 'cragxchange',
    name: "CragXchange",
    image: "/images/cragXchange.png",
    url: "https://cragxchange.com/",
  },
  {
    key: 'bluecode',
    name: "Bluecode",
    image: "/images/Screenshot-from-2022-12-10-18-34-15.png",
    url: "https://wearebluecode.com/",
  },
  {
    key: 'lifonet',
    name: "Lifonet",
    image: "/images/lifonet.png",
    url: "https://lifonet.com/",
  },
  {
    key: 'laiabobe',
    name: "Laia Bobe",
    image: "/images/laiabobe.png",
    url: "https://laiabobe.com/",
  },
  {
    key: 'agrovolt',
    name: "Agrovolt",
    image: "/images/agrovolt-mobile.png",
    url: "https://www.agrovolt.es/",
  },
  {
    key: 'legalpyme',
    name: "LegalPyme",
    image: "/images/legalPyme.png",
    url: "https://www.legalpyme.es/",
  },
]

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
            <a key={project.key} href={project.url} target="_blank" rel="noopener noreferrer" className="project-card">
              <div className="project-card__image">
                <img src={project.image} alt={project.name} loading="lazy" />
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
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
