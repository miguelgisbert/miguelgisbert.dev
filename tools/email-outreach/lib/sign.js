import { createHmac, timingSafeEqual } from 'node:crypto';

function secret() {
  const s = process.env.UNSUBSCRIBE_SECRET || process.env.ADMIN_SESSION_SECRET;
  if (!s) throw new Error('Falta UNSUBSCRIBE_SECRET (o ADMIN_SESSION_SECRET) a les variables d\'entorn');
  return s;
}

export function unsubscribeToken(email) {
  const e = String(email).toLowerCase().trim();
  const mac = createHmac('sha256', secret()).update(`unsub:${e}`).digest('hex');
  return `${Buffer.from(e).toString('base64url')}.${mac}`;
}

export function verifyUnsubscribeToken(token) {
  if (!token || !token.includes('.')) return null;
  const [b64, mac] = token.split('.');
  let email;
  try {
    email = Buffer.from(b64, 'base64url').toString('utf8');
  } catch {
    return null;
  }
  if (!email || !email.includes('@')) return null;
  const expected = createHmac('sha256', secret()).update(`unsub:${email.toLowerCase()}`).digest('hex');
  const a = Buffer.from(mac, 'hex');
  const b = Buffer.from(expected, 'hex');
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  return email.toLowerCase();
}

export function sessionToken() {
  return createHmac('sha256', secret()).update('admin-session-v1').digest('hex');
}

export function verifySessionToken(token) {
  if (!token) return false;
  const expected = sessionToken();
  const a = Buffer.from(String(token), 'hex');
  const b = Buffer.from(expected, 'hex');
  return a.length === b.length && timingSafeEqual(a, b);
}
