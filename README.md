# Simple Next.js authentication and protected routes

Next.js App Router + TypeScript + Tailwind CSS. This example uses the requested **layout check** approach. No database, Redux, or external API is needed.

## Run

Use Node.js 22.12+ or a supported newer version.

```sh
npm install
npm run setup
npm run dev
```

The setup command creates .env.local with a demo email, random password, and random signing secret. Open that file to find your login credentials. Existing settings are preserved. Do not commit or share .env.local.

Open http://localhost:3000/dashboard. You will be redirected to /login. Log in using the generated credentials, refresh the dashboard, and then log out.

```sh
npm test
npm run build
npm start
```

Production sets Secure on the cookie; serve production over HTTPS. Local development uses a non-Secure cookie so it works over HTTP. Restart the server after changing .env.local.

## Main logic

```tsx
// app/dashboard/layout.tsx
export default async function DashboardLayout({ children }) {
  await requireSession(); // redirects to /login if invalid
  return <>{children}</>;
}
```

Read these files in order:

1. `app/actions.ts`: login checks credentials on the server, signs a session, sets an HttpOnly cookie, then redirects to /dashboard. Logout deletes the cookie and redirects to /login.
2. `lib/token.ts`: small HMAC signed token helper. The server verifies the signature and expiration, not merely the presence of a cookie.
3. `lib/auth.ts`: getSession reads and verifies the cookie; requireSession redirects if it is missing, invalid, or expired.
4. `app/dashboard/layout.tsx`: protects the dashboard layout.
5. `app/dashboard/page.tsx`: repeats the check before reading protected data. This is intentional: layouts can be reused across client navigation and nested pages may render independently.

Flow: request /dashboard -> server reads cookie -> verifies signature and expiry -> renders page OR redirects to /login.

All pages are Server Components. The forms use Server Actions, so this example does not need 'use client'. There is no client-only redirect or localStorage authentication flag. Reading cookies makes these routes dynamic. Private session data is not put in a shared cache.

## Middleware versus layout

Middleware executes before route rendering and can redirect early. In Next.js 16 the middleware convention was renamed to `proxy.ts`. This example chooses the layout option requested in the task, so no middleware.ts/proxy.ts is needed.

A layout or proxy is not a complete security boundary. Every protected data function, Server Action, and Route Handler must verify the session and authorize access itself. Do not rely on hidden UI or the layout alone. This example checks again in the dashboard page at the point of using the session.

## Cookie/token details

- HttpOnly prevents client JavaScript from reading the cookie.
- SameSite=Lax limits cross-site cookie sending. Next.js Server Actions also perform origin checks; leave these protections enabled.
- Secure is enabled in production; path=/ and a one-hour maxAge are set.
- The token is signed, not encrypted. Its payload contains only email and expiry; never put passwords in it.
- Both the cookie lifetime and the signed server-checked expiry matter. An expired or edited token is rejected.

This is a single-account learning example. Its demo password lives in server environment configuration. The digest comparison is not a password-storage scheme. For real users use an authentication library/provider or a database with a proper password hash, login rate limiting, and server-side session revocation. Logout removes this browser's cookie; a copied stateless token remains usable until expiry unless the signing secret is changed.

## Manual checks

- Visit /dashboard in a private window: redirected to /login.
- Enter the wrong password: login error, no session created.
- Enter the configured credentials: redirected to /dashboard.
- Refresh: still logged in.
- Edit the cookie or wait until it expires: redirected to /login.
- Log out and revisit /dashboard: redirected to /login.

Reference: https://nextjs.org/docs/app/guides/authentication
