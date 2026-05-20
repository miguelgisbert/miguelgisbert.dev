# miguelgisbert.dev

Personal portfolio website built with React, TypeScript, and Vite.

## About

Software Engineer specialised in React, TypeScript, and Node.js with 8+ years of experience in full-stack development. Computer Science Engineer by the University of Alicante, also holding a Master's in Sports Technology and a Postgraduate in Startup Management.

### Experience

- **Freelance Software Engineer** (2025–Present) — React full-stack development for web and mobile projects
- **Frontend Developer, Video Stream Network S.L.** — React + C# full-stack on a video editing platform
- **React Frontend Developer, SDG Group** — React + Material UI for CaixaBank; unit testing, SOLID, Agile
- **Fullstack Developer, Bluecode** — PHP/Symfony, Python/Django backend; React/TypeScript frontend; Webflow, Flutter
- **Software Developer, Informática Ros** — Visual FoxPro and PHP development

## Tech Stack

- **Framework**: React 19 + TypeScript
- **Bundler**: Vite 5
- **UI**: MUI 6, custom CSS with custom properties
- **Fonts**: Inter, JetBrains Mono
- **Contact**: EmailJS
- **Deploy**: GitHub Pages (`gh-pages` branch)

## Development

```bash
npm install
npm run dev      # dev server at localhost:5173
npm run build    # typecheck + build + generate CNAME
npm run preview  # preview production build
```

## Deploy

The site is deployed to **GitHub Pages** with a custom domain (`miguelgisbert.dev`).

1. Make your changes and commit to `main`
2. Push to GitHub: `git push origin main`
3. Build and deploy:

```bash
npm run build
npm run deploy
```

The `deploy` script runs `gh-pages -d dist`, which pushes the contents of `dist/` to the `gh-pages` branch.

> `miguelgisbert.dev` points to `miguelgisbert.github.io` via a CNAME record. The `CNAME` file is generated automatically during `build` by `create-cname.cjs`.
