import { track } from '@vercel/analytics/react'

type CtaLocation = 'hero' | 'cta_band' | 'cta_band_work' | 'floating'

export const trackCtaClick = (location: CtaLocation) => {
  track('cta_click', { location })
}

export const trackBookingOpen = () => {
  track('booking_open')
}

export const trackBookingSuccess = () => {
  track('booking_success')
}

export const trackContactForm = (status: 'success' | 'error') => {
  track('contact_form', { status })
}

export const trackCvDownload = (location: string) => {
  track('cv_download', { location })
}

export const trackEmailClick = (location: string) => {
  track('email_click', { location })
}
