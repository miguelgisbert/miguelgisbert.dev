'use client';

import { useActionState } from 'react';
import { AdminSelect } from '../../_components/AdminSelect';
import { addSuppressionAction } from './actions';

const REASONS = [
  { value: 'manual', label: 'Manual' },
  { value: 'employer', label: 'Empleador actual' },
  { value: 'client_past', label: 'Client anterior' },
];

export function SuppressionForm() {
  const [state, formAction, pending] = useActionState(addSuppressionAction, null);
  return (
    <>
      {state?.error ? <div className="adm-error">{state.error}</div> : null}
      {state?.ok ? <div className="adm-ok">{state.ok}</div> : null}
      <form action={formAction} className="adm-form">
        <label className="adm-field grow">
          Email o domini
          <input className="adm-input" name="target" placeholder="alguien@empresa.com o empresa.com" required />
        </label>
        <div className="adm-field">
          <label htmlFor="suppression-reason">Motiu</label>
          <AdminSelect
            id="suppression-reason"
            name="reason"
            label="Motiu"
            defaultValue="manual"
            options={REASONS}
          />
        </div>
        <button className="adm-btn" type="submit" disabled={pending}>
          {pending ? 'Afegint…' : 'Afegir'}
        </button>
      </form>
    </>
  );
}
