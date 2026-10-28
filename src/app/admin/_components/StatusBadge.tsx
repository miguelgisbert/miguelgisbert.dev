export type StatusTone = 'ok' | 'warn' | 'err' | 'guess' | 'neutral';

type Meta = { label: string; tone: StatusTone; hint?: string };

const META: Record<string, Meta> = {
  pending: {
    label: 'Pendent',
    tone: 'warn',
    hint: "Té una adreça real; s'enviarà en la propera finestra de matí.",
  },
  sent: { label: 'Enviat', tone: 'ok', hint: 'Enviat amb el CV adjunt.' },
  failed: { label: 'Fallit', tone: 'err', hint: 'Resend ha retornat un error en aquest enviament.' },
  guessed: {
    label: 'Endevinat',
    tone: 'guess',
    hint: 'Adreça genèrica o deduïda. No s’envia mai automàticament.',
  },
  no_email: { label: 'Sense email', tone: 'neutral', hint: 'Oferta freelance sense cap email publicat a la descripció.' },
  review: {
    label: 'Revisar',
    tone: 'warn',
    hint: 'Hi ha un email genèric o ambigu; revisa’l abans d’enviar res.',
  },
  platform: {
    label: 'Plataforma',
    tone: 'neutral',
    hint: 'Projecte d’una plataforma freelance; aplica-hi des de l’enllaç.',
  },
  skipped: { label: 'Descartat', tone: 'neutral', hint: 'Descartat per supressió, cooldown o filtre.' },
  unsubscribe: { label: 'Baixa', tone: 'ok', hint: 'L’adreça ha sol·licitat no rebre més correus.' },
  send_failure: { label: 'Error enviament', tone: 'err', hint: 'Resend ha retornat un error; l’adreça s’ha suprimit.' },
  bounce: { label: 'Bounce', tone: 'err', hint: 'El correu ha rebotat; l’adreça s’ha suprimit.' },
  complaint: { label: 'Spam', tone: 'err', hint: 'L’adreça ha marcat el correu com a spam.' },
  manual: { label: 'Manual', tone: 'neutral', hint: 'Afegit manualment des del panell.' },
  employer: { label: 'Empleador', tone: 'warn', hint: 'Domini de l’ocupador actual.' },
  client_past: { label: 'Client anterior', tone: 'warn', hint: 'Domini d’un client anterior.' },
};

export function statusMeta(status: string): Meta {
  return META[status] ?? { label: status, tone: 'neutral' };
}

export function StatusBadge({ status, className = '' }: { status: string; className?: string }) {
  const meta = statusMeta(status);
  return (
    <span
      className={`adm-badge tone-${meta.tone} ${className}`.trim()}
      title={meta.hint}
    >
      {meta.label}
    </span>
  );
}
