import Link from 'next/link';
import { getSql, listLeads, stats, closeSql } from '../../../../../tools/email-outreach/lib/db.js';
import { AdminIcon } from '../../_components/Icons';
import { StatusBadge } from '../../_components/StatusBadge';
import { DbError } from '../../_components/DbError';
import { formatDate } from '../../_components/format';
import { CollectLeadsButton } from './CollectLeadsButton';
import { DeleteSkippedButton } from './DeleteSkippedButton';
import { LeadDeleteButton } from './LeadDeleteButton';
import { ScheduleReviewButton } from './ScheduleReviewButton';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const TABS = [
  { value: '', label: 'Tots' },
  { value: 'pending', label: 'Pendents' },
  { value: 'review', label: 'Revisió' },
  { value: 'no_email', label: 'Sense email' },
  { value: 'platform', label: 'Plataforma' },
  { value: 'sent', label: 'Enviats' },
  { value: 'failed', label: 'Fallits' },
  { value: 'guessed', label: 'Endevinats' },
  { value: 'skipped', label: 'Descartats' },
] as const;

const SEGMENT_LABEL: Record<string, string> = {
  startup: 'Startup',
  agency: 'Agència',
  enterprise: 'Empresa',
  sme_local: 'Pime local',
};

function employmentLabel(value: string | null) {
  const s = String(value || '').toLowerCase();
  if (/freelanc/.test(s)) return 'Freelance';
  if (/part/.test(s)) return 'Part time';
  if (/temporary|interim|fixed/.test(s)) return 'Temporary';
  if (/contract|self/.test(s)) return 'Contract';
  return value;
}

