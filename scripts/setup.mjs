import { randomBytes } from 'node:crypto';
import { writeFileSync, existsSync } from 'node:fs';

if (existsSync('.env.local')) {
  console.log('.env.local already exists. Your settings were preserved.');
} else {
  writeFileSync('.env.local', [
    'DEMO_EMAIL=learner@example.com',
    `DEMO_PASSWORD=${randomBytes(12).toString('base64url')}`,
    `SESSION_SECRET=${randomBytes(32).toString('hex')}`,
    '',
  ].join('\n'), { flag: 'wx' });
  console.log('Created .env.local. Open it to find your demo email and password, then run npm run dev.');
}
