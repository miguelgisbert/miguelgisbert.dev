'use client';

import { useTranslations } from 'next-intl';

const skillGroups = [
  {
    key: 'ai',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
      </svg>
    ),
    tags: [
      { key: 'rag', featured: true },
      { key: 'llm', featured: true },
      { key: 'vector', featured: true },
      { key: 'embeddings' },
      { key: 'prompt' },
      { key: 'apis' },
      { key: 'stt' },
    ],
  },
  {
    key: 'frontend',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
      </svg>
    ),
    tags: [
      { key: 'react', featured: true },
      { key: 'typescript', featured: true },
      { key: 'nextjs' },
      { key: 'reactnative' },
      { key: 'redux' },
      { key: 'css' },
    ],
  },
  {
    key: 'backend',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 3h13.5m-13.5 3h13.5M6 3h12a3 3 0 0 1 3 3v0a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v0a3 3 0 0 1 3-3Zm0 12h12a3 3 0 0 1 3 3v0a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v0a3 3 0 0 1 3-3Z" />
      </svg>
    ),
    tags: [
      { key: 'node', featured: true },
      { key: 'python', featured: true },
      { key: 'postgres' },
      { key: 'docker' },
      { key: 'cicd' },
      { key: 'rest' },
    ],
  },
]

const Skills = () => {
  const t = useTranslations('Skills');
  return (
    <section id="skills" className="section">
      <div className="section__inner">
        <div className="section__header">
          <h2 className="section__title">{t('title')}</h2>
          <p className="section__subtitle">{t('subtitle')}</p>
        </div>
        <div className="skills-grid">
          {skillGroups.map((group) => (
            <article key={group.key} className="skill-card">
              <div className="skill-card__header">
                <div className="skill-card__icon">{group.icon}</div>
                <h3 className="skill-card__title">{t(`groups.${group.key}.name`)}</h3>
              </div>
              <div className="skill-tags">
                {group.tags.map((tag) => (
                  <span key={tag.key} className={`skill-tag${tag.featured ? ' skill-tag--accent' : ''}`}>
                    {t(`groups.${group.key}.tags.${tag.key}`)}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