function contactMeta(method: string | null, status: string) {
  if (status === 'guessed' && method === 'guessed') {
    return { label: 'Deduit del domini · no s’envia', tone: 'is-guess' };
  }
  if (status === 'guessed' && method === 'posted') {
    return { label: 'Genèric sense contacte nominal · no s’envia', tone: 'is-guess' };
  }
  switch (method) {
    case 'posted':
      return { label: 'Publicat a l’oferta', tone: 'is-ok' };
    case 'mailto':
      return { label: 'Publicat al web de l’empresa', tone: 'is-ok' };
    case 'target':
      return { label: 'Diana manual', tone: 'is-ok' };
    case 'guessed':
      return { label: 'Adreça deduïda · no s’envia', tone: 'is-guess' };
    default:
      return null;
  }
}

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const params = await searchParams;
  const valid = TABS.some((tab) => tab.value === params.status) ? params.status : undefined;
  const query = String(params.q || '').trim().slice(0, 80);

  let rows;
  let allCounts;
  try {
    const sql = getSql();
    try {
      const [leads, s] = await Promise.all([
        listLeads(sql, { limit: 300, status: valid || null, q: query || null }),
        stats(sql),
      ]);
      rows = leads;
      allCounts = s.leadsByStatus as Array<{ status: string; n: number }>;
    } finally {
      await closeSql();
    }
  } catch (error) {
    return <DbError error={error} />;
  }

  const counts = new Map<string, number>(allCounts.map((row) => [row.status, row.n]));
  const hasSearchKey = Boolean(process.env.SERPER_API_KEY || process.env.TAVILY_API_KEY);
  const total = allCounts.reduce((acc, row) => acc + row.n, 0);
  const hrefFor = (value: string) => {
    const next = new URLSearchParams();
    if (value) next.set('status', value);
    if (query) next.set('q', query);
    const qs = next.toString();
    return qs ? `/admin/leads?${qs}` : '/admin/leads';
  };
  const clearHref = valid ? `/admin/leads?status=${valid}` : '/admin/leads';

  return (
    <>
      <header className="adm-head">
        <div>
          <h1>Leads</h1>
          <p className="adm-sub">
            Publicacions de LinkedIn amb email per enviar el CV. Les que són freelance/contract i remotes
            passen a pendents; la resta queda per revisió manual. La cerca s’executa cada matí de dilluns a
            divendres a les 10:00.
          </p>
        </div>
        <div className="adm-head-actions">
          <CollectLeadsButton />
          {counts.get('review') ? <ScheduleReviewButton count={counts.get('review') || 0} /> : null}
          {counts.get('skipped') ? <DeleteSkippedButton count={counts.get('skipped') || 0} /> : null}
          <Link className="adm-btn ghost" href="/admin">
            Tornar al panell
          </Link>
        </div>
      </header>

      <div className="adm-callout">
        <AdminIcon name="shield" size={17} />
        <p>
          <strong>Enviament segur.</strong> Només s’envien emails que apareixen publicats a la descripció de
          l’oferta i que demanen enviar el CV. Les adreces deduïdes o genèriques sense instrucció queden per
          revisió manual i no s’envien mai.
        </p>
      </div>

      {!hasSearchKey ? (
        <div className="adm-callout">
          <AdminIcon name="alert" size={17} />
          <p>
            <strong>Cerca només a LinkedIn.</strong> Configura <code>SERPER_API_KEY</code> (2.500 consultes
            gratis, sense targeta) i <code>TAVILY_API_KEY</code> (1.000/mes, sense targeta). Tavily keyless també
            funciona sense clau, però va limitat.
          </p>
        </div>
      ) : null}

      <div className="adm-tabs" role="navigation" aria-label="Filtrar leads per estat">
        {TABS.map((tab) => {
          const count = tab.value ? counts.get(tab.value) ?? 0 : total;
          const active = (valid || '') === tab.value;
          return (
            <Link key={tab.value || 'all'} href={hrefFor(tab.value)} aria-current={active ? 'page' : undefined}>
              {tab.label}
              <span className="adm-tab-count">{count}</span>
            </Link>
          );
        })}
      </div>

      <form className="adm-toolbar" method="get" action="/admin/leads" role="search">
        {valid ? <input type="hidden" name="status" value={valid} /> : null}
        <div className="adm-search">
          <AdminIcon name="search" size={16} />
          <input
            className="adm-input"
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Cerca per oferta, empresa, domini o email"
            aria-label="Cercar leads"
          />
        </div>
        <button className="adm-btn ghost" type="submit">
          Cercar
        </button>
        {query ? (
          <Link className="adm-quiet-link" href={clearHref}>
            Neteja
          </Link>
        ) : null}
        <span className="adm-toolbar-meta">
          {rows.length} {rows.length === 1 ? 'resultat' : 'resultats'}
        </span>
      </form>

      <div className="adm-table-wrap">
        <table className="adm-table adm-table--cards">
          <thead>
            <tr>
              <th>Oferta</th>
              <th>Contacte</th>
              <th>Tipus</th>
              <th>Estat</th>
              <th>Publicat</th>
              <th className="adm-actions-cell">Accions</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <div className="adm-empty adm-empty--icon">
                    <span className="adm-empty-icon">
                      <AdminIcon name="leads" size={21} />
                    </span>
                    <strong>
                      {query
                        ? `Cap resultat per a «${query}»`
                        : valid
                          ? 'Cap lead amb aquest estat'
                          : 'Encara cap oferta'}
                    </strong>
                    {query
                      ? 'Prova una altra cerca o neteja el filtre.'
                      : valid
                        ? 'Canvia de pestanya per veure la resta de leads.'
                        : 'L’agent fa la cerca web cada matí de dilluns a divendres a les 10:00. Per recollir-ne ara, configura una clau de cerca i usa «Cercar nous leads».'}
                  </div>
                </td>
              </tr>
            ) : (
              rows.map((lead) => {
                const contact = contactMeta(lead.email_method, lead.status);
                return (
                  <tr key={lead.id}>
                    <td data-label="Oferta" style={{ maxWidth: 430 }}>
                      <a className="adm-lead-link" href={lead.url} target="_blank" rel="noreferrer">
                        {lead.title}
                      </a>
                      <div className="adm-cell-meta">
                        {lead.company && lead.company !== lead.source ? (
                          <>
                            <span>{lead.company}</span>
                            <span>·</span>
                          </>
                        ) : null}
                        <span>{lead.source}</span>
                        {lead.location ? (
                          <>
                            <span>·</span>
                            <span>{lead.location}</span>
                          </>
                        ) : null}
                        <span>·</span>
                        <span>puntuació {lead.score}</span>
                      </div>
                    </td>
                    <td data-label="Contacte">
                      <span className="adm-mono adm-email">{lead.contact_email || '—'}</span>
                      {contact ? <span className={`adm-method ${contact.tone}`}>{contact.label}</span> : null}
                    </td>
                    <td data-label="Tipus">
                      {lead.employment_type ? (
                        <span className="adm-chip adm-chip--accent">{employmentLabel(lead.employment_type)}</span>
                      ) : null}{' '}
                      <span className="adm-chip">{SEGMENT_LABEL[lead.segment] || lead.segment}</span>{' '}
                      <span className="adm-chip">{String(lead.lang || 'en').toUpperCase()}</span>
                    </td>
                    <td data-label="Estat">
                      <StatusBadge status={lead.status} />
                      {lead.error && lead.status !== 'platform' ? (
                        <span className={`adm-cell-note ${lead.status === 'failed' ? 'is-error' : ''}`}>
                          {lead.error.slice(0, 140)}
                        </span>
                      ) : null}
                    </td>
                    <td data-label="Publicat" className="adm-num">
                      <span
                        className="adm-list-date"
                        title={
                          lead.published_at
                            ? `Publicat: ${String(lead.published_at)} · Afegit: ${String(lead.created_at)}`
                            : `Data de publicació no indicada · Afegit: ${String(lead.created_at)}`
                        }
                      >
                        {lead.published_at ? formatDate(lead.published_at) : 'No indicat'}
                      </span>
                    </td>
                    <td data-label="Accions" className="adm-actions-cell">
                      <LeadDeleteButton id={lead.id} title={lead.title} />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
