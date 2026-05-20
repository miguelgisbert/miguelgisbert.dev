import pythonLogo from "/src/assets/images/python.png"
import reactNativeLogo from "/src/assets/images/reactNative.png"
import reactLogo from "/src/assets/images/react.svg"
import javascriptLogo from "/src/assets/images/Unofficial_JavaScript_logo_2.svg"
import typescriptLogo from "/src/assets/images/Typescript_logo_2020.svg"
import cssLogo from "/src/assets/images/Official_CSS_Logo.svg"
import nodejsLogo from "/src/assets/images/nodedotjs.svg"

const items = [
  { name: "React", icon: reactLogo, url: "https://react.dev" },
  { name: "JavaScript", icon: javascriptLogo, url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript" },
  { name: "TypeScript", icon: typescriptLogo, url: "https://typescriptlang.org" },
  { name: "React Native", icon: reactNativeLogo, url: "https://reactnative.dev" },
  { name: "CSS", icon: cssLogo, url: "https://developer.mozilla.org/en-US/docs/Web/CSS" },
  { name: "Node.js", icon: nodejsLogo, url: "https://nodejs.org" },
  { name: "Python", icon: pythonLogo, url: "https://python.org" },
]

const Expertise = () => (
  <section id="expertise" className="section">
    <div className="section__inner">
      <div className="section__header">
        <h2 className="section__title">Expertise</h2>
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

export default Expertise
