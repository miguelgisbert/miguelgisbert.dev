'use client';

import { useActionState } from 'react';
import { AdminSelect } from '../../_components/AdminSelect';
import { addTargetAction } from './actions';

const SEGMENTS = [
  { value: 'startup', label: 'Startup' },
  { value: 'agency', label: 'Agència' },
  { value: 'enterprise', label: 'Empresa gran' },
  { value: 'sme_local', label: 'Pime local' },
];

const ATS_TYPES = [
  { value: '', label: '—' },
  { value: 'greenhouse', label: 'Greenhouse' },
  { value: 'lever', label: 'Lever' },
  { value: 'ashby', label: 'Ashby' },
  { value: 'smartrecruiters', label: 'SmartRecruiters' },
];

export function TargetForm() {
  const [state, formAction, pending] = useActionState(addTargetAction, null);
  return (
    <>
      {state?.error ? <div className="adm-error">{state.error}</div> : null}
      {state?.ok ? <div className="adm-ok">{state.ok}</div> : null}
      <form action={formAction} className="adm-form">
        <label className="adm-field grow">
          Empresa *
          <input className="adm-input" name="company" required placeholder="Acme Inc" />
        </label>
        <label className="adm-field">
          Domini
          <input className="adm-input" name="domain" placeholder="acme.com" />
        </label>
        <label className="adm-field">
          Web
          <input className="adm-input" name="website" placeholder="https://acme.com" />
        </label>
        <label className="adm-field">
          Email contacte
          <input className="adm-input" name="contactEmail" type="email" placeholder="laura@acme.com" />
        </label>
        <label className="adm-field">
          Nom contacte
          <input className="adm-input" name="contactName" placeholder="Laura" />
        </label>
        <div className="adm-field">
          <label htmlFor="target-segment">Segment</label>
          <AdminSelect
            id="target-segment"
            name="segment"
            label="Segment"
            defaultValue="enterprise"
            options={SEGMENTS}
          />
        </div>
        <div className="adm-field">
          <label htmlFor="target-ats-type">ATS tipus</label>
          <AdminSelect
            id="target-ats-type"
            name="atsType"
            label="ATS tipus"
            defaultValue=""
            options={ATS_TYPES}
          />
        </div>
        <label className="adm-field">
          ATS slug
          <input className="adm-input" name="atsSlug" placeholder="acme" />
        </label>
        <button className="adm-btn" type="submit" disabled={pending}>
          {pending ? 'Afegint…' : 'Afegir diana'}
        </button>
      </form>
    </>
  );
}
