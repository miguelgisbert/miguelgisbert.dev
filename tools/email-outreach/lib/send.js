import { existsSync, readFileSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { addSuppression, hasSentEmail, isSuppressed } from './db.js';
import { htmlFromText } from './util.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const CV_PATH = join(ROOT, 'public', 'CVMiguelGisbert.pdf');
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

let cvCache = null;

export function loadCv() {
  if (!cvCache) {
    if (!existsSync(CV_PATH)) {
      throw new Error(`No s'ha trobat el CV a ${CV_PATH}. Puja-hi CVMiguelGisbert.pdf abans d'enviar.`);
    }
    if (statSync(CV_PATH).size < 1000) {
      throw new Error(`El CV a ${CV_PATH} sembla buit o massa petit.`);
    }
    const pdf = readFileSync(CV_PATH);
    if (pdf.subarray(0, 5).toString('latin1') !== '%PDF-') {
      throw new Error(`El fitxer ${CV_PATH} no és un PDF vàlid.`);
    }
    cvCache = pdf.toString('base64');
  }
  return cvCache;
}

/**
 * @param {import('postgres').Sql|null} sql
 * @param {{to: string, subject: string, text: string, html?: string, tags?: Array<{name: string, value: string}>, unsubscribeUrl?: string|null, idempotencyKey?: string|null}} opts
 * @returns {Promise<string|null>}
 */
export async function sendEmail(sql, { to, subject, text, html, tags = [], unsubscribeUrl = null, idempotencyKey = null }) {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error('Falta RESEND_API_KEY');
  if (!EMAIL_RE.test(String(to || ''))) throw new Error(`Adreça destinatària no vàlida: ${to}`);
  if (sql) {
    if (await hasSentEmail(sql, to)) throw new Error(`Ja s'ha enviat un CV a ${to}; no es repeteix.`);
    if (await isSuppressed(sql, to, null)) throw new Error(`${to} està a la llista de supressió.`);
  }
  const from = process.env.RESEND_FROM || 'Miguel Gisbert <info@miguelgisbert.dev>';
  const replyTo = process.env.REPLY_TO || 'info@miguelgisbert.dev';
  const replyAddress = replyTo.match(/<([^>]+)>/)?.[1] || replyTo;

  const headers = {};
  if (unsubscribeUrl) {
    headers['List-Unsubscribe'] = `<${unsubscribeUrl}>, <mailto:${replyAddress}?subject=unsubscribe>`;
    headers['List-Unsubscribe-Post'] = 'List-Unsubscribe=One-Click';
  }

  const requestHeaders = {
    Authorization: `Bearer ${key}`,
    'Content-Type': 'application/json',
  };
  if (idempotencyKey) requestHeaders['Idempotency-Key'] = idempotencyKey;

  const payload = {
    from,
    to: [to],
    reply_to: replyTo,
    subject,
    text,
    html: html || htmlFromText(text, { lang: 'en' }),
    attachments: [
      {
        filename: 'Miguel-Gisbert-CV.pdf',
        content: loadCv(),
        disposition: 'attachment',
      },
    ],
    tags: tags.length ? tags : undefined,
    headers: Object.keys(headers).length ? headers : undefined,
  };

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: requestHeaders,
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(20000),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    const lower = `${res.status} ${errText}`.toLowerCase();
    // 401/403/429/5xx solen ser errors de clau, domini o límits, no de
    // l'adreça. La resta de 4xx sí que solen indicar un destinatari invàlid.
    const recipientFailure =
      res.status === 400 ||
      res.status === 404 ||
      res.status === 422 ||
      (res.status === 403 && /recipient|address|bounce|blocked|suppress|unsubscrib/.test(lower));
    const transient =
      res.status === 401 ||
      res.status === 429 ||
      res.status >= 500 ||
      (res.status === 403 && !recipientFailure);
    if (recipientFailure && !transient && sql && to) {
      try {
        await addSuppression(sql, {
          email: to,
          reason: 'send_failure',
          source: `resend:${res.status}`,
        });
        console.error(`  !! ${to} suprimit automàticament (Resend ${res.status})`);
      } catch (e) {
        console.error(`  !! error suprimint ${to}: ${e.message}`);
      }
    }
    throw new Error(`Resend HTTP ${res.status} ${errText.slice(0, 200)}`);
  }

  const data = await res.json().catch(() => ({}));
  return data.id || null;
}
