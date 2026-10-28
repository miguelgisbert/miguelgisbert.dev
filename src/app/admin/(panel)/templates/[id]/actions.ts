'use server';

import { revalidatePath } from 'next/cache';
import { getSql, updateTemplate, isSuppressed, closeSql } from '../../../../../../tools/email-outreach/lib/db.js';
import { renderSubject, renderBody, renderHtmlBody } from '../../../../../../tools/email-outreach/lib/render.js';
import { sendEmail } from '../../../../../../tools/email-outreach/lib/send.js';
import { unsubscribeToken } from '../../../../../../tools/email-outreach/lib/sign.js';

const SITE = process.env.PUBLIC_SITE_URL || 'https://miguelgisbert.dev';

export type TemplateFormState = { error?: string; ok?: string; preview?: string } | null;

export async function saveTemplateAction(id: number, _prev: TemplateFormState, formData: FormData) {
  const subject = String(formData.get('subject') || '').trim();
  const body = String(formData.get('body') || '').trim();
  if (!subject || !body) return { error: 'L\'assumpte i el cos no poden estar buits.' };
  const sql = getSql();
  try {
    await updateTemplate(sql, id, { subject, body });
    revalidatePath('/admin/templates');
    revalidatePath(`/admin/templates/${id}`);
    return { ok: 'Desat.' };
  } catch (e) {
    return { error: String(e instanceof Error ? e.message : e) };
  } finally {
    await closeSql();
  }
}

const SAMPLE = {
  company: 'Acme Labs',
  contactName: '',
  jobTitle: 'Senior React/Node Developer (freelance)',
  jobUrl: 'https://example.com/jobs/senior-react-node',
  unsubscribeUrl: 'https://miguelgisbert.dev',
};

export async function previewTemplateAction(id: number) {
  const sql = getSql();
  try {
    const rows = await sql`SELECT * FROM templates WHERE id = ${id}`;
    const t = rows[0];
    if (!t) return { error: 'Plantilla no trobada.' };
    const vars = { ...SAMPLE, lang: t.lang };
    const subject = renderSubject(t.subject, vars);
    const body = renderBody(t.body, vars);
    return { preview: `Assumpte: ${subject}\n\n${body}` };
  } catch (e) {
    return { error: String(e instanceof Error ? e.message : e) };
  } finally {
    await closeSql();
  }
}

export async function sendTestAction(id: number, _prev: TemplateFormState, formData: FormData) {
  const to = String(formData.get('to') || process.env.TEST_EMAIL || process.env.REPLY_TO || '').trim();
  if (!to || !to.includes('@')) return { error: 'Cal un email de prova vàlid.' };
  const sql = getSql();
  try {
    const rows = await sql`SELECT * FROM templates WHERE id = ${id}`;
    const t = rows[0];
    if (!t) return { error: 'Plantilla no trobada.' };
    if (await isSuppressed(sql, to, null)) {
      return { error: `${to} està a la llista de supressió; no s’hi envia res.` };
    }
    const vars = {
      ...SAMPLE,
      lang: t.lang,
      unsubscribeUrl: `${SITE}/api/unsubscribe?token=${unsubscribeToken(to)}`,
    };
    const subject = `[PROVA] ${renderSubject(t.subject, vars)}`;
    const body = renderBody(t.body, vars);
    const html = renderHtmlBody(t.body, vars);
    await sendEmail(null, {
      to,
      subject,
      text: body,
      html,
      unsubscribeUrl: vars.unsubscribeUrl,
      tags: [{ name: 'campaign', value: 'test' }],
    });
    return { ok: `Prova enviada a ${to}.` };
  } catch (e) {
    return { error: String(e instanceof Error ? e.message : e) };
  } finally {
    await closeSql();
  }
}
