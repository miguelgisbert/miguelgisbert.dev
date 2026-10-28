'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { timingSafeEqual } from 'node:crypto';
import { ADMIN_COOKIE, isAdmin } from '@/lib/adminAuth';
import { sessionToken } from '../../../tools/email-outreach/lib/sign.js';

function safeEqual(a: string, b: string) {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  return ba.length === bb.length && timingSafeEqual(ba, bb);
}

export async function login(_prev: { error?: string } | null, formData: FormData) {
  const password = String(formData.get('password') || '');
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return { error: 'Falta ADMIN_PASSWORD a les variables d\'entorn.' };
  if (!safeEqual(password, expected)) {
    return { error: 'Contrasenya incorrecta.' };
  }
  const store = await cookies();
  store.set(ADMIN_COOKIE, sessionToken(), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });
  redirect('/admin');
}

export async function logout() {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
}

export async function checkSession() {
  return isAdmin();
}
