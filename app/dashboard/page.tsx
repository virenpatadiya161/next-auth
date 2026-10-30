import { requireSession } from '../../lib/auth'
import { logout } from '../actions'

export default async function DashboardPage () {
  // Check at the point of reading protected data too. Layouts can be reused
  // during client navigation, and they do not guard independent server actions.
  const session = await requireSession()
  return (
    <>
      <p className='text-xs font-semibold uppercase tracking-widest text-indigo-600'>
        Protected route · /dashboard
      </p>
      <h1 className='mt-3 text-3xl font-bold'>You're logged in</h1>
      <p className='mt-4 break-words text-slate-600'>
        Signed in as <strong>{session.email}</strong>
      </p>
      <p className='mt-4 text-sm leading-6 text-slate-500'>
        The server checked your cookie signature and expiry before showing this
        page. Refreshing keeps you signed in for up to one hour.
      </p>
      <form action={logout} className='mt-7'>
        <button className='rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white hover:bg-indigo-700'>
          Log out
        </button>
      </form>
    </>
  )
}
