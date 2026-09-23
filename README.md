# miguelgisbert.dev

Personal portfolio website built with Next.js (App Router), TypeScript and next-intl.

## About

Software Engineer specialised in React, TypeScript, and Node.js with 10+ years of experience in full-stack development. Computer Science Engineer by the University of Alicante, also holding a Master's in Sports Technology and a Postgraduate in Startup Management.

### Experience

- **Freelance Software Engineer** (2025–Present) — React full-stack development for web and mobile projects
- **Frontend Developer, Video Stream Network S.L.** — React + C# full-stack on a video editing platform
- **React Frontend Developer, SDG Group** — React + Material UI for CaixaBank; unit testing, SOLID, Agile
- **Fullstack Developer, Bluecode** — PHP/Symfony, Python/Django backend; React/TypeScript frontend; Webflow, Flutter
- **Software Developer, Informática Ros** — Visual FoxPro and PHP development

## Tech Stack

- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript
- **i18n**: next-intl (English, Spanish, Catalan) with locale-prefixed routes
- **UI**: MUI 6, custom CSS with custom properties
- **Fonts**: Inter
- **Contact**: EmailJS
- **Deploy**: Vercel

## Development

```bash
npm install
npm run dev      # dev server at localhost:3000
npm run build    # production build
npm run start    # serve the production build
npm run lint     # eslint
```

## Structure

```
src/
  app/[locale]/    # layout + page per locale (en, es, ca)
  components/      # UI sections
  i18n/            # next-intl routing/navigation/request config
  messages/        # en.json, es.json, ca.json
  proxy.ts         # locale detection & redirect
public/
  images/          # static assets
  og-image.png     # social sharing image
```

## Deploy

Deployed to **Vercel** with the custom domain `miguelgisbert.dev`.

1. Push to `main` — Vercel builds and deploys automatically (production).
2. Other branches generate preview deployments.
3. Configure the domain in the Vercel dashboard (Settings → Domains).
