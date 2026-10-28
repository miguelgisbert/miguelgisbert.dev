/**
 * @typedef {Object} SuppressionRow
 * @property {number} id
 * @property {string|null} email
 * @property {string|null} domain
 * @property {string} reason
 * @property {string} source
 * @property {string|Date} created_at
 *
 * @typedef {Object} LeadRow
 * @property {number} id
 * @property {string} url
 * @property {string} title
 * @property {string|null} company
 * @property {string|null} domain
 * @property {string|null} location
 * @property {string|null} country
 * @property {string|null} source
 * @property {string} segment
 * @property {string} lang
 * @property {number} score
 * @property {string|null} description
 * @property {string|null} contact_email
 * @property {string|null} email_method
 * @property {string|null} employment_type
 * @property {string} status
 * @property {string|null} error
 * @property {string|null} published_at
 * @property {string|null} sent_at
 * @property {string|Date} created_at
 *
 * @typedef {Object} TemplateRow
 * @property {number} id
 * @property {string} key
 * @property {string} segment
 * @property {string} lang
 * @property {string} subject
 * @property {string} body
 * @property {string|Date} updated_at
 *
 * @typedef {Object} TargetRow
 * @property {number} id
 * @property {string} company
 * @property {string|null} domain
 * @property {string|null} website
 * @property {string|null} contact_email
 * @property {string|null} contact_name
 * @property {string} segment
 * @property {string|null} notes
 * @property {string|null} ats_type
 * @property {string|null} ats_slug
 * @property {string|Date} created_at
 */

import postgres from 'postgres';

let sqlSingleton = null;

export function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url || url === '[SENSITIVE]') {
    throw new Error(
      'DATABASE_URL no vàlida a .env. Copia el connection string real des de https://console.neon.tech (projecte neon-rose-dog).',
    );
  }
  if (!sqlSingleton) {
    sqlSingleton = postgres(url, { max: 5, idle_timeout: 20, connect_timeout: 15 });
  }
  return sqlSingleton;
}

export async function closeSql() {
  if (sqlSingleton) {
    await sqlSingleton.end({ timeout: 5 });
    sqlSingleton = null;
  }
}

export async function isSuppressed(sql, email, domain) {
  const e = email ? String(email).toLowerCase().trim() : null;
  const d = normalizeDomain(domain);
  const emailDomain = e && e.includes('@') ? e.split('@').pop() || null : null;
  const rows = await sql`
    SELECT 1 FROM suppression
    WHERE (${e}::text IS NOT NULL AND email = ${e})
       OR (${d}::text IS NOT NULL AND domain = ${d})
       OR (
         ${emailDomain}::text IS NOT NULL
         AND domain IS NOT NULL
         AND (domain = ${emailDomain} OR ${emailDomain} LIKE '%.' || domain)
       )
    LIMIT 1
  `;
  return rows.length > 0;
}

export function normalizeDomain(value) {
  const d = value ? String(value).toLowerCase().trim().replace(/^@/, '').replace(/^www\./, '') : '';
  return d || null;
}

export function emailDomain(email) {
  const e = email ? String(email).toLowerCase().trim() : '';
  return e.includes('@') ? normalizeDomain(e.split('@').pop()) : null;
}

/**
 * @param {import('postgres').Sql} sql
 * @param {{email?: string|null, domain?: string|null, reason?: string, source?: string}} entry
 * @returns {Promise<boolean>}
 */
export async function addSuppression(sql, { email = null, domain = null, reason = 'manual', source = 'admin' }) {
  const e = email ? email.toLowerCase().trim() : null;
  const d = normalizeDomain(domain);
  if (!e && !d) throw new Error('Cal email o domain');
  const rows = await sql`
    INSERT INTO suppression (email, domain, reason, source)
    VALUES (${e}, ${d}, ${reason}, ${source})
    ON CONFLICT DO NOTHING
    RETURNING id
  `;
  return rows.length > 0;
}

export async function sentInCooldown(sql, domain, days) {
  if (!domain) return false;
  const rows = await sql`
    SELECT 1 FROM leads
    WHERE status = 'sent'
      AND domain = lower(${domain})
      AND sent_at > now() - (${days} || ' days')::interval
    LIMIT 1
  `;
  return rows.length > 0;
}

export async function leadExists(sql, url) {
  const rows = await sql`
    SELECT 1 FROM leads WHERE url = ${url}
    UNION ALL
    SELECT 1 FROM dismissed_leads WHERE url = ${url}
    LIMIT 1
  `;
  return rows.length > 0;
}

export async function emailExists(sql, email) {
  if (!email) return false;
  const rows = await sql`
    SELECT 1 FROM leads WHERE lower(contact_email) = lower(${email})
    UNION ALL
    SELECT 1 FROM dismissed_emails WHERE email = lower(${email})
    UNION ALL
    SELECT 1 FROM sent_emails WHERE lower(email) = lower(${email})
    LIMIT 1
  `;
  return rows.length > 0;
}

export async function hasSentEmail(sql, email) {
  if (!email) return false;
  const rows = await sql`
    SELECT 1 FROM sent_emails WHERE lower(email) = lower(${email}) LIMIT 1
  `;
  return rows.length > 0;
}

