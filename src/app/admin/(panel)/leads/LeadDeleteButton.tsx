'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminIcon } from '../../_components/Icons';
import { deleteLeadAction } from './actions';

export function LeadDeleteButton({ id, title }: { id: number; title: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function run() {
    if (!window.confirm(`Esborrar «${title.slice(0, 80)}»? Aquesta acció no es pot desfer.`)) return;
    setPending(true);
    try {
      const result = await deleteLeadAction(id);
      if ('error' in result) {
        window.alert(result.error || 'No s’ha pogut esborrar.');
        return;
      }
      router.refresh();
    } catch (e) {
      window.alert(e instanceof Error ? e.message : 'No s’ha pogut esborrar.');
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      className="adm-icon-btn danger"
      type="button"
      onClick={run}
      disabled={pending}
      title="Esborrar lead"
      aria-label={`Esborrar ${title}`}
    >
      <AdminIcon name="trash" size={15} />
    </button>
  );
}
