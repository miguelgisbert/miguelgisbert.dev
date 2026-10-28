import { NextResponse } from 'next/server';
import { verifyUnsubscribeToken } from '../../../../tools/email-outreach/lib/sign.js';
import { getSql, addSuppression, closeSql } from '../../../../tools/email-outreach/lib/db.js';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const SITE = process.env.PUBLIC_SITE_URL || 'https://miguelgisbert.dev';

type Lang = 'ca' | 'es' | 'en';

type Copy = {
  invalidTitle: string;
  invalidMessage: string;
  errorTitle: string;
  errorMessage: string;
  successTitle: string;
  successMessage: (email: string) => string;
  back: string;
};

const COPY: Record<Lang, Copy> = {
  ca: {
    invalidTitle: 'Enllaç no vàlid',
    invalidMessage:
      'Aquest enllaç de baixa no és vàlid o ha caducat. Si vols deixar de rebre missatges, respon «baixa» a qualsevol correu i et donaré de baixa manualment.',
    errorTitle: 'No s’ha pogut processar la baixa',
    errorMessage:
      'No he pogut processar la baixa ara mateix. Torna-ho a provar d’aquí a uns minuts o respon «baixa» a aquest correu.',
    successTitle: 'Ja està, no t’escriuré més',
    successMessage: (email) =>
      `Hem eliminat <strong style="color:#fafafa">${escapeHtml(email)}</strong> de la llista. Rebràs com a màxim un correu de confirmació que ja estiga en trànsit; res més.`,
    back: 'Torna a miguelgisbert.dev',
  },
  es: {
    invalidTitle: 'Enlace no válido',
    invalidMessage:
      'Este enlace de baja no es válido o ha caducado. Si quieres dejar de recibir mensajes, responde «baja» a cualquier correo y te daré de baja manualmente.',
    errorTitle: 'No se ha podido procesar la baja',
    errorMessage:
      'No he podido procesar la baja ahora mismo. Vuelve a intentarlo dentro de unos minutos o responde «baja» a este correo.',
    successTitle: 'Ya está, no te escribiré más',
    successMessage: (email) =>
      `Hemos eliminado <strong style="color:#fafafa">${escapeHtml(email)}</strong> de la lista. Como máximo recibirás un correo de confirmación que ya esté en tránsito; nada más.`,
    back: 'Volver a miguelgisbert.dev',
  },
  en: {
    invalidTitle: 'Invalid link',
    invalidMessage:
      'This unsubscribe link is invalid or has expired. To stop receiving messages, reply “unsubscribe” to any email and I’ll remove you manually.',
    errorTitle: 'Couldn’t process your request',
    errorMessage:
      'I couldn’t process the unsubscribe request right now. Try again in a few minutes or reply “unsubscribe” to this email.',
    successTitle: 'Done — I won’t email you again',
    successMessage: (email) =>
      `I’ve removed <strong style="color:#fafafa">${escapeHtml(email)}</strong> from the list. You may receive at most one confirmation email that’s already in transit; nothing else.`,
    back: 'Back to miguelgisbert.dev',
  },
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function pickLang(header: string | null): Lang {
  if (!header) return 'en';
  const preferences = header
    .split(',')
    .map((part, index) => {
      const [tag, ...params] = part.trim().split(';');
      const q = params.find((param) => param.trim().startsWith('q='));
      const quality = q ? Number(q.split('=')[1]) : 1;
      return { tag: tag.toLowerCase(), quality: Number.isFinite(quality) ? quality : 0, index };
    })
    .filter(({ tag }) => tag)
    .sort((a, b) => b.quality - a.quality || a.index - b.index);

  for (const { tag, quality } of preferences) {
    if (quality <= 0) continue;
    const language = tag.split('-')[0];
    if (language === 'ca' || language === 'es' || language === 'en') return language;
  }
  return 'en';
}

function page(lang: Lang, title: string, message: string, ok: boolean) {
  const accent = ok ? '#64ffda' : '#ff6b6b';
  const html = `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex, nofollow" />
<title>${title} — Miguel Gisbert</title>
<style>
  body { margin:0; min-height:100vh; display:grid; place-items:center; background:#0a0a0a; color:#fafafa;
         font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding:24px; }
  .card { max-width:440px; background:#1a1a1a; border:1px solid #2a2a2a; border-radius:12px; padding:32px; }
  h1 { font-size:18px; margin:0 0 12px; color:${accent}; }
  p { font-size:14.5px; line-height:1.6; color:#a0a0a0; margin:0 0 20px; }
  a { color:#64ffda; font-size:14px; }
</style>
</head>
<body>
  <div class="card">
    <h1>${title}</h1>
    <p>${message}</p>
    <a href="${SITE}">← ${COPY[lang].back}</a>
  </div>
</body>
</html>`;
  return new NextResponse(html, {
    status: ok ? 200 : 400,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Content-Language': lang,
      'Cache-Control': 'no-store',
      'Vary': 'Accept-Language',
      'X-Robots-Tag': 'noindex',
    },
  });
}

async function unsubscribe(token: string): Promise<{ email: string } | { error: 'invalid' | 'db' }> {
  const email = verifyUnsubscribeToken(token);
  if (!email) return { error: 'invalid' as const };
  try {
    const sql = getSql();
    try {
      await addSuppression(sql, { email, reason: 'unsubscribe', source: 'link' });
    } finally {
      await closeSql();
    }
    return { email };
  } catch {
    return { error: 'db' as const };
  }
}

export async function GET(request: Request) {
  const lang = pickLang(request.headers.get('accept-language'));
  const copy = COPY[lang];
  const { searchParams } = new URL(request.url);
  const result = await unsubscribe(searchParams.get('token') || '');
  if ('error' in result) {
    if (result.error === 'invalid') {
      return page(lang, copy.invalidTitle, copy.invalidMessage, false);
    }
    return page(lang, copy.errorTitle, copy.errorMessage, false);
  }
  return page(lang, copy.successTitle, copy.successMessage(result.email), true);
}

// RFC 8058: els clients de correu poden fer POST directament (one-click).
export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const result = await unsubscribe(searchParams.get('token') || '');
  if ('error' in result) {
    return new NextResponse('Invalid unsubscribe token', {
      status: result.error === 'invalid' ? 400 : 500,
      headers: { 'Cache-Control': 'no-store' },
    });
  }
  return new NextResponse(null, { status: 200, headers: { 'Cache-Control': 'no-store' } });
}