export async function recordSentEmail(sql, { email, domain = null, leadId = null, resendId = null, subject = null }) {
  if (!email) return;
  await sql`
    INSERT INTO sent_emails (email, domain, lead_id, resend_id, subject)
    VALUES (lower(${email}), lower(${normalizeDomain(domain)}), ${leadId}, ${resendId}, ${subject})
    ON CONFLICT DO NOTHING
  `;
}

export async function findCompanyDomain(sql, company) {
  if (!company) return null;
  const rows = await sql`SELECT DISTINCT domain FROM leads WHERE company = ${company} AND domain IS NOT NULL AND domain <> '' LIMIT 8`;
  const boardLike = /arbeitnow|remoteok|himalayas|tecnoempleo|weworkremotely|remotive|berlinstartupjobs|reddit|ycombinator|greenhouse|lever\.co|ashbyhq|smartrecruiters/i;
  for (const r of rows) {
    if (r.domain && !boardLike.test(r.domain)) return r.domain;
  }
  return null;
}

export async function insertLead(sql, lead) {
  const rows = await sql`
    INSERT INTO leads (
      url, title, company, domain, location, country, source, segment, lang,
      score, description, contact_email, email_method, employment_type, published_at, status, error
    ) VALUES (
      ${lead.url}, ${lead.title}, ${lead.company}, ${lead.domain}, ${lead.location},
      ${lead.country}, ${lead.source}, ${lead.segment}, ${lead.lang},
      ${lead.score}, ${lead.description}, ${lead.contactEmail}, ${lead.emailMethod},
      ${lead.employmentType ?? null}, ${lead.publishedAt ?? null}, ${lead.status}, ${lead.error ?? null}
    )
    ON CONFLICT DO NOTHING
    RETURNING id
  `;
  return rows[0]?.id ?? null;
}

export async function pendingLeads(sql, limit = 100) {
  // Les adreces deduïdes mai no entren al circuit d'enviament, encara que una
  // fila antiga s'haja quedat amb status 'pending'. Tampoc no es repeteixen
  // adreces que ja han rebut un CV.
  return sql`
    SELECT * FROM leads
    WHERE status = 'pending'
      AND coalesce(email_method, '') <> 'guessed'
      AND NOT EXISTS (
        SELECT 1 FROM sent_emails se
        WHERE lower(se.email) = lower(leads.contact_email)
      )
    ORDER BY score DESC, created_at ASC
    LIMIT ${limit}
  `;
}

export async function markSent(sql, id, { resendId = null, email = null, domain = null, subject = null } = {}) {
  await sql.begin(async (tx) => {
    const rows = await tx`
      UPDATE leads
      SET status = 'sent', sent_at = now(), resend_id = ${resendId}, error = NULL
      WHERE id = ${id}
      RETURNING lower(contact_email) AS email, domain, subject
    `;
    const lead = rows[0];
    const to = email || lead?.email;
    if (to) {
      await tx`
        INSERT INTO sent_emails (email, domain, lead_id, resend_id, subject)
        VALUES (
          lower(${to}),
          lower(${emailDomain(to) || normalizeDomain(domain || lead?.domain)}),
          ${id},
          ${resendId},
          ${subject || lead?.subject}
        )
        ON CONFLICT DO NOTHING
      `;
    }
  });
}

export async function markFailed(sql, id, error) {
  await sql`UPDATE leads SET status = 'failed', error = ${error} WHERE id = ${id}`;
}

export async function markSkipped(sql, id, status = 'skipped', error = null) {
  await sql`UPDATE leads SET status = ${status}, error = ${error} WHERE id = ${id}`;
}

export async function sentTodayCount(sql) {
  const rows = await sql`
    SELECT count(*)::int AS n FROM leads
    WHERE status = 'sent' AND sent_at >= date_trunc('day', now())
  `;
  return rows[0]?.n ?? 0;
}

export async function pendingLeadsCount(sql) {
  const rows = await sql`
    SELECT count(*)::int AS n FROM leads
    WHERE status = 'pending' AND coalesce(email_method, '') <> 'guessed'
  `;
  return rows[0]?.n ?? 0;
}

export async function suppressionCount(sql) {
  const rows = await sql`SELECT count(*)::int AS n FROM suppression`;
  return rows[0]?.n ?? 0;
}

/**
 * @param {import('postgres').Sql} sql
 * @returns {Promise<TemplateRow[]>}
 */
export async function getTemplates(sql) {
  return sql`SELECT * FROM templates ORDER BY segment, lang`;
}

export async function updateTemplate(sql, id, { subject, body }) {
  const rows = await sql`
    UPDATE templates SET subject = ${subject}, body = ${body}, updated_at = now()
    WHERE id = ${id}
    RETURNING *
  `;
  return rows[0] ?? null;
}

/**
 * @param {import('postgres').Sql} sql
 * @returns {Promise<TargetRow[]>}
 */
export async function getTargets(sql) {
  return sql`SELECT * FROM targets ORDER BY company`;
}

