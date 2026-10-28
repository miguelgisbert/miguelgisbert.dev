'use client';

import { useRouter } from 'next/navigation';
import { removeSuppressionAction } from './actions';

export function RemoveButton({ id }: { id: number }) {
  const router = useRouter();
  return (
    <button
      className="adm-btn danger small"
      type="button"
      onClick={async () => {
        if (!confirm('Eliminar de la llista de supressió?')) return;
        await removeSuppressionAction(id);
        router.refresh();
      }}
    >
      Eliminar
    </button>
  );
}
