import { createHmac, timingSafeEqual } from 'node:crypto';

export const SESSION_SECONDS = 60 * 60;
type Session = { email: string; expiresAt: number };

function sign(payload: string, secret: string) {
  return createHmac('sha256', secret).update(payload).digest('base64url');
}

export function createToken(email: string, secret: string, now = Date.now()) {
  const session: Session = { email, expiresAt: now + SESSION_SECONDS * 1000 };
  const payload = Buffer.from(JSON.stringify(session)).toString('base64url');
  return `${payload}.${sign(payload, secret)}`;
}

export function verifyToken(token: string | undefined, secret: string, now = Date.now()): Session | null {
  if (!token) return null;
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;
    const [payload, signature] = parts;
    const expected = Buffer.from(sign(payload, secret));
    const received = Buffer.from(signature);
    if (received.length !== expected.length || !timingSafeEqual(received, expected)) return null;
    const session = JSON.parse(Buffer.from(payload, 'base64url').toString()) as Session;
    if (typeof session.email !== 'string' || !session.email || !Number.isFinite(session.expiresAt) || session.expiresAt <= now) return null;
    return session;
  } catch {
    return null;
  }
}
