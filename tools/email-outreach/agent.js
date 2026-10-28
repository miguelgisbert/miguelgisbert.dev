#!/usr/bin/env node
/**
 * outreach agent — recerca d'ofertes + preparació/enviament d'emails en fred.
 * Fonts: EURES, Adzuna, Himalayas, BerlinStartupJobs, Tecnoempleo, Arbeitnow,
 * r/forhire, r/esprogramming, HN, RemoteOK, Remotive, We Work Remotely,
 * ATS (Greenhouse/Lever/Ashby/SmartRecruiters) i dianes curades.
 * DB (Neon): suppression / leads / templates / targets.
 *
 * Ús:
 *   node tools/email-outreach/agent.js                  # recull + prepara + envia (autoSend)
 *   node tools/email-outreach/agent.js --dry-run        # recull i prepara, no envia
 *   node tools/email-outreach/agent.js --collect-only   # només recull (cron de les 10:30)
 *   node tools/email-outreach/agent.js --no-collect     # només processa pendents (enviament)
 */
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

function loadEnv() {
  for (const file of [join(ROOT, '.env'), join(ROOT, 'tools', 'email-outreach', '.env')]) {
    try {
      const txt = readFileSync(file, 'utf8');
      for (const line of txt.split('\n')) {
        const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
        if (m && m[2] && !(m[1] in process.env)) {
          process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
        }
      }
    } catch {}
  }
}
loadEnv();

const config = JSON.parse(readFileSync(join(ROOT, 'tools', 'email-outreach', 'config.json'), 'utf8'));

const DRY = process.argv.includes('--dry-run');
const NO_COLLECT = process.argv.includes('--no-collect');
const COLLECT_ONLY = process.argv.includes('--collect-only');

const {
  getSql,
  closeSql,
  isSuppressed,
  sentInCooldown,
  hasSentEmail,
  pendingLeads,
  markSent,
  markFailed,
  markSkipped,
  sentTodayCount,
  getTemplates,
} = await import('./lib/db.js');
const { makeEvaluator } = await import('./lib/evaluate.js');
const { isEligible } = makeEvaluator(config);
const { isGenericAddress, hasNamedContact } = await import('./lib/scrape.js');
const { renderSubject, renderBody, renderHtmlBody, pickTemplate } = await import('./lib/render.js');
const { sendEmail } = await import('./lib/send.js');
const { unsubscribeToken } = await import('./lib/sign.js');
const { collectLeads } = await import('./lib/collect.js');

const SITE = process.env.PUBLIC_SITE_URL || 'https://miguelgisbert.dev';

async function processPending(sql) {
  const templates = await getTemplates(sql);
  if (!templates.length) {
    console.error('Cap plantilla a la DB. Executa: npm run migrate');
    return;
  }
  const rows = await pendingLeads(sql, 200);
  if (!rows.length) {
    console.log('Cap lead pendent.');
    return;
  }
  console.log(`${rows.length} pendents`);

  const sentToday = await sentTodayCount(sql);
  const budget = Math.max(0, config.dailyCap - sentToday);
  console.log(`Enviats avui: ${sentToday}/${config.dailyCap} · pressupost restant: ${budget}`);
  if (DRY) console.log('[dry-run] no s\'envia res.');

  let wouldSend = 0;
  let sent = 0;
  const sentDomains = new Set();
  for (const lead of rows) {
    if (!lead.contact_email) {
      if (!DRY) await markSkipped(sql, lead.id, 'no_email', 'Sense cap adreça de contacte.');
      continue;
    }
    if (await hasSentEmail(sql, lead.contact_email)) {
      if (!DRY) await markSkipped(sql, lead.id, 'skipped', 'Ja s’ha enviat un CV a aquesta adreça.');
      continue;
    }
    // Revalida el filtre estricte en el moment d'enviar: les files antigues
    // poden no haver passat el filtre nou (full-time, m/f/d, indefinit…).
    if (!isEligible(lead.title, lead.description || '', { employmentType: lead.employment_type })) {
      if (!DRY) await markSkipped(sql, lead.id, 'skipped', 'No passa el filtre estricte de freelance/remote.');
      continue;
    }
    // Mai enviem a adreces deduïdes ni a genèriques sense contacte nominal.
    if (lead.email_method === 'guessed' || lead.status === 'guessed') {
      if (!DRY) await markSkipped(sql, lead.id, 'guessed', 'Adreça genèrica o deduïda; no s’envia.');
      continue;
    }
    if (
      lead.email_method === 'posted' &&
      isGenericAddress(lead.contact_email) &&
      !hasNamedContact(lead.description)
    ) {
      if (!DRY) await markSkipped(sql, lead.id, 'guessed', 'Adreça genèrica sense contacte nominal; revisa-la a mà.');
      continue;
    }
    if (await isSuppressed(sql, lead.contact_email, lead.domain)) {
      if (!DRY) await markSkipped(sql, lead.id, 'skipped', 'Adreça o domini a la llista de supressió.');
      continue;
    }
    // Un enviament per domini i finestra de cooldown, també en el moment d'enviar.
    if (lead.domain && sentDomains.has(lead.domain)) continue;
    if (await sentInCooldown(sql, lead.domain, config.domainCooldownDays)) continue;
    if (!DRY && wouldSend >= budget) break;
    wouldSend += 1;
    if (DRY) continue;

    const tpl = pickTemplate(templates, lead.segment, lead.lang);
    const vars = {
      company: lead.company || lead.title,
      contactName: '',
      jobTitle: lead.title,
      jobUrl: lead.url,
      lang: lead.lang,
      unsubscribeUrl: `${SITE}/api/unsubscribe?token=${unsubscribeToken(lead.contact_email)}`,
    };
    const subject = renderSubject(tpl.subject, vars);
    const body = renderBody(tpl.body, vars);
    const html = renderHtmlBody(tpl.body, vars);
    try {
      const resendId = await sendEmail(sql, {
        to: lead.contact_email,
        subject,
        text: body,
        html,
        unsubscribeUrl: vars.unsubscribeUrl,
        idempotencyKey: `outreach-lead-${lead.id}`,
        tags: [
          { name: 'campaign', value: 'outreach' },
          { name: 'segment', value: lead.segment },
        ],
      });
      await markSent(sql, lead.id, {
        resendId,
        email: lead.contact_email,
        domain: lead.domain,
        subject,
      });
      sent += 1;
      if (lead.domain) sentDomains.add(lead.domain);
      console.log(`  ✔ ${lead.contact_email} — ${subject}`);
      await new Promise((r) => setTimeout(r, 1200));
    } catch (e) {
      await markFailed(sql, lead.id, String(e.message).slice(0, 500));
      console.error(`  ✘ ${lead.contact_email}: ${e.message}`);
    }
  }
  if (DRY) console.log(`[dry-run] ${Math.min(wouldSend, budget)} emails es enviarien (pressupost ${budget}).`);
  console.log(`Enviats en aquesta execució: ${sent}`);
}

async function main() {
  const sql = getSql();
  try {
    if (!NO_COLLECT) await collectLeads(sql, config);
    if (!COLLECT_ONLY && (config.autoSend || DRY || process.argv.includes('--send'))) {
      await processPending(sql);
    }
  } finally {
    await closeSql();
  }
}

main().catch((e) => {
  console.error('Fatal:', e);
  process.exit(1);
});
