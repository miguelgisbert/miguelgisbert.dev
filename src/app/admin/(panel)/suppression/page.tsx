import { getSql, listSuppression, closeSql } from '../../../../../tools/email-outreach/lib/db.js';
import { StatusBadge } from '../../_components/StatusBadge';
import { formatDate } from '../../_components/format';
import { SuppressionForm } from './SuppressionForm';
import { RemoveButton } from './RemoveButton';

export const dynamic = 'force-dynamic';

export default async function SuppressionPage() {
  const sql = getSql();
  try {
    const rows = await listSuppression(sql, 1000);
    return (
      <>
        <header className="adm-head">
          <div>
            <h1>Llista de supressió</h1>
            <p className="adm-sub">
              Adreces i dominis als quals no s’ha d’escriure mai. Les baixes, els errors d’enviament i els
              bounces/complaints de Resend s’hi afegeixen automàticament; ací pots afegir a mà els dominis de
              les teues empreses actuals i anteriors. Les adreces que ja han rebut un CV es guarden a
              l’historial d’enviats i tampoc no es repeteixen.
            </p>
          </div>
        </header>

        <section className="adm-card" style={{ marginBottom: 24 }}>
          <div className="adm-card-head">
            <div>
              <h2 className="adm-card-title">Afegir una adreça</h2>
              <p className="adm-card-sub">Un email concret o un domini sencer, per aturar qualsevol enviament.</p>
            </div>
          </div>
          <div className="adm-card-body">
            <SuppressionForm />
          </div>
        </section>

        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Domini</th>
                <th>Motiu</th>
                <th>Font</th>
                <th>Data</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <div className="adm-empty">
                      <strong>La llista és buida</strong>
                      Quan algú fa una baixa o Resend rep un error d’enviament, l’adreça s’afegirà ací sola. Tu
                      només has d’afegir-hi els dominis d’empreses on no vols que et tornen a escriure.
                    </div>
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr key={row.id}>
                    <td className="adm-mono">{row.email || '—'}</td>
                    <td className="adm-mono">{row.domain ? `@${row.domain}` : '—'}</td>
                    <td>
                      <StatusBadge status={row.reason} />
                    </td>
                    <td>{row.source}</td>
                    <td className="adm-num">{formatDate(row.created_at, true)}</td>
                    <td>
                      <RemoveButton id={row.id} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </>
    );
  } finally {
    await closeSql();
  }
}
