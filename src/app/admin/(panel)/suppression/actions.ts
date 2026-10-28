'use server';

import { revalidatePath } from 'next/cache';
import { getSql, addSuppression, deleteSuppression, closeSql } from '../../../../../tools/email-outreach/lib/db.js';

export async function addSuppressionAction(_prev: { error?: string; ok?: string } | null, formData: FormData) {
  const raw = String(formData.get('target') || '').trim().toLowerCase();
  const reason = String(formData.get('reason') || 'manual');
  if (!raw) return { error: 'Escriu un email o un domini.' };
  const isEmail = raw.includes('@');
  const sql = getSql();
  try {
    await addSuppression(sql, isEmail ? { email: raw, reason, source: 'admin' } : { domain: raw.replace(/^@/, ''), reason, source: 'admin' });
    revalidatePath('/admin/suppression');
    revalidatePath('/admin');
    return { ok: `Afegit: ${raw}` };
  } catch (e) {
    return { error: String(e instanceof Error ? e.message : e) };
  } finally {
    await closeSql();
  }
}

export async function removeSuppressionAction(id: number) {
  const sql = getSql();
  try {
    await deleteSuppression(sql, id);
    revalidatePath('/admin/suppression');
    revalidatePath('/admin');
  } finally {
    await closeSql();
  }
}
