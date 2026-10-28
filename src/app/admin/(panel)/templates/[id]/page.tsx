import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSql, closeSql } from '../../../../../../tools/email-outreach/lib/db.js';
import { TemplateEditor } from './TemplateEditor';

export const dynamic = 'force-dynamic';

export default async function TemplateEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isInteger(numericId)) notFound();
  const sql = getSql();
  try {
    const rows = await sql`SELECT * FROM templates WHERE id = ${numericId}`;
    const t = rows[0];
    if (!t) notFound();
    return (
      <>
        <p style={{ marginBottom: 16 }}>
          <Link className="adm-btn ghost small" href="/admin/templates">
            Tornar a plantilles
          </Link>
        </p>
        <header className="adm-head">
          <div>
            <h1>Plantilla {t.segment}</h1>
            <p className="adm-sub">
              Idioma {t.lang}. Variables disponibles: {'{greeting}'} {'{company}'} {'{job_title}'} {'{job_url}'}{' '}
              {'{signature}'} {'{unsubscribe_url}'}
            </p>
            <p className="adm-varlist">Actualitzada el {new Date(t.updated_at).toLocaleDateString('ca-ES')}</p>
          </div>
        </header>
        <TemplateEditor
          id={t.id}
          initialSubject={t.subject}
          initialBody={t.body}
          defaultTestEmail={process.env.TEST_EMAIL || process.env.REPLY_TO || ''}
        />
      </>
    );
  } finally {
    await closeSql();
  }
}
