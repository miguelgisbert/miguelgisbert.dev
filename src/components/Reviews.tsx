import { useState } from "react"

const LINKEDIN_URL = "https://www.linkedin.com/services/page/0541253132b95bb342/"

const reviews = [
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
]

function Stars({ rating }: { rating: number }) {
  const full = Math.floor(rating)
  return (
    <span className="review-card__stars" aria-label={`${rating} out of 5 stars`}>
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

const ReviewCard = ({ review }: { review: (typeof reviews)[number] }) => {
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
            <span className="review-card__badge" aria-label="1er">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="12" fill="#0a66c2" />
                <path d="M12 6l1.24 3.92L17 9.97l-3.06 2.57L15.09 17 12 14.31 8.91 17l1.15-4.46L7 9.97l3.76-.05L12 6z" fill="#fff" />
              </svg>
            </span>
            <span className="review-card__degree">· 1er</span>
          </div>
          <p className="review-card__title">{review.title}</p>
          <p className="review-card__service">Recomendó el servicio: <strong>{review.service}</strong></p>
        </div>
      </div>
      <div className="review-card__rating-row">
        <Stars rating={review.rating} />
        <span className="review-card__rating-text">{review.rating.toFixed(1).replace(".", ",")} ·</span>
        <span className="review-card__date">{review.date}</span>
      </div>
      <p className="review-card__text">{review.text}</p>
      <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="review-card__linkedin">
        <LinkedInIcon />
        Ver en LinkedIn
      </a>
    </article>
  )
}

const Reviews = () => (
  <section id="reviews" className="section">
    <div className="section__inner">
      <div className="section__header">
        <h2 className="section__title">Reviews</h2>
        <p className="section__subtitle">What people say on LinkedIn</p>
      </div>
      <div className="reviews-grid">
        {reviews.map((review) => (
          <ReviewCard key={review.name} review={review} />
        ))}
      </div>
    </div>
  </section>
)

export default Reviews
