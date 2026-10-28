'use client';

import { useRouter } from 'next/navigation';
import { removeTargetAction } from './actions';

export function RemoveTargetButton({ id }: { id: number }) {
  const router = useRouter();
  return (
    <button
      className="adm-btn danger small"
      type="button"
      onClick={async () => {
        if (!confirm('Eliminar aquesta diana?')) return;
        await removeTargetAction(id);
        router.refresh();
      }}
    >
      Eliminar
    </button>
  );
}
