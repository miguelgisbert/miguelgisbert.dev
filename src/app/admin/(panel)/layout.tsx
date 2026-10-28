import { requireAdmin } from '@/lib/adminAuth';
import { getSql, closeSql, pendingLeadsCount, suppressionCount } from '../../../../tools/email-outreach/lib/db.js';
import { AdminNav } from '../_components/AdminNav';

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  let pending = 0;
  let suppressed = 0;
  try {
    const sql = getSql();
    [pending, suppressed] = await Promise.all([pendingLeadsCount(sql), suppressionCount(sql)]);
  } catch {
    // La DB pot no estar accessible; el panell es renderitza igualment.
  } finally {
    await closeSql().catch(() => {});
  }
  return (
    <div className="adm-shell">
      <a className="skip-link" href="#adm-main">
        Vés al contingut
      </a>
      <AdminNav pending={pending} suppressed={suppressed} />
      <main className="adm-main" id="adm-main">
        {children}
      </main>
    </div>
  );
}
