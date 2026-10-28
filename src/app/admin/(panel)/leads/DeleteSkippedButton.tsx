'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminIcon } from '../../_components/Icons';
import { deleteSkippedLeadsAction } from './actions';

export function DeleteSkippedButton({ count }: { count: number }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');

  async function run() {
    if (
      !window.confirm(
        `Esborrar ${count} ${count === 1 ? 'lead descartat' : 'leads descartats'}? Aquesta acció no es pot desfer.`,
      )
    ) {
      return;
    }
    setPending(true);
    setError('');
    try {
      const result = await deleteSkippedLeadsAction();
      if ('error' in result) {
        setError(result.error || 'No s’han pogut esborrar.');
        return;
      }
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No s’han pogut esborrar.');
    } finally {
      setPending(false);
    }
  }

  return (
    <span className="adm-action-group">
      <button className="adm-btn danger" type="button" onClick={run} disabled={pending}>
        <AdminIcon name="trash" size={15} />
        {pending ? 'Esborrant…' : `Esborrar descartats (${count})`}
      </button>
      {error ? (
        <span className="adm-action-status err" role="status">
          {error}
        </span>
      ) : null}
    </span>
  );
}
