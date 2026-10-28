import { NextResponse } from 'next/server';
import { verifyUnsubscribeToken } from '../../../../tools/email-outreach/lib/sign.js';
import { getSql, addSuppression, closeSql } from '../../../../tools/email-outreach/lib/db.js';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const SITE = process.env.PUBLIC_SITE_URL || 'https://miguelgisbert.dev';

function page(title: string, message: string, ok: boolean) {
  const accent = ok ? '#64ffda' : '#ff6b6b';
  const html = `<!doctype html>
<html lang="es">
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
    <a href="${SITE}">← Tornar a miguelgisbert.dev</a>
  </div>
</body>
</html>`;
  return new NextResponse(html, {
    status: ok ? 200 : 400,
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'X-Robots-Tag': 'noindex' },
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
  const { searchParams } = new URL(request.url);
  const result = await unsubscribe(searchParams.get('token') || '');
  if ('error' in result) {
    if (result.error === 'invalid') {
      return page(
        'Enllaç no vàlid',
        'Aquest enllaç de baixa no és vàlid o ha caducat. Si vols deixar de rebre missatges, respon "baixa" a qualsevol email i et trauré a mà.',
        false,
      );
    }
    return page(
      'Error temporal',
      'No puc processar la baixa ara mateix. Torna-ho a provar en uns minuts o respon "baixa" a l\'email.',
      false,
    );
  }
  return page(
    'Ja està, no et escriuré més',
    `Hem tret <strong style="color:#fafafa">${result.email}</strong> de la llista. Rebràs com a màxim un email de confirmació pendents de trànsit, res més.`,
    true,
  );
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
