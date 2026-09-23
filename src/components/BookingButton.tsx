'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'

const SCHEDULING_URL =
  'https://calendar.google.com/calendar/appointments/schedules/AcZssZ3fWffqzzFDcc2AxewuR3nrgPMEcfIN178sAeKECd5Pu6G6U9gqqkUaHU03mlYJ1PYlZN2779cM?gv=true'

const BookingButton = () => {
  const t = useTranslations('Booking')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  return (
    <>
      <button type="button" className="booking-cta" onClick={() => setOpen(true)}>
        <span className="booking-cta__icon" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="4.5" width="18" height="16.5" rx="3" stroke="currentColor" strokeWidth="1.6" />
            <path d="M3 9h18M8 2.5v4M16 2.5v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </span>
        <span className="booking-cta__text">
          <strong>{t('bookCall')}</strong>
          <small>{t('duration')}</small>
        </span>
        <span className="booking-cta__arrow" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>

      {open && (
        <div
          className="booking-modal"
          role="dialog"
          aria-modal="true"
          aria-label={t('modalTitle')}
          onClick={() => setOpen(false)}
        >
          <div className="booking-modal__panel" onClick={(e) => e.stopPropagation()}>
            <div className="booking-modal__bar">
              <span className="booking-modal__title">{t('modalTitle')}</span>
              <button
                type="button"
                className="booking-modal__close"
                aria-label={t('close')}
                onClick={() => setOpen(false)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <iframe
              className="booking-modal__frame"
              src={SCHEDULING_URL}
              title={t('iframeTitle')}
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
        </div>
      )}
    </>
  )
}

export default BookingButton
