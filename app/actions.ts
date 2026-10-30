'use server';

import { createHash, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { COOKIE_NAME, getAuthConfig } from '../lib/auth';
import { createToken, SESSION_SECONDS } from '../lib/token';

export async function login(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');
  const config = getAuthConfig();
  // Compare fixed-length digests. This is a single environment-configured demo account.
  const digest = (value: string) => createHash('sha256').update(value).digest();
  const validPassword = timingSafeEqual(digest(password), digest(config.password));
  if (email !== config.email || !validPassword) redirect('/login?error=invalid');

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, createToken(email, config.secret), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_SECONDS,
  });
  redirect('/dashboard');
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  redirect('/login');
}
