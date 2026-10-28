# email-outreach

Agent d'emails per a freelance. L'única font és **LinkedIn**: només publicacions
(`linkedin.com/posts/...` o `/feed/update/...`) que conten un email per enviar el CV.

## Criteris

Entra una publicació si:

- És un post de LinkedIn amb data `activity`/`ugcPost` de **com a màxim 14 dies**.
- Conté un **email real** (no `info@` genèric sense instrucció, no adreces inventades).
- Encaixa amb el perfil: React, Next.js, Node.js, TypeScript, JavaScript, full-stack,
  frontend, backend, software engineer/developer, Python, etc.
- No és un intern, pràctica, curs, conferència, esdeveniment, CV o oferta tancada.
- Si menciona moneda, només accepta **$**, **€**, **£/GBP** o **CHF** (fora ₹, ¥, ₽, INR, etc.).
- No és onsite/híbrid/presencial fora d'Alacant/València; la resta de llocs remots
  han de ser compatibles (Espanya/UE/UK/USA/Canadà/worldwide).

Prioritats:

- **Pendent** (enviament automàtic): freelance/contractor/autònom + remot + email amb
  instrucció de CV.
- **Revisió** (manual): stack i email correctes, però full-time, onsite, sense
  confirmació de freelance o sense instrucció explícita de CV.

## Horari

- **10:00** — cerca a LinkedIn (passada de 24 h + última setmana).
- **10:30** — envia els pendents (màxim 30/dia) amb el CV adjunt via Resend.
- El cron necessita l'ordinador encés.

## Ordres

```bash
npm run migrate          # schema + plantilles
npm run outreach:collect # només cerca (cron 10:00)
npm run outreach:dry     # cerca i prepara, no envia
npm run outreach         # cerca + envia
node tools/email-outreach/agent.js --no-collect  # només envia pendents (cron 10:30)
```

## Cerca

Cal `SERPER_API_KEY` (2.500 consultes gratis) i/o `TAVILY_API_KEY` (1.000/mes gratis).
El pla gratuït de Serper limita a 10 resultats per consulta; amb crèdits es pot pujar
`SERPER_NUM=100`. Tavily s'usa per a la passada de 24 h i com a reserva.

Pots afegir consultes pròpies amb `OUTREACH_SEARCH_QUERIES` (separades per `|`);
sempre han de començar per `site:linkedin.com/posts`.

## Proteccions

- Índex únic a `lower(contact_email)`: mai dos leads amb el mateix email.
- Supressió per adreça i per domini (també el domini de l'email); s'ha de respectar
  sempre, abans de crear el lead i abans d'enviar.
- Historial `sent_emails`: una adreça que ja ha rebut un CV no es torna a usar mai,
  encara que el lead s'esborre.
- Qualsevol error d'enviament associat al destinatari, i qualsevol `email.bounced`,
  `email.failed`, `email.complained` o `email.suppressed` del webhook de Resend,
  s'afegeix automàticament a la llista de supressió.
- URL única, `ON CONFLICT DO NOTHING`, cooldown de 30 dies per domini.
- Només s'envien els `pending`; els `review` no s'envien automàticament.
- Els leads esborrats queden dismissats (URL i email) i no tornen.
- Email només si apareix publicat al post; no es dedueixen adreces.

## Baixes i webhook

- L'enllaç de baixa és `https://miguelgisbert.dev/api/unsubscribe?token=...` i
  suporta `GET` i `POST` (one-click RFC 8058).
- Configura el webhook de Resend a
  `https://miguelgisbert.dev/api/resend/webhook` amb els events
  `email.bounced`, `email.failed`, `email.complained` i `email.suppressed`.
- Copia el secret del webhook a `RESEND_WEBHOOK_SECRET` (comença per `whsec_`).
- `PUBLIC_SITE_URL` permet canviar la URL base dels enllaços en desenvolupament.
