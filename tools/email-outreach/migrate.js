#!/usr/bin/env node
/**
 * Migració de la DB de l'outreach (Neon/Postgres) + seed de plantilles.
 * Ús: npm run migrate   (idempotent: IF NOT EXISTS + ON CONFLICT DO NOTHING)
 */
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

function loadEnv() {
  try {
    const txt = readFileSync(join(ROOT, '.env'), 'utf8');
    for (const line of txt.split('\n')) {
      const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && m[2] && !(m[1] in process.env)) {
        process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
      }
    }
  } catch {}
}
loadEnv();

const { getSql, closeSql } = await import('./lib/db.js');

const SCHEMA = `
CREATE TABLE IF NOT EXISTS suppression (
  id          serial PRIMARY KEY,
  email       text,
  domain      text,
  reason      text NOT NULL DEFAULT 'manual',
  source      text NOT NULL DEFAULT 'admin',
  created_at  timestamptz NOT NULL DEFAULT now(),
  CHECK (email IS NOT NULL OR domain IS NOT NULL)
);
CREATE UNIQUE INDEX IF NOT EXISTS suppression_email_uniq ON suppression (lower(email)) WHERE email IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS suppression_domain_uniq ON suppression (lower(domain)) WHERE domain IS NOT NULL;

CREATE TABLE IF NOT EXISTS targets (
  id            serial PRIMARY KEY,
  company       text NOT NULL,
  domain        text,
  website       text,
  contact_email text,
  contact_name  text,
  segment       text NOT NULL DEFAULT 'enterprise',
  notes         text,
  ats_type      text,
  ats_slug      text,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS leads (
  id            serial PRIMARY KEY,
  url           text NOT NULL UNIQUE,
  title         text NOT NULL,
  company       text,
  domain        text,
  location      text,
  country       text,
  source        text,
  segment       text NOT NULL DEFAULT 'enterprise',
  lang          text NOT NULL DEFAULT 'en',
  score         int NOT NULL DEFAULT 0,
  description   text,
  contact_email text,
  email_method  text,
  employment_type text,
  status        text NOT NULL DEFAULT 'no_email',
  subject       text,
  body          text,
  resend_id     text,
  error         text,
  published_at  timestamptz,
  sent_at       timestamptz,
  created_at    timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE leads ADD COLUMN IF NOT EXISTS employment_type text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS published_at timestamptz;
CREATE INDEX IF NOT EXISTS leads_status_idx ON leads (status);
CREATE UNIQUE INDEX IF NOT EXISTS leads_contact_email_uniq ON leads (lower(contact_email)) WHERE contact_email IS NOT NULL;
CREATE INDEX IF NOT EXISTS leads_domain_idx ON leads (lower(domain));
CREATE INDEX IF NOT EXISTS leads_sent_at_idx ON leads (sent_at);

CREATE TABLE IF NOT EXISTS dismissed_leads (
  url        text PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS dismissed_emails (
  email      text PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sent_emails (
  id         serial PRIMARY KEY,
  email      text NOT NULL,
  domain     text,
  lead_id    int,
  resend_id  text,
  subject    text,
  sent_at    timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS sent_emails_email_uniq ON sent_emails (lower(email));
CREATE INDEX IF NOT EXISTS sent_emails_domain_idx ON sent_emails (lower(domain));

CREATE TABLE IF NOT EXISTS templates (
  id         serial PRIMARY KEY,
  key        text NOT NULL UNIQUE,
  segment    text NOT NULL,
  lang       text NOT NULL,
  subject    text NOT NULL,
  body       text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);
`;

const UNSUB = '{unsubscribe_url}';

