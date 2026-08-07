const skillGroups = [
  {
    name: "AI & ML Integration",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
      </svg>
    ),
    tags: [
      { label: "RAG Pipelines", featured: true },
      { label: "LLM Integration", featured: true },
      { label: "Vector DBs (Chroma, PGVector)", featured: true },
      { label: "Text Embeddings" },
      { label: "Prompt Engineering" },
      { label: "OpenAI / Anthropic APIs" },
      { label: "STT Pipelines" },
    ],
  },
  {
    name: "Frontend & Mobile",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
      </svg>
    ),
    tags: [
      { label: "React", featured: true },
      { label: "TypeScript", featured: true },
      { label: "Next.js" },
      { label: "React Native" },
      { label: "Redux / Context API" },
      { label: "CSS & Design Systems" },
    ],
  },
  {
    name: "Backend & Infrastructure",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 3h13.5m-13.5 3h13.5M6 3h12a3 3 0 0 1 3 3v0a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v0a3 3 0 0 1 3-3Zm0 12h12a3 3 0 0 1 3 3v0a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v0a3 3 0 0 1 3-3Z" />
      </svg>
    ),
    tags: [
      { label: "Node.js", featured: true },
      { label: "Python (Django)", featured: true },
      { label: "PostgreSQL / MySQL" },
      { label: "Docker" },
      { label: "CI/CD Pipelines" },
      { label: "REST APIs" },
    ],
  },
]

const Skills = () => (
  <section id="skills" className="section">
    <div className="section__inner">
      <div className="section__header">
        <h2 className="section__title">Skills</h2>
        <p className="section__subtitle">Full-stack engineering with production-grade AI &amp; LLM pipelines</p>
      </div>
      <div className="skills-grid">
        {skillGroups.map((group) => (
          <article key={group.name} className="skill-card">
            <div className="skill-card__header">
              <div className="skill-card__icon">{group.icon}</div>
              <h3 className="skill-card__title">{group.name}</h3>
            </div>
            <div className="skill-tags">
              {group.tags.map((tag) => (
                <span key={tag.label} className={`skill-tag${tag.featured ? " skill-tag--accent" : ""}`}>
                  {tag.label}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
)

export default Skills
