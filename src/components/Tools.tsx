import gitLogo from "/src/assets/images/git.svg"
import githubLogo from "/src/assets/images/github.svg"
import gitlabLogo from "/src/assets/images/gitlab.svg"
import npmLogo from "/src/assets/images/npm.svg"
import vercelLogo from "/src/assets/images/vercel.svg"
import nextjsLogo from "/src/assets/images/nextdotjs.svg"
import supabaseLogo from "/src/assets/images/supabase.svg"
import dockerLogo from "/src/assets/images/docker.svg"
import figmaLogo from "/src/assets/images/figma.svg"
import storybookLogo from "/src/assets/images/storybook.svg"
import opencodeLogo from "/src/assets/images/opencode.svg"
import deepseekLogo from "/src/assets/images/deepseek.svg"

const items = [
  { name: "Git", icon: gitLogo, url: "https://git-scm.com" },
  { name: "GitHub", icon: githubLogo, url: "https://github.com/miguelgisbert" },
  { name: "GitLab", icon: gitlabLogo, url: "https://gitlab.com" },
  { name: "npm", icon: npmLogo, url: "https://www.npmjs.com/~miguelgisbert" },
  { name: "Vercel", icon: vercelLogo, url: "https://vercel.com" },
  { name: "Next.js", icon: nextjsLogo, url: "https://nextjs.org" },
  { name: "Supabase", icon: supabaseLogo, url: "https://supabase.com" },
  { name: "Docker", icon: dockerLogo, url: "https://www.docker.com" },
  { name: "Figma", icon: figmaLogo, url: "https://figma.com" },
  { name: "Storybook", icon: storybookLogo, url: "https://storybook.js.org" },
  { name: "OpenCode", icon: opencodeLogo, url: "https://opencode.ai" },
  { name: "DeepSeek", icon: deepseekLogo, url: "https://www.deepseek.com" },
]

const Tools = () => (
  <section id="tools" className="section">
    <div className="section__inner">
      <div className="section__header">
        <h2 className="section__title">Tools</h2>
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
)

export default Tools
