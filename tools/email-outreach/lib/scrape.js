import { domainFromUrl, stripTags } from './util.js';
import { isBoardHost, isBoardEmail } from './boards.js';

const EMAIL_RE = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
const COMMON_TLDS = new Set(
  'com org net io ai dev co uk es de fr nl eu us ca app tech xyz me info biz online site space cloud software digital agency studio solutions group team work jobs careers pro store shop world global one media design code codes systems services consulting finance health education gov edu mil int cat gal sbs live life academy school institute foundation company ventures capital partners legal engineering network host run build tools to ly cc tv vc fm gg sh in pk id ae sa qa ke ng za br mx ar cl ch li'.split(' '),
);

function normalizeEmail(email) {
  const at = String(email || '').lastIndexOf('@');
  if (at <= 0) return null;
  const local = email.slice(0, at);
  const parts = email.slice(at + 1).toLowerCase().split('.');
  while (parts.length > 2 && !COMMON_TLDS.has(parts[parts.length - 1])) parts.pop();
  if (parts.length < 2 || !COMMON_TLDS.has(parts[parts.length - 1])) return null;
  return `${local}@${parts.join('.')}`;
}
const EMAIL_DENY = /@(example|domain|email|yourdomain|company|acme|sentry|github|cloudflare|amazonaws|vercel|localhost|emailjs|sendgrid|mailgun|engineer)\./i;
const ROLE_DENY = /^(noreply|no-reply|donotreply|do-not-reply|bounce|postmaster|abuse|support|sales|privacy|example|test|user|yourname|name|email)@/i;
const GENERIC_LOCAL =
  /^(info|contact|hello|hola|jobs|job|careers|career|hiring|hire|team|office|admin|mail|enquiries|inquiries|empleo|rrhh|hr|people|recruiting|recruitment|talent)([._+-].*)?$/i;

const CONTACT_ROLE =
  '(?:recruiter|talent\\s+(?:acquisition|partner|manager)|founder|co-?founder|cto|ceo|hiring\\s+manager|head\\s+of\\s+(?:engineering|talent|people)|people\\s+(?:ops|operations))';
const PERSON_NAME = '[A-Z][a-z]{2,}(?:\\s+[A-Z][a-z]{2,})?';
const ROLE_THEN_NAME = new RegExp(`(?:${CONTACT_ROLE})\\s*[:,\\-–—(]?\\s*(${PERSON_NAME})`, 'g');
const NAME_THEN_ROLE = new RegExp(`(${PERSON_NAME})\\s*[\\(,–—-]\\s*(?:our\\s+|the\\s+)?(?:${CONTACT_ROLE})`, 'g');

const APPLY_RE =
  /(?:send|email|forward|share|attach|submit|apply)[^.\n]{0,130}(?:cv|resume|résumé|application|portfolio)|(?:cv|resume|résumé)[^.\n]{0,80}(?:to|at|via)\b|apply (?:via|by) email|email (?:your|us|me) (?:cv|resume)|(?:env[ií]a|envia|manda|remite|adjunta|comparte|aplica)[^.\n]{0,130}(?:cv|curr[ií]culum|curriculum|portfolio|carta de presentaci[oó]n)|(?:cv|curr[ií]culum)[^.\n]{0,80}(?:a|al)\b|escr[ií]be(?:me|nos)?\s+a|contacta(?:me|nos)?/i;

export function hasApplyInstruction(text) {
  const plain = stripTags(String(text || '')).slice(0, 12000);
  return Boolean(plain && APPLY_RE.test(plain));
}

export function isGenericAddress(email) {
  const local = String(email || '').split('@')[0] || '';
  return GENERIC_LOCAL.test(local);
}

/**
 * Detecta si l'oferta esmenta explícitament una persona de contacte
 * (recruiter, founder, CTO…) amb un nom propi a prop. Només en aquest cas
 * s'accepta una adreça genèrica publicada.
 */
export function hasNamedContact(text) {
  const plain = stripTags(String(text || '')).slice(0, 20000);
  if (!plain) return false;
  ROLE_THEN_NAME.lastIndex = 0;
  NAME_THEN_ROLE.lastIndex = 0;
  return ROLE_THEN_NAME.test(plain) || NAME_THEN_ROLE.test(plain);
}

export function extractEmails(text, sourceHost = '') {
  const found = String(text || '').match(EMAIL_RE) || [];
  const out = [];
  for (let raw of found) {
    raw = raw.toLowerCase().replace(/[.,;:)\]]+$/, '');
    const email = normalizeEmail(raw);
    if (!email) continue;
    if (EMAIL_DENY.test(email) || ROLE_DENY.test(email)) continue;
    if (isBoardEmail(email)) continue;
    const domain = email.split('@')[1];
    if (sourceHost && isBoardHost(sourceHost) && (domain === sourceHost || sourceHost.endsWith(`.${domain}`))) continue;
    if (!out.includes(email)) out.push(email);
  }
  return out;
}


/**
 * Només acceptem emails que apareguen explícitament a la descripció de
 * l'oferta. No inventem adreces ni raspem pàgines de contacte genèriques:
 * l'objectiu és enviar el CV on l'oferta demana fer-ho.
 *
 * - posted: email real dins la descripció (amb `apply` si demana CV)
 * - target: email de la taula de dianes (revisat per l'usuari)
 */
export async function discoverEmail(lead) {
  const sourceHost = domainFromUrl(lead.url);
  const explicit = hasNamedContact(lead.description);
  const posted = extractEmails(lead.description, sourceHost);

  if (posted.length) {
    // Prioritza l'adreça que té una instrucció d'enviar CV a prop.
    let chosen = posted[0];
    let apply = false;
    const plain = String(lead.description || '').toLowerCase();
    for (const email of posted) {
      const idx = plain.indexOf(email.toLowerCase());
      if (idx === -1) continue;
      const around = String(lead.description || '').slice(Math.max(0, idx - 260), idx + 260);
      if (hasApplyInstruction(around)) {
        chosen = email;
        apply = true;
        break;
      }
    }
    if (!apply) apply = hasApplyInstruction(lead.description);
    return {
      email: chosen,
      method: 'posted',
      verified: true,
      generic: isGenericAddress(chosen),
      explicit,
      apply,
    };
  }

  if (lead.targetEmail) {
    const email = lead.targetEmail.toLowerCase();
    return {
      email,
      method: 'target',
      verified: true,
      generic: isGenericAddress(email),
      explicit: true,
      apply: true,
    };
  }

  return null;
}

export { stripTags };
