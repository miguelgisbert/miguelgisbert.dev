'use client';

import { useTranslations } from 'next-intl';

const faqKeys = [
  'pricing',
  'usuk',
  'availability',
  'start',
  'codebase',
  'ai',
  'stack',
] as const;

const Faq = () => {
  const t = useTranslations('Faq');
  return (
    <section id="faq" className="section">
      <div className="section__inner">
        <div className="section__header">
          <h2 className="section__title">{t('title')}</h2>
          <p className="section__subtitle">{t('subtitle')}</p>
        </div>
        <div className="faq-list">
          {faqKeys.map((key, index) => (
            <details key={key} className="faq-item" name="faq" open={index === 0}>
              <summary className="faq-item__summary">
                <h3 className="faq-item__question">{t(`items.${key}.q`)}</h3>
                <svg
                  className="faq-item__chevron"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </summary>
              <p className="faq-item__answer">{t(`items.${key}.a`)}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Faq;
