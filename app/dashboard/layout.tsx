import { requireSession } from '../../lib/auth';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // No valid session? Redirect before returning this protected layout.
  await requireSession();
  return <>{children}</>;
}
