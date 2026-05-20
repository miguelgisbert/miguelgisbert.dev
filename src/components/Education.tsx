import logoCAFD from "/src/assets/images/55fc0e333859ae0799cb2dcb709aaf59_400x400.jpeg"
import logoEPS from "/src/assets/images/logo-eps.jpg"
import logoInefc from "/src/assets/images/inefc.png"
import logoUV from "/src/assets/images/logo-uv.png"

const items = [
  {
    name: "Sport Science",
    meta: "UA",
    icon: logoCAFD,
    url: "https://web.ua.es/en/grados/grado-en-ciencias-de-la-actividad-fisica-y-del-deporte/undergraduate-degree-in-science-of-physical-activity-and-sports.html",
  },
  {
    name: "Computer Science Engineer",
    meta: "EPS, UA",
    icon: logoEPS,
    url: "https://eps.ua.es/en/",
  },
  {
    name: "Sports Technology Master's",
    meta: "INEfc, UB",
    icon: logoInefc,
    url: "https://www.il3.ub.edu/master-tecnologia-deporte",
  },
  {
    name: "Startup Management Postgraduate",
    meta: "UV",
    icon: logoUV,
    url: "https://www.uv.es/",
  },
]

const Education = () => (
  <section id="education" className="section">
    <div className="section__inner">
      <div className="section__header">
        <h2 className="section__title">Education</h2>
        <p className="section__subtitle">Academic background</p>
      </div>
      <div className="edu-grid">
        {items.map((item) => (
          <a key={item.name} href={item.url} target="_blank" rel="noopener noreferrer" className="edu-item">
            <img src={item.icon} alt={item.name} className="edu-item__icon" />
            <span className="edu-item__name">{item.name}</span>
            <span className="edu-item__meta">{item.meta}</span>
          </a>
        ))}
      </div>
    </div>
  </section>
)

export default Education
