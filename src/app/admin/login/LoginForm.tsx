'use client';

import { useActionState } from 'react';
import { AdminIcon } from '../_components/Icons';
import { login } from '../actions';

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, null);
  return (
    <form action={formAction} className="adm-login-card">
      <div className="adm-login-brand">
        <span className="adm-brand-mark">
          <AdminIcon name="terminal" size={16} />
        </span>
        <span>
          Outreach
          <small>miguelgisbert.dev</small>
        </span>
      </div>
      <h1>Accés privat</h1>
      <p>Introdueix la contrasenya del panell per revisar leads i enviaments.</p>
      {state?.error ? <div className="adm-error">{state.error}</div> : null}
      <label className="adm-field">
        Contrasenya
        <input
          className="adm-input"
          type="password"
          name="password"
          autoFocus
          autoComplete="current-password"
          required
        />
      </label>
      <button className="adm-btn" type="submit" disabled={pending}>
        {pending ? 'Entrant…' : 'Entrar'}
      </button>
      <p className="adm-login-foot">Panell privat de Miguel Gisbert. Sense accés per a tercers.</p>
    </form>
  );
}
