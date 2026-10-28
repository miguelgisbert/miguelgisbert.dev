'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminIcon } from '../../_components/Icons';
import { scheduleReviewLeadsAction } from './actions';

export function ScheduleReviewButton({ count }: { count: number }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function run() {
    if (
      !window.confirm(
        `Programar ${count} ${count === 1 ? 'lead de revisió' : 'leads de revisió'} per al proper enviament? S’enviaran a les 10:30 del pròxim dia laborable.`,
      )
    ) {
      return;
    }
    setPending(true);
    try {
      const result = await scheduleReviewLeadsAction();
      if ('error' in result) {
        window.alert(result.error || 'No s’ha pogut programar.');
        return;
      }
      router.refresh();
    } catch (e) {
      window.alert(e instanceof Error ? e.message : 'No s’ha pogut programar.');
    } finally {
      setPending(false);
    }
  }

  return (
    <button className="adm-btn ghost" type="button" onClick={run} disabled={pending}>
      <AdminIcon name="clock" size={15} />
      {pending ? 'Programant…' : `Programar revisió (${count})`}
    </button>
  );
}
