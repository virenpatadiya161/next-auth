import { redirect } from 'next/navigation';
import { getSession } from '../../lib/auth';
import { login } from '../actions';

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  if (await getSession()) redirect('/dashboard');
  const { error } = await searchParams;
  return <>
    <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">Public route · /login</p>
    <h1 className="mt-3 text-3xl font-bold">Welcome back</h1>
    <p className="mt-3 text-sm leading-6 text-slate-600">Use the demo credentials from your .env.local file.</p>
    <form action={login} className="mt-7 space-y-5">
      <div>
        <label htmlFor="email" className="mb-2 block text-sm font-medium">Email</label>
        <input id="email" name="email" type="email" autoComplete="username" required maxLength={254}
          className="w-full rounded-lg border border-slate-300 p-3 outline-indigo-600" />
      </div>
      <div>
        <label htmlFor="password" className="mb-2 block text-sm font-medium">Password</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required maxLength={256}
          className="w-full rounded-lg border border-slate-300 p-3 outline-indigo-600" />
      </div>
      {error && <p role="alert" className="text-sm text-red-600">Incorrect email or password.</p>}
      <button type="submit" className="w-full rounded-lg bg-indigo-600 px-4 py-3 font-medium text-white hover:bg-indigo-700">Log in</button>
    </form>
    <p className="mt-6 text-xs leading-5 text-slate-500">Learning demo: one account, a signed cookie, and a server-side route check.</p>
  </>;
}
