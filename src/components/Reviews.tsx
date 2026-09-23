'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"
import { useTranslations } from "next-intl"

const MAX_TEXT_LINES = 10

const LINKEDIN_URL = "https://www.linkedin.com/services/page/0541253132b95bb342/"

type Review = {
  name: string
  photo?: string
  title: string
  rating?: number
  date: string
  service?: string
  context?: string
  verified?: boolean
  text: string
}

const reviews: Review[] = [
  {
    name: "Francisco Javier Francoso López",
    photo: "https://media.licdn.com/dms/image/v2/D4D03AQGutDAC7WQxXw/profile-displayphoto-scale_100_100/B4DZolYdfWG8Ag-/0/1761563761247?e=1783555200&v=beta&t=GlA3lOL7LHJdUjmaiAEhQ5WgpkATUhlVtkW7Yxkumh4",
    title: "Director General | Operaciones y grandes eventos | P&L, escalado ×3,9 y EBITDA 28% | UEFA · Vuelta España · Live Nation",
    rating: 5.0,
    date: "15 de junio de 2026",
    service: "Desarrollo de software personalizado",
    text: "Trabajar con Miguel en el desarrollo de LegalPyme ha sido una experiencia muy positiva. Más allá de sus conocimientos técnicos, destacaría su capacidad para entender las necesidades del negocio y transformarlas en soluciones prácticas y funcionales. Durante todo el proyecto ha demostrado compromiso, flexibilidad y una gran orientación a resultados. Gracias, Miguel, por tu implicación y profesionalidad durante todo este camino.",
  },
  {
    name: "Sergio Alcántara Segura",
    photo: "https://media.licdn.com/dms/image/v2/D4E03AQF9LNOqDK_CSg/profile-displayphoto-scale_100_100/B4EZ0R2TA3HUAc-/0/1774120941948?e=1783555200&v=beta&t=ZBhmbA0xw_sbhTRq4BzTlgs-JZSvh1QW6mc7zHnJlpw",
    title: "Smart City Expert",
    rating: 4.8,
    date: "22 de mayo de 2025",
    service: "Desarrollo de software personalizado",
    text: "Seriedad y profesionalidad.",
  },
  {
    name: "Andrea Requena Rubio",
    title: "Ingeniera de Diseño industrial | Diseño de proyectos de redes FTTH | Diseño gráfico, UI, 3D | Ilustración",
    rating: 5.0,
    date: "9 de agosto de 2026",
    context: "Andrea trabajó con Miguel en el mismo equipo",
    text: "He tenido la oportunidad de trabajar conjuntamente con Miguel en un proyecto en el que se encarga de todo el desarrollo de una plataforma web, incluyendo funcionalidades más complejas como un mapa interactivo, creación y gestión de perfiles, registros, directorio de miembros, entre otras. Además, también hace muy buen trabajo en lo que respecta a la optimización y adaptación del diseño de la interfaz, consiguiendo una experiencia de usuario mucho más intuitiva, fluida y eficiente.\nComo parte del proyecto, también se encarga de desarrollar las aplicaciones móviles para Android e iOS.\n\nAdemás de sus conocimientos técnicos, también destacaría su forma de trabajar, es una persona resolutiva, ingeniosa, comprometida y muy trabajadora. Siempre busca soluciones ante los problemas y es capaz de encontrar alternativas prácticas en situaciones complejas.\n\nLa experiencia trabajando con él ha sido buenísima y, sin duda, le recomendaría para cualquier proyecto que requiera de capacidad técnica, iniciativa y compromiso.",
  },
  {
    name: "Laia Bobé",
    verified: true,
    title: "Especialista en intel·ligència emocional i comunicació empàtica per al benestar. Coach ontològica. Acompanyo persones individualment, centres educatius (alumnat, professorat i famílies) empreses i entitats.",
    rating: 5.0,
    date: "27 de junio de 2026",
    context: "Laia fue cliente de Miguel",
    text: "He tingut el privilegi de treballar amb en Miguel en la creació de la meva pàgina web professional (www.laiabobe.com) i no podria estar més satisfeta amb el resultat.\n\nDes del primer moment va saber entendre l'essència del meu projecte i captar allò que volia transmetre amb la meva marca personal. Per a mi era molt important que la web reflectís qui soc i la meva manera de treballar, i en Miguel ho va aconseguir amb escreix.\n\nAl llarg de tot el procés ha destacat per la seva professionalitat, la seva capacitat d'escolta i la seva implicació. No es va limitar a desenvolupar una web, sinó que va aportar idees, va cuidar cada detall i va tenir una gran predisposició a fer els ajustos necessaris fins que el resultat encaixés plenament amb el que tenia al cap. En tot moment m'he sentit escoltada, acompanyada i ben assessorada.\n\nEl resultat final no és només una web ben dissenyada i funcional, sinó una web amb la qual em sento plenament representada.\n\nRecomano en Miguel a qualsevol persona o empresa que busqui un professional rigorós, creatiu, compromès i amb una gran qualitat humana. Si algun dia torno a necessitar desenvolupar un projecte web, no tindré cap dubte a tornar a comptar amb ell. Ha estat un autèntic plaer treballar amb ell.",
  },
]

