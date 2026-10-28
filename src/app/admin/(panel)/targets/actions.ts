'use server';

import { revalidatePath } from 'next/cache';
import { getSql, insertTarget, deleteTarget, closeSql } from '../../../../../tools/email-outreach/lib/db.js';

export async function addTargetAction(_prev: { error?: string; ok?: string } | null, formData: FormData) {
  const company = String(formData.get('company') || '').trim();
  if (!company) return { error: 'Cal el nom de l\'empresa.' };
  const sql = getSql();
  try {
    await insertTarget(sql, {
      company,
      domain: String(formData.get('domain') || '').trim() || null,
      website: String(formData.get('website') || '').trim() || null,
      contactEmail: String(formData.get('contactEmail') || '').trim() || null,
      contactName: String(formData.get('contactName') || '').trim() || null,
      segment: String(formData.get('segment') || 'enterprise'),
      notes: String(formData.get('notes') || '').trim() || null,
      atsType: String(formData.get('atsType') || '').trim() || null,
      atsSlug: String(formData.get('atsSlug') || '').trim() || null,
    });
    revalidatePath('/admin/targets');
    return { ok: `Afegida ${company}.` };
  } catch (e) {
    return { error: String(e instanceof Error ? e.message : e) };
  } finally {
    await closeSql();
  }
}

export async function removeTargetAction(id: number) {
  const sql = getSql();
  try {
    await deleteTarget(sql, id);
    revalidatePath('/admin/targets');
  } finally {
    await closeSql();
  }
}