export async function insertTarget(sql, t) {
  const rows = await sql`
    INSERT INTO targets (company, domain, website, contact_email, contact_name, segment, notes, ats_type, ats_slug)
    VALUES (${t.company}, ${t.domain}, ${t.website}, ${t.contactEmail}, ${t.contactName}, ${t.segment}, ${t.notes}, ${t.atsType}, ${t.atsSlug})
    RETURNING *
  `;
  return rows[0];
}

export async function deleteTarget(sql, id) {
  await sql`DELETE FROM targets WHERE id = ${id}`;
}

export async function deleteSuppression(sql, id) {
  await sql`DELETE FROM suppression WHERE id = ${id}`;
}

export async function deleteLead(sql, id) {
  const rows = await sql`SELECT url, lower(contact_email) AS email FROM leads WHERE id = ${id}`;
  if (!rows.length) return;
  await sql`INSERT INTO dismissed_leads (url) VALUES (${rows[0].url}) ON CONFLICT DO NOTHING`;
  if (rows[0].email) {
    await sql`INSERT INTO dismissed_emails (email) VALUES (${rows[0].email}) ON CONFLICT DO NOTHING`;
  }
  await sql`DELETE FROM leads WHERE id = ${id}`;
}

export async function deleteLeadsByStatus(sql, status) {
  await sql`INSERT INTO dismissed_leads (url) SELECT url FROM leads WHERE status = ${status} ON CONFLICT DO NOTHING`;
  await sql`
    INSERT INTO dismissed_emails (email)
    SELECT lower(contact_email) FROM leads
    WHERE status = ${status} AND contact_email IS NOT NULL
    ON CONFLICT DO NOTHING
  `;
  const rows = await sql`DELETE FROM leads WHERE status = ${status} RETURNING id`;
  return rows.length;
}

/**
 * @param {import('postgres').Sql} sql
 * @returns {Promise<SuppressionRow[]>}
 */
export async function listSuppression(sql, limit = 500) {
  return sql`SELECT * FROM suppression ORDER BY created_at DESC LIMIT ${limit}`;
}

/**
 * @param {import('postgres').Sql} sql
 * @param {{limit?: number, status?: string|null, q?: string|null}} [opts]
 * @returns {Promise<LeadRow[]>}
 */
export async function listLeads(sql, { limit = 200, status = null, q = null } = {}) {
  const statusFilter = status || null;
  const term = q ? `%${q.toLowerCase()}%` : null;
  // La columna `status` es deriva perquè les files antigues amb email deduït
  // es tracten com a 'guessed' encara que la columna guardada diga 'pending'.
  return sql`
    SELECT * FROM (
      SELECT
        id, url, title, company, domain, location, country, source, segment, lang,
        score, description, contact_email, email_method, employment_type, published_at, subject, body, resend_id,
        error, sent_at, created_at,
        CASE
          WHEN status = 'pending' AND coalesce(email_method, '') = 'guessed' THEN 'guessed'
          ELSE status
        END AS status,
        CASE
          WHEN status = 'pending' AND coalesce(email_method, '') = 'guessed' THEN 5
          WHEN status = 'pending' THEN 0
          WHEN status = 'review' THEN 1
          WHEN status = 'no_email' THEN 2
          WHEN status = 'platform' THEN 3
          WHEN status = 'sent' THEN 4
          WHEN status = 'failed' THEN 5
          ELSE 6
        END AS status_rank
      FROM leads
    ) AS lead
    WHERE (${statusFilter}::text IS NULL OR status = ${statusFilter})
      AND (
        ${term}::text IS NULL
        OR lower(title) LIKE ${term}
        OR lower(coalesce(company, '')) LIKE ${term}
        OR lower(coalesce(contact_email, '')) LIKE ${term}
        OR lower(coalesce(domain, '')) LIKE ${term}
        OR lower(coalesce(source, '')) LIKE ${term}
      )
    ORDER BY status_rank ASC, score DESC, created_at DESC
    LIMIT ${limit}
  `;
}

/**
 * @param {import('postgres').Sql} sql
 * @returns {Promise<{leadsByStatus: Array<{status: string, n: number}>, suppressionCount: number, templateCount: number, sentLast30Days: number}>}
 */
export async function stats(sql) {
  const [byStatus, suppressed, templates, recentSent] = await Promise.all([
    sql`
      SELECT effective_status AS status, count(*)::int AS n
      FROM (
        SELECT CASE
          WHEN status = 'pending' AND coalesce(email_method, '') = 'guessed' THEN 'guessed'
          ELSE status
        END AS effective_status
        FROM leads
      ) AS lead
      GROUP BY effective_status
      ORDER BY n DESC
    `,
    sql`SELECT count(*)::int AS n FROM suppression`,
    sql`SELECT count(*)::int AS n FROM templates`,
    sql`
      SELECT count(*)::int AS n FROM leads
      WHERE status = 'sent' AND sent_at >= now() - interval '30 days'
    `,
  ]);
  return {
    leadsByStatus: byStatus,
    suppressionCount: suppressed[0]?.n ?? 0,
    templateCount: templates[0]?.n ?? 0,
    sentLast30Days: recentSent[0]?.n ?? 0,
  };
}
