import cragXchangeImg from "/src/assets/images/cragXchange.png"
import bluecodeImg from "/src/assets/images/Screenshot-from-2022-12-10-18-34-15.png"
import lifonetImg from "/src/assets/images/lifonet.png"
import laiaBobeImg from "/src/assets/images/laiabobe.png"
import agrovoltImg from "/src/assets/images/agrovolt-mobile.png"
import legalPymeImg from "/src/assets/images/legalPyme.png"

const projects = [
  {
    name: "CragXchange",
    description: "Rock climbing sharing platform to connect climbers all over the world.",
    image: cragXchangeImg,
    url: "https://cragxchange.com/",
  },
  {
    name: "Bluecode",
    description: "Software development agency website showcasing services and portfolio work.",
    image: bluecodeImg,
    url: "https://wearebluecode.com/",
  },
  {
    name: "Lifonet",
    description: "Waste management platform to allow users open the container and track waste collection in real time.",
    image: lifonetImg,
    url: "https://lifonet.com/",
  },
  {
    name: "Laia Bobe",
    description: "Personal brand website for a professional coach.",
    image: laiaBobeImg,
    url: "https://laiabobe.com/",
  },
  {
    name: "Agrovolt",
    description: "Solar energy and agricultural technology platform for sustainable farming solutions.",
    image: agrovoltImg,
    url: "https://www.agrovolt.es/",
  },
  {
    name: "LegalPyme",
    description: "Legal services platform (web & mobile app) for small businesses with document management and working hours register.",
    image: legalPymeImg,
    url: "https://www.legalpyme.es/",
  },
]

const Portfolio = () => (
  <section id="portfolio" className="section">
    <div className="section__inner">
      <div className="section__header">
        <h2 className="section__title">Portfolio</h2>
        <p className="section__subtitle">Selected projects I've built</p>
      </div>
      <div className="project-grid">
        {projects.map((project) => (
          <a key={project.name} href={project.url} target="_blank" rel="noopener noreferrer" className="project-card">
            <div className="project-card__image">
              <img src={project.image} alt={project.name} loading="lazy" />
            </div>
            <div className="project-card__content">
              <h3 className="project-card__title">{project.name}</h3>
              <p className="project-card__description">{project.description}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  </section>
)

export default Portfolio
