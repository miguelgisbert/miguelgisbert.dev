'use client';

import { useTranslations } from 'next-intl';
import TechIcon from './TechIcon';

type Item = {
  name: string;
  url: string;
  sprite?: string;
  image?: { src: string; width: number; height: number };
};

const items: Item[] = [
  { name: "React", sprite: "react", url: "https://react.dev" },
  { name: "JavaScript", sprite: "javascript", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript" },
  { name: "TypeScript", sprite: "typescript", url: "https://typescriptlang.org" },
  { name: "React Native", image: { src: "/images/reactNative.webp", width: 144, height: 146 }, url: "https://reactnative.dev" },
  { name: "CSS", sprite: "css", url: "https://developer.mozilla.org/en-US/docs/Web/CSS" },
  { name: "Node.js", sprite: "node", url: "https://nodejs.org" },
  { name: "Python", image: { src: "/images/python.webp", width: 144, height: 143 }, url: "https://python.org" },
  { name: "PostgreSQL", sprite: "postgres", url: "https://www.postgresql.org" },
];

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
              {item.sprite ? (
                <TechIcon icon={item.sprite} />
              ) : (
                <img
                  src={item.image!.src}
                  alt=""
                  width={item.image!.width}
                  height={item.image!.height}
                  loading="lazy"
                  decoding="async"
                  className="tech-item__icon"
                />
              )}
              <span className="tech-item__name">{item.name}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Expertise;
