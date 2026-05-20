import SocialIcons from "./socialIcons"
import profileImg from "/src/assets/images/profile.png"

const GenericAppScreen = () => (
  <svg viewBox="0 0 390 844" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#64ffda" stopOpacity="0.18" />
        <stop offset="100%" stopColor="#64ffda" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#64ffda" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#64ffda" stopOpacity="0.1" />
      </linearGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
    </defs>

    <rect x="0" y="0" width="390" height="44" fill="#0a0a0a" />
    <text x="20" y="29" fill="#888" fontSize="14" fontFamily="Inter, sans-serif" fontWeight="600">9:41</text>
    <rect x="350" y="18" width="22" height="10" rx="3" fill="#555" />
    <rect x="330" y="20" width="14" height="6" rx="2" fill="#555" />
    <circle cx="335" cy="23" r="4" fill="#0a0a0a" />

    <rect x="0" y="44" width="390" height="36" fill="#0a0a0a" />
    <rect x="16" y="52" width="28" height="20" rx="6" fill="#64ffda" opacity="0.15" />
    <text x="19" y="66" fill="#64ffda" fontSize="10" fontFamily="Inter, sans-serif" fontWeight="700">G</text>
    <text x="52" y="67" fill="#fafafa" fontSize="13" fontFamily="Inter, sans-serif" fontWeight="700">GrowthMetrics</text>
    <circle cx="355" cy="62" r="10" fill="#1a1a1a" stroke="#2a2a2a" strokeWidth="1" />
    <text x="349" y="67" fill="#888" fontSize="9" fontFamily="Inter, sans-serif">🔔</text>

    <rect x="16" y="96" width="358" height="48" rx="12" fill="#111" stroke="#2a2a2a" strokeWidth="1" />
    <rect x="28" y="106" width="20" height="20" rx="6" fill="#64ffda" opacity="0.1" />
    <rect x="32" y="110" width="12" height="12" rx="3" fill="#64ffda" />
    <text x="56" y="120" fill="#fafafa" fontSize="12" fontFamily="Inter, sans-serif" fontWeight="600">Overview</text>
    <text x="56" y="134" fill="#555" fontSize="9" fontFamily="Inter, sans-serif">All metrics from last 30 days</text>
    <text x="320" y="126" fill="#64ffda" fontSize="11" fontFamily="Inter, sans-serif" fontWeight="700">+23%</text>

    <rect x="16" y="156" width="112" height="76" rx="12" fill="#111" stroke="#2a2a2a" strokeWidth="1" />
    <text x="28" y="176" fill="#888" fontSize="9" fontFamily="Inter, sans-serif">Revenue</text>
    <text x="28" y="204" fill="#fafafa" fontSize="20" fontFamily="Inter, sans-serif" fontWeight="700">$12.4k</text>
    <rect x="88" y="194" width="28" height="16" rx="4" fill="#64ffda" opacity="0.1" />
    <text x="92" y="206" fill="#64ffda" fontSize="8" fontFamily="Inter, sans-serif" fontWeight="600">+8%</text>

    <rect x="139" y="156" width="112" height="76" rx="12" fill="#111" stroke="#2a2a2a" strokeWidth="1" />
    <text x="151" y="176" fill="#888" fontSize="9" fontFamily="Inter, sans-serif">Users</text>
    <text x="151" y="204" fill="#fafafa" fontSize="20" fontFamily="Inter, sans-serif" fontWeight="700">2,847</text>
    <rect x="211" y="194" width="28" height="16" rx="4" fill="#64ffda" opacity="0.1" />
    <text x="215" y="206" fill="#64ffda" fontSize="8" fontFamily="Inter, sans-serif" fontWeight="600">+12%</text>

    <rect x="262" y="156" width="112" height="76" rx="12" fill="#111" stroke="#2a2a2a" strokeWidth="1" />
    <text x="274" y="176" fill="#888" fontSize="9" fontFamily="Inter, sans-serif">Conversion</text>
    <text x="274" y="204" fill="#fafafa" fontSize="20" fontFamily="Inter, sans-serif" fontWeight="700">3.2%</text>
    <rect x="334" y="194" width="28" height="16" rx="4" fill="#64ffda" opacity="0.1" />
    <text x="338" y="206" fill="#64ffda" fontSize="8" fontFamily="Inter, sans-serif" fontWeight="600">+0.4</text>

    <rect x="16" y="248" width="358" height="176" rx="14" fill="#111" stroke="#2a2a2a" strokeWidth="1" />
    <text x="30" y="272" fill="#fafafa" fontSize="12" fontFamily="Inter, sans-serif" fontWeight="600">Monthly Growth</text>
    <text x="300" y="272" fill="#555" fontSize="9" fontFamily="Inter, sans-serif">+41% vs last month</text>
    <line x1="30" y1="400" x2="358" y2="400" stroke="#2a2a2a" strokeWidth="1" />
    <line x1="30" y1="370" x2="358" y2="370" stroke="#2a2a2a" strokeWidth="0.5" strokeDasharray="3" />
    <line x1="30" y1="340" x2="358" y2="340" stroke="#2a2a2a" strokeWidth="0.5" strokeDasharray="3" />
    <line x1="30" y1="310" x2="358" y2="310" stroke="#2a2a2a" strokeWidth="0.5" strokeDasharray="3" />
    <line x1="30" y1="280" x2="358" y2="280" stroke="#2a2a2a" strokeWidth="0.5" strokeDasharray="3" />
    <text x="18" y="404" fill="#555" fontSize="8" fontFamily="Inter, sans-serif">0</text>
    <text x="14" y="374" fill="#555" fontSize="8" fontFamily="Inter, sans-serif">25</text>
    <text x="14" y="344" fill="#555" fontSize="8" fontFamily="Inter, sans-serif">50</text>
    <text x="14" y="314" fill="#555" fontSize="8" fontFamily="Inter, sans-serif">75</text>
    <text x="14" y="284" fill="#555" fontSize="8" fontFamily="Inter, sans-serif">100</text>
    <polyline points="44,395 74,370 104,385 134,350 164,365 194,310 224,325 254,280 284,295 314,265 344,275" fill="none" stroke="#64ffda" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" filter="url(#glow)" />
    <polygon points="44,395 74,370 104,385 134,350 164,365 194,310 224,325 254,280 284,295 314,265 344,275 344,400 44,400" fill="url(#areaFill)" />
    <circle cx="314" cy="265" r="4" fill="#fafafa" filter="url(#glow)" />
    <circle cx="314" cy="265" r="7" fill="#64ffda" opacity="0.25" />
    <text x="44" y="418" fill="#555" fontSize="8" fontFamily="Inter, sans-serif">Jan</text>
    <text x="104" y="418" fill="#555" fontSize="8" fontFamily="Inter, sans-serif">Feb</text>
    <text x="164" y="418" fill="#555" fontSize="8" fontFamily="Inter, sans-serif">Mar</text>
    <text x="224" y="418" fill="#555" fontSize="8" fontFamily="Inter, sans-serif">Apr</text>
    <text x="284" y="418" fill="#555" fontSize="8" fontFamily="Inter, sans-serif">May</text>
    <text x="344" y="418" fill="#555" fontSize="8" fontFamily="Inter, sans-serif">Jun</text>

    <rect x="16" y="444" width="172" height="120" rx="14" fill="#111" stroke="#2a2a2a" strokeWidth="1" />
    <text x="28" y="466" fill="#888" fontSize="9" fontFamily="Inter, sans-serif" fontWeight="600">TRAFFIC SOURCES</text>
    <rect x="28" y="478" width="10" height="10" rx="3" fill="#64ffda" opacity="0.6" />
    <text x="44" y="488" fill="#ccc" fontSize="10" fontFamily="Inter, sans-serif">Organic</text>
    <text x="160" y="488" fill="#fafafa" fontSize="10" fontFamily="Inter, sans-serif" fontWeight="600">45%</text>
    <rect x="28" y="498" width="10" height="10" rx="3" fill="#64ffda" opacity="0.35" />
    <text x="44" y="508" fill="#ccc" fontSize="10" fontFamily="Inter, sans-serif">Referral</text>
    <text x="160" y="508" fill="#fafafa" fontSize="10" fontFamily="Inter, sans-serif" fontWeight="600">30%</text>
    <rect x="28" y="518" width="10" height="10" rx="3" fill="#64ffda" opacity="0.15" />
    <text x="44" y="528" fill="#ccc" fontSize="10" fontFamily="Inter, sans-serif">Direct</text>
    <text x="160" y="528" fill="#fafafa" fontSize="10" fontFamily="Inter, sans-serif" fontWeight="600">25%</text>

    <rect x="202" y="444" width="172" height="120" rx="14" fill="#111" stroke="#2a2a2a" strokeWidth="1" />
    <text x="214" y="466" fill="#888" fontSize="9" fontFamily="Inter, sans-serif" fontWeight="600">CHANNEL PERFORMANCE</text>
    <rect x="214" y="478" width="146" height="10" rx="3" fill="#1a1a1a" />
    <rect x="214" y="478" width="66" height="10" rx="3" fill="url(#barGrad)" />
    <text x="214" y="500" fill="#888" fontSize="8" fontFamily="Inter, sans-serif">Social</text>
    <rect x="214" y="508" width="146" height="10" rx="3" fill="#1a1a1a" />
    <rect x="214" y="508" width="44" height="10" rx="3" fill="url(#barGrad)" />
    <text x="214" y="530" fill="#888" fontSize="8" fontFamily="Inter, sans-serif">Email</text>
    <rect x="214" y="536" width="146" height="10" rx="3" fill="#1a1a1a" />
    <rect x="214" y="536" width="102" height="10" rx="3" fill="url(#barGrad)" />
    <text x="214" y="558" fill="#888" fontSize="8" fontFamily="Inter, sans-serif">Paid Ads</text>

    <rect x="16" y="580" width="358" height="100" rx="14" fill="#111" stroke="#2a2a2a" strokeWidth="1" />
    <text x="28" y="602" fill="#888" fontSize="9" fontFamily="Inter, sans-serif" fontWeight="600">TOP PAGES</text>
    <rect x="28" y="612" width="8" height="8" rx="2" fill="#64ffda" opacity="0.5" />
    <text x="42" y="621" fill="#ccc" fontSize="10" fontFamily="Inter, sans-serif">/pricing</text>
    <text x="290" y="621" fill="#888" fontSize="10" fontFamily="Inter, sans-serif">1,234</text>
    <rect x="330" y="617" width="32" height="12" rx="3" fill="#64ffda" opacity="0.1" />
    <text x="336" y="626" fill="#64ffda" fontSize="7" fontFamily="Inter, sans-serif" fontWeight="600">+12%</text>
    <rect x="28" y="632" width="8" height="8" rx="2" fill="#64ffda" opacity="0.35" />
    <text x="42" y="641" fill="#ccc" fontSize="10" fontFamily="Inter, sans-serif">/features</text>
    <text x="290" y="641" fill="#888" fontSize="10" fontFamily="Inter, sans-serif">987</text>
    <rect x="330" y="637" width="32" height="12" rx="3" fill="#64ffda" opacity="0.1" />
    <text x="336" y="646" fill="#64ffda" fontSize="7" fontFamily="Inter, sans-serif" fontWeight="600">+5%</text>
    <rect x="28" y="652" width="8" height="8" rx="2" fill="#64ffda" opacity="0.15" />
    <text x="42" y="661" fill="#ccc" fontSize="10" fontFamily="Inter, sans-serif">/blog</text>
    <text x="290" y="661" fill="#888" fontSize="10" fontFamily="Inter, sans-serif">654</text>
    <rect x="330" y="657" width="32" height="12" rx="3" fill="#64ffda" opacity="0.05" />
    <text x="336" y="666" fill="#555" fontSize="7" fontFamily="Inter, sans-serif" fontWeight="600">-2%</text>

    <rect x="16" y="696" width="358" height="1" fill="#1a1a1a" />
    <circle cx="30" cy="706" r="3" fill="#333" />
    <circle cx="50" cy="706" r="3" fill="#333" />
    <circle cx="70" cy="706" r="3" fill="#333" />
    <rect x="160" y="700" width="70" height="14" rx="7" fill="#1a1a1a" />

    <rect x="0" y="790" width="390" height="54" fill="#0a0a0a" />
    <line x1="0" y1="790" x2="390" y2="790" stroke="#1a1a1a" strokeWidth="1" />
    <rect x="36" y="808" width="20" height="20" rx="5" fill="#333" />
    <rect x="41" y="813" width="10" height="10" rx="2" fill="#555" />
    <rect x="110" y="808" width="20" height="20" rx="5" fill="#333" />
    <rect x="115" y="813" width="10" height="10" rx="2" fill="#555" />
    <rect x="185" y="805" width="20" height="20" rx="6" fill="#64ffda" opacity="0.15" />
    <rect x="191" y="809" width="8" height="12" rx="2" fill="#64ffda" />
    <rect x="260" y="808" width="20" height="20" rx="5" fill="#333" />
    <rect x="265" y="813" width="10" height="10" rx="2" fill="#555" />
    <rect x="334" y="808" width="20" height="20" rx="5" fill="#333" />
    <rect x="339" y="813" width="10" height="10" rx="2" fill="#555" />
  </svg>
)

const Main = () => (
  <section id="main" className="hero">
    <div className="hero__inner">
      <div className="hero__content">
        <div className="hero__intro">
          <div className="hero__avatar-frame">
            <img src={profileImg} alt="Miguel Gisbert" className="hero__avatar" />
          </div>
          <div>
            <h1 className="hero__title">
              Miguel <span className="accent">Gisbert</span>
            </h1>
            <p className="hero__subtitle">Software Engineer &middot; Frontend Focus</p>
          </div>
        </div>
        <p className="hero__description">
          Fullstack developer specialised in React, TypeScript, and Node.js.
          I build high-performance web and mobile applications with clean, scalable code.
        </p>
        <div className="hero__actions">
          <a href="#portfolio" className="btn btn--primary">View my work</a>
          <a href="#contact" className="btn btn--outline">Get in touch</a>
          <a href="/CVMiguelGisbert.pdf" target="_blank" rel="noopener noreferrer" className="btn btn--outline">Download CV</a>
        </div>
        <div className="hero__socials" style={{ display: 'flex', gap: 12 }}>
          <SocialIcons format="main" />
        </div>
      </div>
      <div className="hero__visual">
        <div className="phone-mockup">
          <div className="phone-notch" />
          <div className="phone-screen">
            <GenericAppScreen />
          </div>
          <div className="phone-home-indicator" />
        </div>
      </div>
    </div>
  </section>
)

export default Main
