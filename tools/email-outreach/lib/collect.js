import {
  isSuppressed,
  sentInCooldown,
  leadExists,
  emailExists,
  insertLead,
} from './db.js';
import { makeEvaluator } from './evaluate.js';
import { discoverEmail } from './scrape.js';
import { collect as collectLinkedIn } from './sources/linkedin.js';

/**
 * Recull només publicacions de LinkedIn, les filtra pel perfil i inserta els
 * leads. No envia cap email.
 *
 * @param {import('postgres').Sql} sql
 * @param {object} config
 * @param {object} [overrides]
 * @returns {Promise<{inserted: number, afterDedupe: number, skippedKnown: number, skippedCooldown: number, skippedDuplicateEmail: number, noEmail: number, review: number, platform: number}>}
 */
export async function collectLeads(sql, config, overrides = {}) {
  const cfg = { ...config, ...overrides };
  const { evaluate, dedupe } = makeEvaluator(cfg);

  const raw = await collectLinkedIn();
  const leads = dedupe(raw.map(evaluate).filter(Boolean));
  console.log(`${leads.length} publicacions de LinkedIn després de dedupe`);

  let inserted = 0;
  let skippedKnown = 0;
  let skippedCooldown = 0;
  let skippedDuplicateEmail = 0;
  let noEmail = 0;
  let review = 0;

  for (const lead of leads) {
    if (inserted >= cfg.maxNewLeadsPerRun) break;
    if (await leadExists(sql, lead.url)) {
      skippedKnown += 1;
      continue;
    }
    if (lead.domain && (await isSuppressed(sql, null, lead.domain))) {
      skippedKnown += 1;
      continue;
    }
    if (lead.domain && (await sentInCooldown(sql, lead.domain, cfg.domainCooldownDays))) {
      skippedCooldown += 1;
      continue;
    }

    const found = await discoverEmail(lead);
    let status = 'no_email';
    let email = null;
    let method = null;
    let note = null;

    if (found) {
      if (await isSuppressed(sql, found.email, lead.domain)) {
        skippedKnown += 1;
        continue;
      }
      if (await emailExists(sql, found.email)) {
        skippedDuplicateEmail += 1;
        continue;
      }
      email = found.email;
      method = found.method;
      if (lead.reviewOnly) {
        status = 'review';
        review += 1;
        note = 'Revisió manual: no s’ha confirmat freelance remot o instrucció de CV.';
      } else if (found.apply || !found.generic) {
        status = 'pending';
      } else {
        status = 'review';
        review += 1;
        note = 'Email genèric sense instrucció de CV; revisa’l a mà.';
      }
    } else {
      noEmail += 1;
    }

    const id = await insertLead(sql, {
      url: lead.url,
      title: lead.title,
      company: lead.company,
      domain: lead.domain,
      location: lead.location,
      country: lead.country,
      source: lead.source,
      segment: lead.segment,
      lang: lead.lang,
      score: lead.score,
      description: lead.description.slice(0, 4000),
      contactEmail: email,
      emailMethod: method,
      employmentType: lead.employmentType || null,
      publishedAt: lead.publishedUnknown ? null : lead.date || null,
      status,
      error: note,
    });
    if (id) inserted += 1;
  }

  console.log(
    `Insertats: ${inserted} · ja coneguts: ${skippedKnown} · email ja existent: ${skippedDuplicateEmail}` +
      ` · cooldown ${cfg.domainCooldownDays}d: ${skippedCooldown}` +
      ` · sense email: ${noEmail} · revisió: ${review}`,
  );

  return {
    inserted,
    afterDedupe: leads.length,
    skippedKnown,
    skippedCooldown,
    skippedDuplicateEmail,
    noEmail,
    review,
    platform: 0,
  };
}
