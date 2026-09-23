'use client';

import { useTranslations } from 'next-intl';

const steps = ['call', 'proposal', 'build', 'launch'];

const Process = () => {
  const t = useTranslations('Process');
  return (
    <section id="process" className="section">
      <div className="section__inner">
        <div className="section__header">
          <h2 className="section__title">{t('title')}</h2>
          <p className="section__subtitle">{t('subtitle')}</p>
        </div>
        <div className="process-grid">
          {steps.map((step, i) => (
            <article key={step} className="process-step">
              <span className="process-step__num">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="process-step__title">{t(`steps.${step}.title`)}</h3>
              <p className="process-step__text">{t(`steps.${step}.text`)}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;
