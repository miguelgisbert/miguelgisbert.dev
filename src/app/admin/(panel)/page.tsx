import Link from 'next/link';
import {
  getSql,
  stats,
  listSuppression,
  listLeads,
  sentTodayCount,
  closeSql,
} from '../../../../tools/email-outreach/lib/db.js';
import { AdminIcon } from '../_components/Icons';
import { StatusBadge, statusMeta } from '../_components/StatusBadge';
import { DbError } from '../_components/DbError';
import { formatDate } from '../_components/format';
import outreachConfig from '../../../../tools/email-outreach/config.json';

export const dynamic = 'force-dynamic';

const DAILY_CAP = outreachConfig.dailyCap ?? 30;
const COOLDOWN_DAYS = outreachConfig.domainCooldownDays ?? 30;
const PIPELINE = ['pending', 'review', 'no_email', 'platform', 'sent', 'failed', 'guessed', 'skipped'] as const;

export default async function AdminHome() {
  let data;
  try {
    const sql = getSql();
    try {
      const [s, suppression, recentLeads, sentToday] = await Promise.all([
        stats(sql),
        listSuppression(sql, 4),
        listLeads(sql, { limit: 6 }),
        sentTodayCount(sql),
      ]);
      data = { s, suppression, recentLeads, sentToday };
    } finally {
      await closeSql();
    }
  } catch (error) {
    return <DbError error={error} />;
  }

  const { s, suppression, recentLeads, sentToday } = data;
  const totalLeads = s.leadsByStatus.reduce((acc: number, row: { n: number }) => acc + row.n, 0);
  const counts = new Map<string, number>(s.leadsByStatus.map((row: { status: string; n: number }) => [row.status, row.n]));
  const pipeline = PIPELINE.map((status) => {
    const meta = statusMeta(status);
    return { status, label: meta.label, tone: meta.tone, n: counts.get(status) ?? 0 };
  });
  const pct = Math.min(100, Math.round((sentToday / DAILY_CAP) * 100));
  const remaining = Math.max(0, DAILY_CAP - sentToday);
  const pipelineLabel = pipeline.map((row) => `${row.label}: ${row.n}`).join(', ');

  return (
    <>
      <header className="adm-head">
        <div>
          <h1>Panell</h1>
          <p className="adm-sub">
            Ofertes freelance filtrades, contactes verificats i enviament controlat. Cada matí de dilluns a
            divendres: cerca de leads nous a les 10:00 i enviament a les 10:30.
          </p>
        </div>
        <div className="adm-head-actions">
          <Link className="adm-btn ghost" href="/admin/leads?status=pending">
            Revisar pendents
          </Link>
          <Link className="adm-quiet-link" href="/admin/leads">
            Tots els leads <AdminIcon name="arrow" size={14} />
          </Link>
        </div>
      </header>

      <div className="adm-dash-grid">
        <div className="adm-stack">
          <section className="adm-card adm-send-card" aria-labelledby="send-title">
            <div>
              <h2 id="send-title" className="adm-card-title">
                Enviament d’avui
              </h2>
              <p className="adm-card-sub">
                Resend amb el CV adjunt · enviament a les 10:30 · màxim {DAILY_CAP} emails al dia.
              </p>
              <div
                className="adm-progress"
                role="progressbar"
                aria-label="Emails enviats avui"
                aria-valuemin={0}
                aria-valuemax={DAILY_CAP}
                aria-valuenow={sentToday}
              >
                <i style={{ width: `${pct}%` }} />
              </div>
              <p className="adm-hint">
                {remaining > 0
                  ? `${remaining} enviis disponibles avui. Els pendents sense pressupost passen a la propera finestra.`
                  : 'Límit diari assolit. Els pendents es reprendran a la propera finestra.'}
              </p>
            </div>
            <div className="adm-send-figure">
              <span className="adm-send-number">
                {sentToday}
                <span> / {DAILY_CAP}</span>
              </span>
              <span className="adm-send-label">emails enviats</span>
            </div>
          </section>

          <section className="adm-card" aria-labelledby="recent-title">
            <div className="adm-card-head">
              <div>
                <h2 id="recent-title" className="adm-card-title">
                  Leads per revisar
                </h2>
                <p className="adm-card-sub">Pendents, ofertes contract sense email i projectes de plataforma.</p>
              </div>
              <Link className="adm-quiet-link" href="/admin/leads">
                Veure tots <AdminIcon name="arrow" size={14} />
              </Link>
            </div>
            {recentLeads.length ? (
              <div className="adm-list">
                {recentLeads.map((lead) => (
                  <Link
                    key={lead.id}
                    className="adm-list-row"
                    href={lead.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <div className="adm-list-main">
                      <span className="adm-list-title" title={lead.title}>
                        {lead.title}
                      </span>
                      <span className="adm-list-meta">
                        {lead.company && lead.company !== lead.source ? (
                          <>
                            <span>{lead.company}</span>
                            <span className="adm-sep">·</span>
                          </>
                        ) : null}
                        <span>{lead.source}</span>
                        {lead.location ? (
                          <>
                            <span className="adm-sep">·</span>
                            <span>{lead.location}</span>
                          </>
                        ) : null}
                        <span className="adm-sep">·</span>
                        <span>{lead.published_at ? formatDate(lead.published_at) : 'Sense data'}</span>
                      </span>
                    </div>
                    <span className="adm-list-side">
                      <StatusBadge status={lead.status} />
                      <AdminIcon name="external" size={14} className="adm-row-icon" />
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="adm-empty adm-empty--icon">
                <span className="adm-empty-icon">
                  <AdminIcon name="leads" size={21} />
                </span>
                <strong>Encara cap oferta</strong>
                L’agent recull ofertes de dilluns a divendres. Pots provar-ho ara amb{' '}
                <code>npm run outreach:dry</code>, sense enviar res.
              </div>
            )}
          </section>
        </div>

        <div className="adm-stack adm-stack--side">
          <section className="adm-card" aria-labelledby="pipeline-title">
            <div className="adm-card-head">
              <div>
                <h2 id="pipeline-title" className="adm-card-title">
                  Estat dels leads
                </h2>
                <p className="adm-card-sub">{totalLeads} ofertes a la base de dades.</p>
              </div>
            </div>
            <div className="adm-card-body">
              {totalLeads > 0 ? (
                <div className="adm-pipeline-bar" role="img" aria-label={pipelineLabel}>
                  {pipeline
                    .filter((row) => row.n > 0)
                    .map((row) => (
                      <span
                        key={row.status}
                        className={`adm-pipeline-seg tone-${row.tone}`}
                        style={{ width: `${(row.n / totalLeads) * 100}%` }}
                      />
                    ))}
                </div>
              ) : null}
              <ul className="adm-legend">
                {pipeline.map((row) => (
                  <li key={row.status}>
                    <Link className={`adm-legend-row tone-${row.tone}`} href={`/admin/leads?status=${row.status}`}>
                      <span className="adm-dot" />
                      <span>{row.label}</span>
                      <strong>{row.n}</strong>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="adm-card" aria-labelledby="safety-title">
            <div className="adm-card-head">
              <div>
                <h2 id="safety-title" className="adm-card-title">
                  Protecció d’enviament
                </h2>
                <p className="adm-card-sub">Activa a cada execució de l’agent.</p>
              </div>
              <span className="adm-badge tone-ok">Activa</span>
            </div>
            <div className="adm-card-body" style={{ paddingTop: 8 }}>
              <ul className="adm-checks">
                <li>
                  <AdminIcon name="check" size={15} />
                  <span>
                    Màxim <strong>{DAILY_CAP} emails</strong> al dia
                  </span>
                </li>
                <li>
                  <AdminIcon name="check" size={15} />
                  <span>
                    <strong>{COOLDOWN_DAYS} dies</strong> de cooldown per domini
                  </span>
                </li>
                <li>
                  <AdminIcon name="check" size={15} />
                  <span>
                    <strong>Només emails publicats</strong> a l’oferta amb instrucció de CV
                  </span>
                </li>
                <li>
                  <AdminIcon name="shield" size={15} />
                  <span>
                    <strong>{s.suppressionCount}</strong> adreces a la llista de supressió
                  </span>
                </li>
              </ul>
            </div>
          </section>

          <section className="adm-card" aria-labelledby="suppression-title">
            <div className="adm-card-head">
              <div>
                <h2 id="suppression-title" className="adm-card-title">
                  Últimes supressions
                </h2>
                <p className="adm-card-sub">Baixes, rebots i errors d’enviament de Resend.</p>
              </div>
              <Link className="adm-quiet-link" href="/admin/suppression">
                Gestionar <AdminIcon name="arrow" size={14} />
              </Link>
            </div>
            {suppression.length ? (
              <div className="adm-list adm-list--compact">
                {suppression.map((row) => (
                  <Link key={row.id} className="adm-list-row" href="/admin/suppression">
                    <div className="adm-list-main">
                      <span className="adm-list-title adm-mono">{row.email || `@${row.domain}`}</span>
                      <span className="adm-list-meta">
                        <span>{row.source}</span>
                        <span className="adm-sep">·</span>
                        <span>{formatDate(row.created_at)}</span>
                      </span>
                    </div>
                    <StatusBadge status={row.reason} />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="adm-empty">
                <strong>Cap adreça suprimida</strong>
                Les baixes, els rebots i els errors d’enviament de Resend apareixeran ací automàticament.
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
