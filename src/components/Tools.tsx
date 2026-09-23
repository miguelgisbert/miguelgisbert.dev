'use client';

import { useTranslations } from 'next-intl';

const items = [
  { name: "Git", icon: "/images/git.svg", url: "https://git-scm.com" },
  { name: "GitHub", icon: "/images/github.svg", url: "https://github.com/miguelgisbert" },
  { name: "GitLab", icon: "/images/gitlab.svg", url: "https://gitlab.com" },
  { name: "npm", icon: "/images/npm.svg", url: "https://www.npmjs.com/~miguelgisbert" },
  { name: "Vercel", icon: "/images/vercel.svg", url: "https://vercel.com" },
  { name: "Next.js", icon: "/images/nextdotjs.svg", url: "https://nextjs.org" },
  { name: "Supabase", icon: "/images/supabase.svg", url: "https://supabase.com" },
  { name: "Docker", icon: "/images/docker.svg", url: "https://www.docker.com" },
  { name: "CI/CD", icon: "/images/githubactions.svg", url: "https://github.com/features/actions" },
  { name: "Figma", icon: "/images/figma.svg", url: "https://figma.com" },
  { name: "Storybook", icon: "/images/storybook.svg", url: "https://storybook.js.org" },
  { name: "OpenCode", icon: "/images/opencode.svg", url: "https://opencode.ai" },
  { name: "DeepSeek", icon: "/images/deepseek.svg", url: "https://www.deepseek.com" },
]

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
              <img src={item.icon} alt={item.name} className="tech-item__icon" />
              <span className="tech-item__name">{item.name}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Tools;
