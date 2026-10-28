import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifySessionToken } from '../../tools/email-outreach/lib/sign.js';

export const ADMIN_COOKIE = 'admin_session';

export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE)?.value;
  return verifySessionToken(token);
}

export async function requireAdmin(loginPath = '/admin/login'): Promise<void> {
  if (!(await isAdmin())) redirect(loginPath);
}
