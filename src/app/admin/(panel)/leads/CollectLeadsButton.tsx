'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminIcon } from '../../_components/Icons';
import { collectLeadsAction } from './actions';

type Message = { tone: 'ok' | 'err'; text: string } | null;

export function CollectLeadsButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<Message>(null);

  async function run() {
    setPending(true);
    setMessage(null);
    try {
      const result = await collectLeadsAction();
      if ('error' in result) {
        setMessage({ tone: 'err', text: result.error || 'No s’ha pogut completar la cerca.' });
        return;
      }
      const inserted = result.inserted ?? 0;
      const parts = [`${inserted} ${inserted === 1 ? 'lead nou' : 'leads nous'}`];
      if (result.noEmail) parts.push(`${result.noEmail} sense email`);
      if (result.review) parts.push(`${result.review} per revisar`);
      if (result.platform) parts.push(`${result.platform} de plataforma`);
      if (result.skippedCooldown) parts.push(`${result.skippedCooldown} en cooldown`);
      setMessage({
        tone: 'ok',
        text: inserted > 0 ? `${parts.join(' · ')}.` : 'Cerca completada: cap lead nou.',
      });
      router.refresh();
    } catch (e) {
      setMessage({
        tone: 'err',
        text: e instanceof Error ? e.message : 'No s’ha pogut completar la cerca.',
      });
    } finally {
      setPending(false);
    }
  }

  return (
    <span className="adm-action-group">
      <button className="adm-btn" type="button" onClick={run} disabled={pending}>
        <AdminIcon name="search" size={15} />
        {pending ? 'Cercant…' : 'Cercar nous leads'}
      </button>
      {message ? (
        <span className={`adm-action-status ${message.tone}`} role="status">
          {message.text}
        </span>
      ) : null}
    </span>
  );
}
