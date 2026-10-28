import { createHmac, timingSafeEqual } from 'node:crypto';
import { NextResponse } from 'next/server';
import { getSql, addSuppression, closeSql } from '../../../../../tools/email-outreach/lib/db.js';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

function verifySvix(body: string, headers: Headers) {
  const secret = process.env.RESEND_WEBHOOK_SECRET;
  if (!secret) return false;

  const id = headers.get('svix-id');
  const timestamp = headers.get('svix-timestamp');
  const signatures = headers.get('svix-signature');
  if (!id || !timestamp || !signatures) return false;

  const now = Math.floor(Date.now() / 1000);
  const ts = Number(timestamp);
  if (!Number.isFinite(ts) || Math.abs(now - ts) > 300) return false;

  const key = Buffer.from(secret.replace(/^whsec_/, ''), 'base64');
  const expected = createHmac('sha256', key).update(`${id}.${timestamp}.${body}`).digest('base64');

  return signatures
    .split(' ')
    .map((part) => part.split(','))
    .filter(([version]) => version === 'v1')
    .some(([, signature]) => signature && safeEqual(signature, expected));
}

function recipients(data: Record<string, unknown>) {
  const raw = data.to ?? data.email ?? data.recipient;
  const list = Array.isArray(raw) ? raw : [raw];
  return list
    .filter((value): value is string => typeof value === 'string' && value.includes('@'))
    .map((value) => value.toLowerCase().trim());
}

const REASONS: Record<string, string> = {
  'email.bounced': 'bounce',
  'email.complained': 'complaint',
  'email.failed': 'send_failure',
  'email.suppressed': 'send_failure',
};

export async function POST(request: Request) {
  const body = await request.text();
  if (!verifySvix(body, request.headers)) {
    return NextResponse.json({ error: 'invalid signature' }, { status: 401 });
  }

  let event: { type?: string; data?: Record<string, unknown> };
  try {
    event = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 });
  }

  const reason = event.type ? REASONS[event.type] : undefined;
  if (!reason || !event.data) {
    return NextResponse.json({ ok: true, ignored: event.type || 'unknown' });
  }

  const addresses = recipients(event.data);
  if (!addresses.length) {
    console.error(`Resend webhook ${event.type}: sense destinatari`);
    return NextResponse.json({ ok: true, ignored: 'no recipient' });
  }

  const sql = getSql();
  try {
    for (const email of addresses) {
      await addSuppression(sql, {
        email,
        reason,
        source: `resend:${event.type}`,
      });
      console.log(`Resend webhook ${event.type}: ${email} suprimit (${reason})`);
    }
  } finally {
    await closeSql();
  }

  return NextResponse.json({ ok: true, suppressed: addresses.length });
}
