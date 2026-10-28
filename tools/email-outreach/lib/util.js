export const UA =
  'Mozilla/5.0 (X11; Linux x86_64) miguelgisbert-outreach/1.0 (personal freelance outreach)';

export function decodeEntities(s = '') {
  const cp = (n) => {
    try {
      return String.fromCodePoint(n);
    } catch {
      return '';
    }
  };
  return String(s)
    .replace(/<!\[CDATA\[|\]\]>/g, '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&#x27;|&apos;/g, "'")
    .replace(/&rsquo;|&lsquo;/g, "'")
    .replace(/&rdquo;|&ldquo;/g, '"')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => cp(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => cp(parseInt(d, 10)))
    .replace(/&amp;/g, '&');
}

export function stripTags(s = '') {
  const unwrapped = String(s).replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1');
  // Decodifica primer perquè els feeds sovint escapen l'HTML (&lt;p&gt;) i,
  // si no, els tags quedarien com a text dins de la descripció.
  return decodeEntities(unwrapped)
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function escRe(w) {
  return String(w).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export async function fetchText(url, timeout = 15000) {
  const res = await fetch(url, {
    headers: { 'user-agent': UA, accept: '*/*' },
    signal: AbortSignal.timeout(timeout),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

export async function fetchJson(url, init = {}, timeout = 15000) {
  const headers = {
    'user-agent': UA,
    accept: 'application/json',
    ...(init.headers || {}),
  };
  if (init.body && !Object.keys(headers).some((key) => key.toLowerCase() === 'content-type')) {
    headers['content-type'] = 'application/json';
  }
  const res = await fetch(url, {
    ...init,
    headers,
    signal: AbortSignal.timeout(timeout),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export function domainFromUrl(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '').toLowerCase();
  } catch {
    return '';
  }
}

export function normUrl(u) {
  return (u || '').replace(/[?#].*$/, '').replace(/\/$/, '').toLowerCase();
}

export function companyNameFromUrl(url) {
  try {
    const u = new URL(url);
    if (/(?:boards|job-boards)\.greenhouse\.io$/i.test(u.hostname) || u.hostname === 'jobs.lever.co') {
      const seg = u.pathname.split('/').filter(Boolean)[0];
      return seg ? seg.replace(/[-_]/g, ' ') : '';
    }
    const ab = u.hostname.match(/^([a-z0-9-]+)\.ashbyhq\.com$/i);
    if (ab) return ab[1].replace(/[-_]/g, ' ');
    const sr = u.hostname.match(/^(?:jobs|careers)\.smartrecruiters\.com$/i);
    if (sr) {
      const seg = u.pathname.split('/').filter(Boolean)[0];
      return seg ? seg.replace(/[-_]/g, ' ') : '';
    }
    const host = u.hostname.replace(/^www\./, '');
    return host.split('.')[0].replace(/[-_]/g, ' ');
  } catch {
    return '';
  }
}

export function parseRssItems(xml) {
  const items = [];
  let m;
  const itemRe = /<item[\s>]([\s\S]*?)<\/item>/gi;
  while ((m = itemRe.exec(xml))) {
    const block = m[1];
    const pick = (tag) => {
      const r = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i');
      const found = block.match(r);
      return found ? found[1].trim() : '';
    };
    items.push({
      title: stripTags(pick('title')),
      link: stripTags(pick('link')),
      description: pick('description') || pick('content:encoded') || '',
      date: pick('pubDate') || pick('dc:date'),
    });
  }
  const entryRe = /<entry[\s>]([\s\S]*?)<\/entry>/gi;
  while ((m = entryRe.exec(xml))) {
    const block = m[1];
    const pick = (tag) => {
      const r = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i');
      const found = block.match(r);
      return found ? found[1].trim() : '';
    };
    const linkMatch = block.match(/<link[^>]+href="([^"]+)"/i);
    items.push({
      title: stripTags(pick('title')),
      link: linkMatch ? linkMatch[1] : '',
      description: pick('content') || pick('summary') || '',
      date: pick('published') || pick('updated'),
    });
  }
  return items;
}

const SPAIN_RE =
  /\b(españa|spain|es)\b|madrid|barcelona|valencia|alicante|sevilla|zaragoza|bilbao|m[áa]laga|pamplona|valladolid|granada|tecnoempleo|infojobs|jobfluent|empleo|canary|canarias|mallorca|menorca|ibiza|gij[óo]n|santander|vigo|coru[ñn]a/i;

export function detectLang({ location = '', country = '', source = '' } = {}) {
  const hay = `${location} ${country} ${source}`;
  return SPAIN_RE.test(hay) ? 'es' : 'en';
}

export function shortTitle(title) {
  return String(title || '')
    .replace(/\s*[|—–-]\s*[^|—–-]{0,40}$/, '')
    .slice(0, 90)
    .trim();
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function linkLabel(url, options = {}) {
  if (options.jobUrl && url === options.jobUrl) {
    return options.lang === 'es' ? 'Veure l’oferta' : 'View the posting';
  }
  if (/\/api\/unsubscribe\?token=/.test(url)) {
    return options.lang === 'es' ? 'Donar-se de baixa' : 'Unsubscribe';
  }
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

function renderInline(text, options = {}) {
  const parts = String(text || '').split(/(https?:\/\/[^\s]+)/g);
  return parts
    .map((part) => {
      if (!/^https?:\/\//.test(part)) return escapeHtml(part).replace(/\n/g, '<br>');
      const match = part.match(/^(https?:\/\/[^\s]+?)([.,;:)]*)$/);
      const url = match ? match[1] : part;
      const trail = match ? match[2] : '';
      return `<a href="${escapeHtml(url)}" style="color:#0b57d0;text-decoration:underline;">${escapeHtml(linkLabel(url, options))}</a>${escapeHtml(trail)}`;
    })
    .join('');
}

export function htmlFromText(text, options = {}) {
  return String(text || '')
    .split(/\n{2,}/)
    .map((block) => `<p style="margin:0 0 16px;line-height:1.65;">${renderInline(block, options)}</p>`)
    .join('\n');
}
