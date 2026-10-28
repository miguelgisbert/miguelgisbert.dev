'use client';

import { useTranslations } from 'next-intl';
import { trackCtaClick } from '@/lib/analytics';

type CtaBandProps = {
  location?: 'cta_band' | 'cta_band_work';
};

const CtaBand = ({ location = 'cta_band' }: CtaBandProps) => {
  const t = useTranslations('Cta');
  return (
    <section className="section cta-band">
      <div className="section__inner">
        <div className="cta-band__inner">
          <div className="cta-band__text-block">
            <h2 className="cta-band__title">{t('title')}</h2>
            <p className="cta-band__text">{t('text')}</p>
          </div>
          <a
            href="#contact"
            className="btn btn--primary cta-band__button"
            onClick={() => trackCtaClick(location)}
          >
            {t('primary')}
          </a>
        </div>
      </div>
    </section>
  );
};

export default CtaBand;
