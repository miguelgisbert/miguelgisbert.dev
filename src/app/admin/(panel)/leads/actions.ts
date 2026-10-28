'use server';

import { revalidatePath } from 'next/cache';
import { isAdmin } from '@/lib/adminAuth';
import {
  getSql,
  closeSql,
  deleteLead,
  deleteLeadsByStatus,
} from '../../../../../tools/email-outreach/lib/db.js';
import { collectLeads } from '../../../../../tools/email-outreach/lib/collect.js';
import config from '../../../../../tools/email-outreach/config.json';

async function guard() {
  if (!(await isAdmin())) throw new Error('No autoritzat.');
}

function revalidateLeads() {
  revalidatePath('/admin/leads');
  revalidatePath('/admin');
}

export async function deleteLeadAction(id: number) {
  await guard();
  if (!Number.isInteger(id) || id <= 0) return { error: 'ID de lead no vàlid.' };
  const sql = getSql();
  try {
    await deleteLead(sql, id);
    revalidateLeads();
    return { ok: true };
  } catch (e) {
    return { error: e instanceof Error ? e.message : String(e) };
  } finally {
    await closeSql();
  }
}

export async function deleteSkippedLeadsAction() {
  await guard();
  const sql = getSql();
  try {
    const deleted = await deleteLeadsByStatus(sql, 'skipped');
    revalidateLeads();
    return { ok: true, deleted };
  } catch (e) {
    return { error: e instanceof Error ? e.message : String(e) };
  } finally {
    await closeSql();
  }
}

export async function scheduleReviewLeadsAction() {
  await guard();
  const sql = getSql();
  try {
    const rows = await sql`
      UPDATE leads
      SET status = 'pending',
          error = 'Programat per al proper enviament.'
      WHERE status = 'review' AND contact_email IS NOT NULL
      RETURNING id
    `;
    revalidateLeads();
    return { ok: true, count: rows.length };
  } catch (e) {
    return { error: e instanceof Error ? e.message : String(e) };
  } finally {
    await closeSql();
  }
}

export async function collectLeadsAction() {
  await guard();
  const hasSearchProvider = Boolean(process.env.SERPER_API_KEY || process.env.TAVILY_API_KEY);
  const keyless = process.env.TAVILY_KEYLESS !== '0';
  if (!hasSearchProvider && !keyless) {
    return {
      error:
        'Falta un proveïdor de cerca. Configura TAVILY_API_KEY (pla gratuït sense targeta) o SERPER_API_KEY al .env i reinicia l’aplicació.',
    };
  }
  const sql = getSql();
  try {
    // Mateixa lògica que el cron de les 10:00, sense enviar res.
    const result = await collectLeads(sql, config);
    revalidateLeads();
    return {
      ok: true,
      inserted: result.inserted,
      noEmail: result.noEmail,
      review: result.review,
      platform: result.platform,
      skippedCooldown: result.skippedCooldown,
      afterDedupe: result.afterDedupe,
    };
  } catch (e) {
    return { error: e instanceof Error ? e.message : String(e) };
  } finally {
    await closeSql();
  }
}
