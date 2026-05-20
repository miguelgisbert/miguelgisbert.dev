import gitLogo from "/src/assets/images/Git_icon.svg"
import githubLogo from "/src/assets/images/github.svg"
import gitlabLogo from "/src/assets/images/gitlab.png"
import npmLogo from "/src/assets/images/npm-logo.png"
import vercelLogo from "/src/assets/images/vercel.svg"
import supabaseLogo from "/src/assets/images/supabase.svg"
import figmaLogo from "/src/assets/images/figma.png"
import storybookLogo from "/src/assets/images/storybook.png"
import githubcopilotLogo from "/src/assets/images/github-copilot.png"

const items = [
  { name: "Git", icon: gitLogo, url: "https://git-scm.com" },
  { name: "GitHub", icon: githubLogo, url: "https://github.com/miguelgisbert" },
  { name: "GitLab", icon: gitlabLogo, url: "https://gitlab.com" },
  { name: "npm", icon: npmLogo, url: "https://www.npmjs.com/~miguelgisbert" },
  { name: "Vercel", icon: vercelLogo, url: "https://vercel.com" },
  { name: "Supabase", icon: supabaseLogo, url: "https://supabase.com" },
  { name: "Figma", icon: figmaLogo, url: "https://figma.com" },
  { name: "Storybook", icon: storybookLogo, url: "https://storybook.js.org" },
  { name: "Copilot", icon: githubcopilotLogo, url: "https://github.com/features/copilot" },
]

const Tools = () => (
  <section id="tools" className="section">
    <div className="section__inner">
      <div className="section__header">
        <h2 className="section__title">Tools</h2>
        <p className="section__subtitle">My daily development toolkit</p>
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
