import 'server-only';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from './token';

export const COOKIE_NAME = 'demo-session';

export function getAuthConfig() {
  const email = process.env.DEMO_EMAIL;
  const password = process.env.DEMO_PASSWORD;
  const secret = process.env.SESSION_SECRET;
  if (!email || !password || !secret || secret.length < 32) {
    throw new Error('Run npm run setup to configure .env.local before starting the app.');
  }
  return { email, password, secret };
}

export async function getSession() {
  const { email, secret } = getAuthConfig();
  const cookieStore = await cookies();
  const session = verifyToken(cookieStore.get(COOKIE_NAME)?.value, secret);
  // This teaching app has one configured account.
  return session?.email === email ? session : null;
}

export async function requireSession() {
  const session = await getSession();
  if (!session) redirect('/login');
  return session;
}
