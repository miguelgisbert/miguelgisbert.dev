'use client';

import { useTranslations } from 'next-intl';

const items = [
  { name: "React", icon: "/images/react.svg", url: "https://react.dev" },
  { name: "JavaScript", icon: "/images/Unofficial_JavaScript_logo_2.svg", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript" },
  { name: "TypeScript", icon: "/images/Typescript_logo_2020.svg", url: "https://typescriptlang.org" },
  { name: "React Native", icon: "/images/reactNative.png", url: "https://reactnative.dev" },
  { name: "CSS", icon: "/images/Official_CSS_Logo.svg", url: "https://developer.mozilla.org/en-US/docs/Web/CSS" },
  { name: "Node.js", icon: "/images/nodedotjs.svg", url: "https://nodejs.org" },
  { name: "Python", icon: "/images/python.png", url: "https://python.org" },
  { name: "PostgreSQL", icon: "/images/postgresql.svg", url: "https://www.postgresql.org" },
]

const Expertise = () => {
  const t = useTranslations('Expertise');
  return (
    <section id="expertise" className="section">
      <div className="section__inner">
        <div className="section__header">
          <h2 className="section__title">{t('title')}</h2>
        </div>
        <div className="tech-grid">
          {items.map((item) => (
            <a key={item.name} href={item.url} target="_blank" rel="noopener noreferrer" className="tech-item">
              <img src={item.icon} alt={item.name} className="tech-item__icon" />
              <span className="tech-item__name">{item.name}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Expertise;