function Stars({ rating }: { rating: number }) {
  const t = useTranslations('Reviews')
  const full = Math.floor(rating)
  return (
    <span className="review-card__stars" aria-label={t('starsLabel', { rating })}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} width="20" height="20" viewBox="0 0 24 24" fill={i < full ? "#f5a623" : "#3d3d3d"}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </span>
  )
}

const LinkedInIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05a3.75 3.75 0 0 1 3.38-1.86c3.61 0 4.28 2.38 4.28 5.47v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.1 20.45H3.57V9H7.1v11.45zM22.22 0H1.78C.8 0 0 .77 0 1.73v20.54C0 23.23.8 24 1.78 24h20.44c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
  </svg>
)

const VerifiedIcon = () => {
  const t = useTranslations('Reviews')
  return (
    <span className="review-card__verified" aria-label={t('verified')}>
    <svg width="14" height="14" viewBox="0 0 24 24">
      <path d="M12 1l2.4 2.1 3.1-.5.9 3 2.9 1.2-1.2 2.9 1.2 2.9-2.9 1.2-.9 3-3.1-.5L12 23l-2.4-2.1-3.1.5-.9-3L2.7 17l1.2-2.9L2.7 11.2l2.9-1.2.9-3 3.1.5L12 1z" fill="#e7a33e" />
      <path d="M10.6 15.4l-2.9-2.9 1.1-1.1 1.8 1.8 4.4-4.4 1.1 1.1-5.5 5.5z" fill="#fff" />
    </svg>
  </span>
  )
}

const ReviewText = ({ text }: { text: string }) => {
  const t = useTranslations('Reviews')
  const [expanded, setExpanded] = useState(false)
  const [overflowing, setOverflowing] = useState(false)
  const ref = useRef<HTMLParagraphElement>(null)

  const measure = useCallback(() => {
    const el = ref.current
    if (!el) return
    const clamped = el.classList.contains("review-card__text--clamped")
    if (clamped) el.classList.remove("review-card__text--clamped")
    const full = el.scrollHeight
    const lineHeight = parseFloat(getComputedStyle(el).lineHeight) || 0
    if (clamped) el.classList.add("review-card__text--clamped")
    setOverflowing(full > lineHeight * MAX_TEXT_LINES + 1)
  }, [])

  useLayoutEffect(() => {
    measure()
  }, [measure, text])

  useEffect(() => {
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [measure])

  return (
    <div className="review-card__text-block">
      <p ref={ref} className={`review-card__text${expanded ? "" : " review-card__text--clamped"}`}>
        {text}
      </p>
      {overflowing && (
        <button type="button" className="review-card__more" onClick={() => setExpanded((v) => !v)}>
          {expanded ? t('readLess') : t('readMore')}
        </button>
      )}
    </div>
  )
}

const ReviewCard = ({ review }: { review: Review }) => {
  const t = useTranslations('Reviews')
  const [imgError, setImgError] = useState(false)

  return (
    <article className="review-card">
      <div className="review-card__header">
        <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="review-card__avatar-link">
          {review.photo && !imgError ? (
            <img
              src={review.photo}
              alt={review.name}
              className="review-card__avatar-img"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="review-card__avatar-fallback" aria-hidden="true">
              {review.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
            </div>
          )}
        </a>
        <div className="review-card__info">
          <div className="review-card__name-row">
            <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="review-card__name-link">
              <h3 className="review-card__name">{review.name}</h3>
            </a>
            {review.verified && <VerifiedIcon />}
            <span className="review-card__badge" aria-label="1er">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="12" fill="#0a66c2" />
                <path d="M12 6l1.24 3.92L17 9.97l-3.06 2.57L15.09 17 12 14.31 8.91 17l1.15-4.46L7 9.97l3.76-.05L12 6z" fill="#fff" />
              </svg>
            </span>
            <span className="review-card__degree">· 1er</span>
          </div>
          <p className="review-card__title">{review.title}</p>
          <div className="review-card__meta">
            {review.service && (
              <p className="review-card__service">{t('recommendedService')} <strong>{review.service}</strong></p>
            )}
            {review.context && <p className="review-card__service">{review.context}</p>}
          </div>
        </div>
      </div>
      <div className="review-card__rating-row">
        {review.rating != null && (
          <>
            <Stars rating={review.rating} />
            <span className="review-card__rating-text">{review.rating.toFixed(1).replace(".", ",")} ·</span>
          </>
        )}
        <span className="review-card__date">{review.date}</span>
      </div>
      <ReviewText text={review.text} />
      <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="review-card__linkedin">
        <LinkedInIcon />
        {t('viewOnLinkedIn')}
      </a>
    </article>
  )
}

const Reviews = () => {
  const t = useTranslations('Reviews')
  return (
    <section id="reviews" className="section">
      <div className="section__inner">
        <div className="section__header">
          <h2 className="section__title">{t('title')}</h2>
          <p className="section__subtitle">{t('subtitle')}</p>
        </div>
        <div className="reviews-grid">
          {reviews.map((review) => (
            <ReviewCard key={review.name} review={review} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Reviews
