import Link from 'next/link';
import { getSql, getTemplates, closeSql } from '../../../../../tools/email-outreach/lib/db.js';
import { formatDate } from '../../_components/format';

export const dynamic = 'force-dynamic';

const SEGMENT_LABEL: Record<string, string> = {
  startup: 'Startup',
  agency: 'Agència',
  enterprise: 'Empresa gran',
  sme_local: 'Pime local',
};

export default async function TemplatesPage() {
  const sql = getSql();
  try {
    const rows = await getTemplates(sql);
    return (
      <>
        <header className="adm-head">
          <div>
            <h1>Plantilles</h1>
            <p className="adm-sub">
              Un model per combinació segment × idioma (castellà per a Espanya, anglès per a la resta). Fes clic per
              editar-ho, previsualitzar-lo amb dades de mostra i enviar una prova al teu email amb el CV adjunt.
            </p>
          </div>
        </header>
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Segment</th>
                <th>Idioma</th>
                <th>Assumpte</th>
                <th>Actualitzada</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <div className="adm-empty">
                      <strong>Cap plantilla a la base de dades</strong>
                      Executa npm run migrate al repositori per crear les 8 plantilles inicials (4 segments × 2
                      idiomes).
                    </div>
                  </td>
                </tr>
              ) : (
                rows.map((t) => (
                  <tr key={t.id}>
                    <td>
                      <span className="adm-chip">{SEGMENT_LABEL[t.segment] || t.segment}</span>
                    </td>
                    <td>
                      <span className="adm-chip">{String(t.lang || 'en').toUpperCase()}</span>
                    </td>
                    <td>{t.subject}</td>
                    <td className="adm-num">{formatDate(t.updated_at, true)}</td>
                    <td>
                      <Link className="adm-btn ghost small" href={`/admin/templates/${t.id}`}>
                        Editar
                      </Link>
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
