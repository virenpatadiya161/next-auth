import { test } from 'node:test';
import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import { createToken, verifyToken, SESSION_SECONDS } from '../lib/token.ts';

const secret = randomBytes(32).toString('hex');
const email = 'test@example.com';
const now = Date.now();
test('valid signed session can be read', () => {
  assert.equal(verifyToken(createToken(email, secret, now), secret, now).email, email);
});
test('missing and malformed cookies are rejected', () => {
  for (const token of [undefined, '', 'fake', 'x.y.z', 'x.y']) assert.equal(verifyToken(token, secret, now), null);
});
test('editing the payload cannot impersonate another user', () => {
  const token = createToken(email, secret, now);
  const edited = Buffer.from(JSON.stringify({ email: 'other@example.com', expiresAt: now + 999999 })).toString('base64url');
  assert.equal(verifyToken(`${edited}.${token.split('.')[1]}`, secret, now), null);
});
test('a token signed by a different secret is rejected', () => {
  assert.equal(verifyToken(createToken(email, 'different-secret', now), secret, now), null);
});
test('expired sessions are rejected at the expiry boundary', () => {
  assert.equal(verifyToken(createToken(email, secret, now), secret, now + SESSION_SECONDS * 1000), null);
});
