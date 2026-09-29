'use client';

import { useTranslations } from 'next-intl';
import TechIcon from './TechIcon';

const items = [
  { name: "Git", sprite: "git", url: "https://git-scm.com" },
  { name: "GitHub", sprite: "github", url: "https://github.com/miguelgisbert" },
  { name: "GitLab", sprite: "gitlab", url: "https://gitlab.com" },
  { name: "npm", sprite: "npm", url: "https://www.npmjs.com/~miguelgisbert" },
  { name: "Next.js", sprite: "nextjs", url: "https://nextjs.org" },
  { name: "Docker", sprite: "docker", url: "https://www.docker.com" },
  { name: "CI/CD", sprite: "githubactions", url: "https://github.com/features/actions" },
  { name: "Figma", sprite: "figma", url: "https://figma.com" },
];

const Tools = () => {
  const t = useTranslations('Tools');
  return (
    <section id="tools" className="section">
      <div className="section__inner">
        <div className="section__header">
          <h2 className="section__title">{t('title')}</h2>
        </div>
        <div className="tech-grid">
          {items.map((item) => (
            <a key={item.name} href={item.url} target="_blank" rel="noopener noreferrer" className="tech-item">
              <TechIcon icon={item.sprite} />
              <span className="tech-item__name">{item.name}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Tools;
