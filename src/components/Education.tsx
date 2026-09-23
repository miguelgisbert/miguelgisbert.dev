'use client';

import { useTranslations } from 'next-intl';

const items = [
  {
    key: 'sport',
    meta: "UA",
    icon: "/images/55fc0e333859ae0799cb2dcb709aaf59_400x400.jpeg",
    url: "https://web.ua.es/en/grados/grado-en-ciencias-de-la-actividad-fisica-y-del-deporte/undergraduate-degree-in-science-of-physical-activity-and-sports.html",
  },
  {
    key: 'cs',
    meta: "EPS, UA",
    icon: "/images/logo-eps.jpg",
    url: "https://eps.ua.es/en/",
  },
  {
    key: 'master',
    meta: "INEFC, UB",
    icon: "/images/inefc.png",
    url: "https://www.il3.ub.edu/master-tecnologia-deporte",
  },
  {
    key: 'startup',
    meta: "UV",
    icon: "/images/logo-uv.png",
    url: "https://www.uv.es/",
  },
]

const Education = () => {
  const t = useTranslations('Education');
  return (
    <section id="education" className="section">
      <div className="section__inner">
        <div className="section__header">
          <h2 className="section__title">{t('title')}</h2>
          <p className="section__subtitle">{t('subtitle')}</p>
        </div>
        <div className="edu-grid">
          {items.map((item) => (
            <a key={item.key} href={item.url} target="_blank" rel="noopener noreferrer" className="edu-item">
              <img src={item.icon} alt={t(`items.${item.key}`)} className="edu-item__icon" />
              <span className="edu-item__name">{t(`items.${item.key}`)}</span>
              <span className="edu-item__meta">{item.meta}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Education;
