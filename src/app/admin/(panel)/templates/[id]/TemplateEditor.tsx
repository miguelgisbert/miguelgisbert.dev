'use client';

import { useActionState, useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveTemplateAction, previewTemplateAction, sendTestAction } from './actions';

export function TemplateEditor({
  id,
  initialSubject,
  initialBody,
  defaultTestEmail,
}: {
  id: number;
  initialSubject: string;
  initialBody: string;
  defaultTestEmail: string;
}) {
  const router = useRouter();
  const [saveState, saveAction, saving] = useActionState(saveTemplateAction.bind(null, id), null);
  const [testState, testAction, testing] = useActionState(sendTestAction.bind(null, id), null);
  const [preview, setPreview] = useState('');
  const [previewError, setPreviewError] = useState('');
  const [to, setTo] = useState(defaultTestEmail);

  return (
    <>
      {saveState?.error ? <div className="adm-error">{saveState.error}</div> : null}
      {saveState?.ok ? <div className="adm-ok">{saveState.ok}</div> : null}
      {testState?.error ? <div className="adm-error">{testState.error}</div> : null}
      {testState?.ok ? <div className="adm-ok">{testState.ok}</div> : null}

      <form action={saveAction}>
        <div className="adm-field" style={{ marginBottom: 14 }}>
          Assumpte
          <input className="adm-input" name="subject" defaultValue={initialSubject} required />
        </div>
        <div className="adm-field" style={{ marginBottom: 14 }}>
          Cos
          <textarea className="adm-input" name="body" defaultValue={initialBody} required spellCheck={false} />
        </div>
        <div className="adm-inline" style={{ marginBottom: 28 }}>
          <button className="adm-btn" type="submit" disabled={saving}>
            {saving ? 'Desant…' : 'Desar canvis'}
          </button>
          <button
            className="adm-btn ghost"
            type="button"
            disabled={saving}
            onClick={async () => {
              setPreviewError('');
              setPreview('Generant…');
              const r = await previewTemplateAction(id);
              if (r.error) {
                setPreview('');
                setPreviewError(r.error);
              } else {
                setPreview(r.preview || '');
              }
            }}
          >
            Previsualitzar amb dades de mostra
          </button>
        </div>
      </form>

      {previewError ? <div className="adm-error">{previewError}</div> : null}
      {preview ? (
        <>
          <h2 style={{ fontSize: 15, fontWeight: 650, marginBottom: 10 }}>Previsualització</h2>
          <div className="adm-preview" style={{ marginBottom: 28 }}>
            {preview}
          </div>
        </>
      ) : null}

      <form
        action={testAction}
        className="adm-form"
        onSubmit={() => {
          router.refresh();
        }}
      >
        <label className="adm-field grow">
          Enviar prova a
          <input
            className="adm-input"
            name="to"
            type="email"
            placeholder="email de prova"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            required
          />
        </label>
        <button className="adm-btn" type="submit" disabled={testing}>
          {testing ? 'Enviant…' : 'Enviar prova (amb CV adjunt)'}
        </button>
      </form>
    </>
  );
}