const TEMPLATES = [
  {
    key: 'startup_es',
    segment: 'startup',
    lang: 'es',
    subject: 'Freelance full-stack (React/Node) para {company}',
    body: `{greeting}

He visto la oferta de {job_title} ({job_url}) y encaja con lo que hago: desarrollo full-stack freelance con React, TypeScript y Node.js.

Soy Miguel, ingeniero full-stack con más de 10 años construyendo productos web y móviles para startups. Trabajo en remoto desde Alicante, España, con solapamiento completo con el Reino Unido y más de 4 horas con US-East. Proyecto reciente: PlegoHR, plataforma completa de RRHH con React y Supabase (https://plegohr.vercel.app).

Puedo enviarte una propuesta corta o hacer una llamada de 30 minutos esta semana, sin compromiso.

Te adjunto mi CV; tienes toda mi información en https://miguelgisbert.dev

Si no encaja, usa este enlace y no volveré a escribirte: ${UNSUB}

{signature}`,
  },
  {
    key: 'startup_en',
    segment: 'startup',
    lang: 'en',
    subject: 'Freelance full-stack (React/Node) for {company}',
    body: `{greeting}

I came across your post about {job_title} ({job_url}) and it lines up with what I do: freelance full-stack development with React, TypeScript and Node.js.

I'm Miguel, a full-stack engineer with 10+ years building web and mobile products for startups. I work remotely from Alicante, Spain, with full-day overlap with the UK and 4h+ with US-East. Recent project: PlegoHR, a full HR platform built with React and Supabase (https://plegohr.vercel.app).

Happy to send a short proposal or jump on a 30-minute call this week — no commitment either way.

I've attached my CV; everything else is at https://miguelgisbert.dev

If it's not relevant, use this link and I won't write again: ${UNSUB}

{signature}`,
  },
  {
    key: 'agency_es',
    segment: 'agency',
    lang: 'es',
    subject: 'Colaboración freelance React/Node con {company}',
    body: `{greeting}

Les escribo porque {company} puede necesitar capacidad extra de desarrollo full-stack. Vi la oferta de {job_title} ({job_url}) y me encaja directamente.

Soy Miguel, ingeniero full-stack con más de 10 años de experiencia (React, TypeScript, Node.js, PostgreSQL). Trabajo en remoto desde Alicante, España, con disponibilidad para subcontratos y colaboraciones por proyecto, con facturación autónomo y NIF europeo.

Puedo incorporarme con poca fricción y adaptarme a vuestro proceso y stack. Adjunto mi CV y os dejo mi portfolio en https://miguelgisbert.dev

Si no es de interés, use este enlace y no volveré a contactarles: ${UNSUB}

{signature}`,
  },
  {
    key: 'agency_en',
    segment: 'agency',
    lang: 'en',
    subject: 'React/Node freelance capacity for {company}',
    body: `{greeting}

I'm reaching out because {company} may need extra full-stack development capacity. I saw your post about {job_title} ({job_url}) and it fits my profile directly.

I'm Miguel, a full-stack engineer with 10+ years of experience (React, TypeScript, Node.js, PostgreSQL). I work remotely from Alicante, Spain, and I'm available for subcontracting and project-based work, invoicing as a sole trader with EU paperwork sorted.

I can join your team with little friction and adapt to your process and stack. My CV is attached and my portfolio is at https://miguelgisbert.dev

If it's not a fit, use this link and I won't reach out again: ${UNSUB}

{signature}`,
  },
  {
    key: 'enterprise_es',
    segment: 'enterprise',
    lang: 'es',
    subject: 'Perfil freelance full-stack (React/Node) — {company}',
    body: `{greeting}

Me dirijo a ustedes por la oferta de {job_title} ({job_url}). Dispongo de un perfil full-stack freelance que puede encajar con el puesto.

Soy Miguel Gisbert, ingeniero de software con más de 10 años de experiencia desarrollando aplicaciones web y móviles de alta exigencia con React, TypeScript, Node.js y PostgreSQL. He trabajado en remoto para equipos distribuidos y estoy disponible para contratos de colaboración externa desde España (Alicante), con facturación como autónomo.

Puedo compartir referencias, propuesta técnica o participar en una entrevista técnica esta semana. Adjunto mi CV y les dejo mi web: https://miguelgisbert.dev

Si prefiere no recibir más comunicaciones, use este enlace: ${UNSUB}

{signature}`,
  },
  {
    key: 'enterprise_en',
    segment: 'enterprise',
    lang: 'en',
    subject: 'Full-stack freelance profile (React/Node) — {company}',
    body: `{greeting}

I'm writing in relation to your posting for {job_title} ({job_url}). I believe my full-stack freelance profile may fit the role.

I'm Miguel Gisbert, a software engineer with 10+ years of experience building high-performance web and mobile applications with React, TypeScript, Node.js and PostgreSQL. I've worked remotely with distributed teams and I'm available for external contract engagements from Spain (Alicante), invoicing as a sole trader.

I can share references, a technical proposal or join a technical interview this week. My CV is attached and my site is https://miguelgisbert.dev

If you'd rather not hear from me again, use this link: ${UNSUB}

{signature}`,
  },
  {
    key: 'sme_local_es',
    segment: 'sme_local',
    lang: 'es',
    subject: 'Desarrollo web a medida para {company}',
    body: `{greeting}

Soy Miguel, desarrollador full-stack freelance de Alicante (https://miguelgisbert.dev). Ayudo a negocios locales a poner en marcha o mejorar sus aplicaciones web a medida: reservas, portales, paneles internos, integraciones y automatizaciones.

He visto que {company} puede necesitar apoyo técnico — me encantaría echar un vistazo a vuestro caso y proponeros un plan concreto, con alcance y precio cerrados. Adjunto mi CV y podéis ver trabajos en https://miguelgisbert.dev

Si no os interesa, con usar este enlace me vale y no vuelvo a escribir: ${UNSUB}

{signature}`,
  },
  {
    key: 'sme_local_en',
    segment: 'sme_local',
    lang: 'en',
    subject: 'Custom web development for {company}',
    body: `{greeting}

I'm Miguel, a freelance full-stack developer based in Alicante, Spain (https://miguelgisbert.dev). I help businesses launch or improve custom web applications: booking flows, portals, internal dashboards, integrations and automations.

I saw that {company} could use some technical support — I'd love to take a look at your case and propose a concrete plan with fixed scope and price. My CV is attached and you can see past work at https://miguelgisbert.dev

If you're not interested, just use this link and I won't write again: ${UNSUB}

{signature}`,
  },
];

