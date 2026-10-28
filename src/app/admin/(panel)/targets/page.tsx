import { getSql, getTargets, closeSql } from '../../../../../tools/email-outreach/lib/db.js';
import { TargetForm } from './TargetForm';
import { RemoveTargetButton } from './RemoveTargetButton';

export const dynamic = 'force-dynamic';

const SEGMENT_LABEL: Record<string, string> = {
  startup: 'Startup',
  agency: 'Agència',
  enterprise: 'Empresa',
  sme_local: 'Pime local',
};

export default async function TargetsPage() {
  const sql = getSql();
  try {
    const rows = await getTargets(sql);
    return (
      <>
        <header className="adm-head">
          <div>
            <h1>Dianes curades</h1>
            <p className="adm-sub">
              Empreses que vols fer seguiment. Amb un email de contacte o una placa ATS (Greenhouse, Lever, Ashby,
              SmartRecruiters), l’agent en trau les ofertes i els escriu directament amb el segment que triïs.
            </p>
          </div>
        </header>

        <section className="adm-card" style={{ marginBottom: 24 }}>
          <div className="adm-card-head">
            <div>
              <h2 className="adm-card-title">Afegir una diana</h2>
              <p className="adm-card-sub">Només el nom ja activa la cerca al web de l’empresa.</p>
            </div>
          </div>
          <div className="adm-card-body">
            <TargetForm />
          </div>
        </section>

        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Empresa</th>
                <th>Domini</th>
                <th>Contacte</th>
                <th>Segment</th>
                <th>ATS</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <div className="adm-empty">
                      <strong>Cap diana encara</strong>
                      Afegeix ací les empreses on t’agradaria treballar: el nom i el domini ja activen la cerca
                      d’ofertes a la seva web; amb email o placa ATS, l’agent contacta directament.
                    </div>
                  </td>
                </tr>
              ) : (
                rows.map((target) => (
                  <tr key={target.id}>
                    <td>
                      {target.website ? (
                        <a className="adm-lead-link" href={target.website} target="_blank" rel="noreferrer">
                          {target.company}
                        </a>
                      ) : (
                        target.company
                      )}
                    </td>
                    <td className="adm-mono">{target.domain || '—'}</td>
                    <td className="adm-mono">{target.contact_email || '—'}</td>
                    <td>
                      <span className="adm-chip">{SEGMENT_LABEL[target.segment] || target.segment}</span>
                    </td>
                    <td className="adm-mono">
                      {target.ats_type ? `${target.ats_type}/${target.ats_slug}` : '—'}
                    </td>
                    <td>
                      <RemoveTargetButton id={target.id} />
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
