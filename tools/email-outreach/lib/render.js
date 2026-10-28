import { shortTitle, htmlFromText } from './util.js';

export const SIGNATURE_TEXT = ['--', 'Miguel Gisbert', 'www.miguelgisbert.dev', '+34 655850243'].join('\n');

export function renderSubject(tpl, vars) {
  return String(tpl || '')
    .replaceAll('{company}', vars.company || '')
    .replaceAll('{job_title}', shortTitle(vars.jobTitle || ''))
    .trim();
}

export function renderBody(tpl, vars) {
  const company = vars.company || 'your team';
  const lang = vars.lang === 'es' ? 'es' : 'en';
  const hasContact = Boolean(vars.contactName);

  const greeting = hasContact
    ? lang === 'es'
      ? `Hola ${vars.contactName},`
      : `Hi ${vars.contactName},`
    : lang === 'es'
      ? `Hola, equipo de ${company},`
      : `Hi ${company} team,`;

  return String(tpl || '')
    .replaceAll('{greeting}', greeting)
    .replaceAll('{company}', company)
    .replaceAll('{job_title}', shortTitle(vars.jobTitle || ''))
    .replaceAll('{job_url}', vars.jobUrl || '')
    .replaceAll('{signature}', SIGNATURE_TEXT)
    .replaceAll('{unsubscribe_url}', vars.unsubscribeUrl || 'https://miguelgisbert.dev')
    .trim();
}

function signatureHtml() {
  return `<div style="margin-top:28px;padding-top:16px;border-top:1px solid #e5e7eb;font-size:14px;line-height:1.55;color:#1f2328;">
  <p style="margin:0 0 6px;color:#6b7280;">--</p>
  <p style="margin:0 0 2px;font-size:16px;font-weight:600;color:#111827;">Miguel Gisbert</p>
  <p style="margin:0;"><a href="https://miguelgisbert.dev" style="color:#0b57d0;text-decoration:underline;">www.miguelgisbert.dev</a></p>
  <p style="margin:0;">+34 655850243</p>
</div>`;
}

export function renderHtmlBody(tpl, vars) {
  const text = renderBody(tpl, vars);
  const index = text.lastIndexOf(SIGNATURE_TEXT);
  const main = index >= 0 ? text.slice(0, index).trimEnd() : text;
  const html = htmlFromText(main, { jobUrl: vars.jobUrl, lang: vars.lang });
  return `<div style="background:#ffffff;color:#1f2328;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:15px;line-height:1.65;max-width:640px;margin:0 auto;padding:8px 0;">${html}${signatureHtml()}</div>`;
}

export function pickTemplate(templates, segment, lang) {
  const seg = ['startup', 'agency', 'enterprise', 'sme_local'].includes(segment) ? segment : 'enterprise';
  const l = lang === 'es' ? 'es' : 'en';
  return (
    templates.find((t) => t.segment === seg && t.lang === l) ||
    templates.find((t) => t.segment === seg && t.lang === 'en') ||
    templates.find((t) => t.segment === 'enterprise' && t.lang === l) ||
    templates.find((t) => t.segment === 'enterprise' && t.lang === 'en') ||
    templates[0]
  );
}

export function classifySegment(text, config) {
  const hay = String(text || '').toLowerCase();
  for (const [segment, words] of Object.entries(config.segmentKeywords || {})) {
    if (words.some((w) => hay.includes(String(w).toLowerCase()))) return segment;
  }
  return 'enterprise';
}