const sql = getSql();
try {
  console.log('Aplicant schema...');
  await sql.unsafe(SCHEMA);

  // Historial permanent d'adreces enviades: encara que un lead s'esborre, no
  // es tornarà a escriure a la mateixa adreça.
  const backfilled = await sql`
    INSERT INTO sent_emails (email, domain, lead_id, resend_id, subject, sent_at)
    SELECT lower(contact_email), lower(domain), id, resend_id, subject, coalesce(sent_at, created_at)
    FROM leads
    WHERE status = 'sent' AND contact_email IS NOT NULL
    ON CONFLICT DO NOTHING
    RETURNING id
  `;
  if (backfilled.length) console.log(`  historial: ${backfilled.length} adreces enviades`);

  console.log('Seed de plantilles...');
  for (const t of TEMPLATES) {
    const rows = await sql`
      INSERT INTO templates (key, segment, lang, subject, body)
      VALUES (${t.key}, ${t.segment}, ${t.lang}, ${t.subject}, ${t.body})
      ON CONFLICT (key) DO NOTHING
      RETURNING id
    `;
    if (rows.length) console.log(`  + ${t.key}`);
  }
  const count = await sql`SELECT count(*)::int AS n FROM templates`;

  // Neteja de files antigues: les ofertes que no passen el filtre estricte
  // (full-time, indefinits, working student, m/f/d…) i les adreces deduïdes
  // no han de quedar mai en estat pendent.
  const blockPattern =
    '(full[[:space:]_-]?time|fulltime|permanent|permanente|working[[:space:]_-]?student|werkstudent|m[[:space:]]*/[[:space:]]*f[[:space:]]*/[[:space:]]*d|unbefristet|indefinid|jornada[[:space:]_-]*(laboral[[:space:]_-]*)?completa|tiempo[[:space:]_-]+completo|contrato[[:space:]_-]+fijo|empleo[[:space:]_-]+fijo|vollzeit|festanstellung|\\mcdi\\M)';
  const skipped = await sql`
    UPDATE leads
    SET status = 'skipped',
        error = 'No passa el filtre estricte de freelance/remote.'
    WHERE status = 'pending'
      AND (title || ' ' || coalesce(description, '')) ~* ${blockPattern}
    RETURNING id
  `;
  const guessed = await sql`
    UPDATE leads
    SET status = 'guessed',
        error = 'Adreça genèrica o deduïda; no s’envia.'
    WHERE status = 'pending' AND coalesce(email_method, '') = 'guessed'
    RETURNING id
  `;
  if (skipped.length || guessed.length) {
    console.log(`  neteja: ${skipped.length} descartats pel filtre, ${guessed.length} endevinats`);
  }

  // Revalida amb el mateix filtre JavaScript les files que encara queden en
  // pending/guessed: cobreix falsos positius com «autonomously» o «data contracts».
  const { makeEvaluator } = await import('./lib/evaluate.js');
  const config = JSON.parse(readFileSync(join(ROOT, 'tools', 'email-outreach', 'config.json'), 'utf8'));
  const { isEligible } = makeEvaluator(config);
  const open = await sql`
    SELECT id, title, description, employment_type FROM leads
    WHERE status IN ('pending', 'guessed')
  `;
  let revalidated = 0;
  for (const row of open) {
    if (!isEligible(row.title, row.description || '', { employmentType: row.employment_type })) {
      await sql`
        UPDATE leads
        SET status = 'skipped',
            error = 'No passa el filtre estricte de freelance/remote.'
        WHERE id = ${row.id}
      `;
      revalidated += 1;
    }
  }
  if (revalidated) console.log(`  neteja: ${revalidated} files més descartades pel filtre`);

  // Backfill de la data real publicada a LinkedIn (activity id -> timestamp).
  const missingDates = await sql`
    SELECT id, url FROM leads WHERE published_at IS NULL AND url LIKE '%linkedin.com%activity-%'
  `;
  let dated = 0;
  for (const row of missingDates) {
    const match = String(row.url).match(/activity-(\d{15,})/);
    if (!match) continue;
    try {
      const published = new Date(Number(BigInt(match[1]) >> 22n));
      if (Number.isNaN(published.getTime())) continue;
      await sql`UPDATE leads SET published_at = ${published} WHERE id = ${row.id}`;
      dated += 1;
    } catch {}
  }
  if (dated) console.log(`  dates: ${dated} leads de LinkedIn amb data real`);

  console.log(`✔ migració OK (${count[0].n} plantilles)`);
} finally {
  await closeSql();
}
