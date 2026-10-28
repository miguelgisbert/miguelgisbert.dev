import { fetchJson, stripTags } from '../util.js';
import { extractEmails, isGenericAddress, hasApplyInstruction } from '../scrape.js';

// Només publicacions de LinkedIn. Cada consulta ha de portar site:linkedin.com/posts.
const QUERIES = [
  // Anglès
  'site:linkedin.com/posts "send your CV to" "full stack"',
  'site:linkedin.com/posts "send your CV to" react',
  'site:linkedin.com/posts "send your CV to" typescript',
  'site:linkedin.com/posts "send your CV to" "software engineer"',
  'site:linkedin.com/posts "send your CV to" frontend',
  'site:linkedin.com/posts "freelance" "react" "send your CV"',
  'site:linkedin.com/posts "freelance" "full stack" "send your CV"',
  'site:linkedin.com/posts "contract" "react" "send your CV"',
  'site:linkedin.com/posts "contractor" "react" "email"',
  'site:linkedin.com/posts "remote" "react" "send your CV"',
  'site:linkedin.com/posts "remote" "full stack" "send your CV"',
  'site:linkedin.com/posts "next.js" "freelance" "send your CV"',
  'site:linkedin.com/posts "node" "freelance" "send your CV"',
  'site:linkedin.com/posts "typescript" "freelance" "send your CV"',
  'site:linkedin.com/posts "frontend" "freelance" "send your CV"',
  // Castellà
  'site:linkedin.com/posts "envía tu CV" react',
  'site:linkedin.com/posts "envía tu CV" "full stack"',
  'site:linkedin.com/posts "buscamos freelance" react',
  'site:linkedin.com/posts "desarrollador" "freelance" "envía tu CV"',
  'site:linkedin.com/posts "programador" "freelance" "envía tu CV"',
  'site:linkedin.com/posts "frontend" "remoto" "envía tu CV"',
  'site:linkedin.com/posts "full stack" "remoto" "envía tu CV"',
  'site:linkedin.com/posts "autónomo" react "envía tu CV"',
  'site:linkedin.com/posts "manda tu CV" react',
  'site:linkedin.com/posts "remoto" "react" "email"',
  // Local
  'site:linkedin.com/posts "freelance" "react" "Alicante"',
  'site:linkedin.com/posts "freelance" "react" "Valencia"',
  'site:linkedin.com/posts "freelance" "react" "España"',
  'site:linkedin.com/posts "remoto" "España" "react"',
  // UK / Suïssa
  'site:linkedin.com/posts "freelance" "react" "UK"',
  'site:linkedin.com/posts "freelance" "react" "£"',
  'site:linkedin.com/posts "contract" "react" "£"',
  'site:linkedin.com/posts "freelance" "full stack" "£"',
  'site:linkedin.com/posts "freelance" "typescript" "UK"',
  'site:linkedin.com/posts "freelance" "react" "CHF"',
  'site:linkedin.com/posts "freelance" "react" "Switzerland"',
  'site:linkedin.com/posts "freelance" "full stack" "CHF"',
  'site:linkedin.com/posts "freelance" "react" "London"',
];

const CORE_STACK =
  /react|next\.?js|node(?:\.js)?|typescript|javascript|full[\s-]?stack|web developer|web engineer|software (?:engineer|developer)|frontend|backend|python|desarrollador(?:a)?|programador(?:a)?|ingenier[oa]\s+(?:de\s+)?software|desarrollo\s+web/i;

const NON_CORE_STACK =
  /\b(?:java|c\+\+|c#|golang|rust|php|laravel|ruby|rails|\.net|django|flask|angular|vue|svelte|flutter|swift|kotlin|ios|android|qa|quality assurance|sdet|test automation|devops|data ?engineering|data engineer|machine learning|salesforce|sap)\b/i;

const JS_COMPATIBLE =
  /react|next\.?js|node(?:\.js)?|typescript|javascript|web developer|web engineer|desarrollador\s+web|programador|desarrollo\s+web/i;

const JOB_INTENT =
  /\b(?:hiring|we're hiring|looking for|seeking|need (?:a |an )?(?:freelance|contractor|developer|engineer)|join (?:our|the) team|role|position|vacancy|opening|freelance|contractor|contract|send your cv|send cv|apply|buscamos|contratamos|incorporamos|vacante|oferta|env[ií]a tu cv|manda tu cv|curr[ií]culum)\b/i;

const NON_JOB =
  /\b(?:conference|summit|event|tickets|speakers?|sponsor|course|bootcamp|webinar|masterclass|ebook|tutorial|training program|interview prep|intern|internship|trainee|working student|becario|pr[aá]cticas)\b/i;

const CLOSED_JOB =
  /\b(?:this|the)\s+(?:job|position|role|vacancy|opportunity)\s+(?:is|has been|was)\s+(?:closed|filled|removed|expired)|(?:job|position|role|vacancy)\s+(?:is\s+)?(?:closed|filled|expired)|no longer accepting applications|applications?\s+(?:are\s+)?(?:now\s+)?closed|vacante\s+cerrada|oferta\s+cerrada|proceso\s+cerrado|plazo\s+cerrado/i;

const CV_TITLE =
  /^\s*(?:resume|cv|curriculum vitae|location:)\b|(?:^|\b)(?:my|personal|updated)\s+(?:resume|cv)\b|\bresume\b[^.\n]{0,50}@|\b(?:cv|resume|curriculum vitae)\s+(?:example|template|sample|format|tips|writer)\b|\bthank you\b|\b(?:gmail|outlook|hotmail|yahoo)\b/i;

const FREELANCE =
  /\b(?:freelance|freelancer|contractor|contract|aut[oó]nomo|autonomo|por proyecto|project[- ]based|part[- ]time|media jornada)\b/i;

const REMOTE = /\b(?:remote|remoto|teletrabajo|worldwide|anywhere|100% remoto|fully remote)\b/i;

const ONSITE = /\b(?:onsite|on-site|presencial|hybrid|híbrido|hibrido)\b/i;

// El usuario només accepta símbols $ o €. Qualsevol altra moneda (₹, £, ¥, ₽…) descarta.
// £, GBP i CHF són admesos (UK i Suïssa). La resta de monedes, fora.
const CURRENCY_BAD = /[₹¥₽₺₴₦₱₩₪₫₸₼₾]|\b(?:INR|Rs\.?|rupees?|AUD|CAD|SGD|HKD|NZD|BRL|MXN|ZAR|JPY|CNY|RMB|KRW|PLN|SEK|NOK|DKK|HUF|CZK|RON|TRY|AED|SAR|QAR|KWD|EGP|NGN|KES|ILS|PKR|BDT|LKR|NPR|PHP|IDR|MYR|THB|VND)\b/i;

const BAD_LOCATION =
  /\b(?:poland|polonia|germany|alemania|munich|múnich|berlin|berlín|france|francia|paris|parís|netherlands|países bajos|amsterdam|portugal|lisboa|italy|italia|rome|roma|madrid|barcelona|india|pakistán|pakistan|philippines|filipinas|uae|emiratos|saudi|arabia|qatar|kuwait|egypt|egipto|nigeria|kenya|south africa|brazil|brasil|mexico|méxico|argentina|buenos aires|colombia|chile|lviv|ukraine|jakarta|indonesia|bengaluru|bangalore|hyderabad|pune|mumbai|delhi|noida|gurgaon|chennai|kolkata|karachi|lahore|technopark|trivandrum|thiruvananthapuram|ecuador|quito|guayaquil|angola|luanda)\b/i;

const GLOBAL_AREA =
  /\b(?:worldwide|anywhere|global|europe|europa|eu|ue|uk|united kingdom|reino unido|spain|españa|alicante|valencia|usa|united states|estados unidos|canada|canadá|switzerland|suiza|suisse|schweiz|zurich|zürich|geneva|ginebra|basel|bern|berna|lausanne)\b/i;

function isLinkedInPost(link) {
  try {
    const url = new URL(link);
    const host = url.hostname.replace(/^www\./, '').toLowerCase();
    if (host !== 'linkedin.com' && !host.endsWith('.linkedin.com')) return false;
    return /\/posts\/|\/feed\/update\//i.test(url.pathname);
  } catch {
    return false;
  }
}

function linkedinPublished(link) {
  const match = String(link || '').match(/activity[-:](\d{15,})|ugcPost[-:](\d{15,})/i);
  if (!match) return null;
  const raw = match[1] || match[2];
  try {
    const date = new Date(Number(BigInt(raw) >> 22n));
    return Number.isNaN(date.getTime()) ? null : date.toISOString();
  } catch {
    return null;
  }
}

function detectLocation(text) {
  const s = String(text || '').toLowerCase();
  if (/alicante/.test(s)) return 'Alacant';
  if (/valencia|valència/.test(s)) return 'València';
  if (/spain|españa/.test(s)) return 'Espanya';
  if (/united kingdom|\buk\b|london|reino unido/.test(s)) return 'UK';
  if (/europe|europa|\beu\b|\bue\b|berlin|munich|amsterdam|paris|dublin/.test(s)) return 'Europa';
  if (/switzerland|suiza|suisse|schweiz|zurich|zürich|geneva|ginebra|basel|bern|berna|lausanne/.test(s)) return 'Suïssa';
  if (/usa|united states|estados unidos|canada|canadá|new york|san francisco|toronto/.test(s)) return 'EUA / Canadà';
  if (/argentina|buenos aires|latam|latinoam/.test(s)) return 'Argentina / LatAm';
  if (/remote|remoto|teletrabajo|worldwide|anywhere/.test(s)) return 'Remot';
  return 'No indicat';
}

function cleanTitle(title) {
  return String(title || '')
    .replace(/\s+\|\s*LinkedIn.*$/i, '')
    .replace(/\s+on LinkedIn:.*$/i, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function pickEmail(text) {
  const emails = extractEmails(text);
  if (!emails.length) return null;
  return emails.find((email) => !isGenericAddress(email)) || emails[0];
}

function applyNear(text, email) {
  const idx = String(text || '').toLowerCase().indexOf(String(email || '').toLowerCase());
  const around = idx >= 0 ? text.slice(Math.max(0, idx - 320), idx + 320) : text;
  return hasApplyInstruction(around);
}

function companyFromText(text) {
  const match = String(text || '').match(/\bat\s+([A-Z][A-Za-z0-9&.'-]+(?:\s+[A-Z][A-Za-z0-9&.'-]+){0,2})/);
  return match ? match[1] : '';
}

async function serper(query, freshness = 'w') {
  const key = process.env.SERPER_API_KEY;
  if (!key) return null;
  const data = await fetchJson(
    'https://google.serper.dev/search',
    {
      method: 'POST',
      headers: { 'X-API-KEY': key },
      body: JSON.stringify({
        q: query,
        num: Math.min(100, Number(process.env.SERPER_NUM || 10)),
        tbs: `qdr:${freshness}`,
      }),
    },
    25000,
  );
  return (data.organic || []).map((result) => ({
    title: result.title,
    snippet: result.snippet,
    link: result.link,
  }));
}

async function tavily(query, freshness = 'w') {
  const key = process.env.TAVILY_API_KEY;
  const keyless = process.env.TAVILY_KEYLESS !== '0';
  if (!key && !keyless) return null;
  const headers = { 'Content-Type': 'application/json' };
  if (key) headers.Authorization = `Bearer ${key}`;
  else headers['X-Tavily-Access-Mode'] = 'keyless';
  const data = await fetchJson(
    'https://api.tavily.com/search',
    {
      method: 'POST',
      headers,
      body: JSON.stringify({
        query,
        max_results: 20,
        search_depth: 'basic',
        topic: 'general',
        days: freshness === 'd' ? 1 : freshness === 'm' ? 30 : 7,
        include_raw_content: true,
      }),
    },
    30000,
  );
  return (data.results || []).map((result) => ({
    title: result.title,
    snippet: result.content || result.raw_content || '',
    link: result.url,
  }));
}

async function runQuery(query, freshness = 'w') {
  const debug = Boolean(process.env.OUTREACH_SEARCH_DEBUG);

  if (freshness === 'd') {
    const merged = [];
    const seen = new Set();
    for (const provider of [serper, tavily]) {
      try {
        const results = await provider(query, freshness);
        if (debug) console.log(`[linkedin] ${provider.name}: ${results ? results.length : 0} (fresh)`);
        for (const result of results || []) {
          if (!result.link || seen.has(result.link)) continue;
          seen.add(result.link);
          merged.push(result);
        }
      } catch (error) {
        if (debug) console.log(`[linkedin] ${provider.name} ERROR: ${error.message}`);
      }
    }
    return merged;
  }

  try {
    const results = await serper(query, freshness);
    if (debug) console.log(`[linkedin] serper: ${results ? results.length : 0}`);
    if (results && results.length) return results;
  } catch (error) {
    if (debug) console.log(`[linkedin] serper ERROR: ${error.message}`);
  }

  try {
    const results = await tavily(query, freshness);
    if (debug) console.log(`[linkedin] tavily: ${results ? results.length : 0}`);
    return results || [];
  } catch (error) {
    if (debug) console.log(`[linkedin] tavily ERROR: ${error.message}`);
    return [];
  }
}

export async function collect() {
  const hasKey = Boolean(process.env.SERPER_API_KEY || process.env.TAVILY_API_KEY);
  const keyless = process.env.TAVILY_KEYLESS !== '0';
  if (!hasKey && !keyless) return [];

  const extra = String(process.env.OUTREACH_SEARCH_QUERIES || '')
    .split('|')
    .map((query) => query.trim())
    .filter(Boolean);
  const allQueries = [...QUERIES, ...extra];
  const limit = Number(process.env.OUTREACH_SEARCH_LIMIT || 0);
  const queries = limit > 0 ? allQueries.slice(0, limit) : allQueries;
  const freshLimit = Number(process.env.OUTREACH_SEARCH_FRESH_LIMIT || 20);
  const tasks = [
    ...queries.slice(0, freshLimit).map((query) => ({ query, freshness: 'd' })),
    ...queries.map((query) => ({ query, freshness: 'w' })),
  ];
  const delay = Number(process.env.OUTREACH_SEARCH_DELAY || 1000);
  const out = [];
  const seenUrls = new Set();
  const seenEmails = new Set();

  for (const task of tasks) {
    let results;
    try {
      results = await runQuery(task.query, task.freshness);
    } catch {
      continue;
    }

    for (const result of results) {
      const link = result.link || '';
      if (!isLinkedInPost(link) || seenUrls.has(link)) continue;

      const title = cleanTitle(stripTags(result.title || ''));
      const snippet = stripTags(result.snippet || '');
      const text = `${title} ${snippet}`;
      if (!text.trim()) continue;
      if (CV_TITLE.test(title) || CLOSED_JOB.test(text) || NON_JOB.test(text)) continue;
      if (CURRENCY_BAD.test(text)) continue;
      if (!JOB_INTENT.test(text)) continue;
      if (!CORE_STACK.test(title) && !CORE_STACK.test(snippet)) continue;
      if (NON_CORE_STACK.test(title) && !JS_COMPATIBLE.test(title)) continue;
      if (NON_CORE_STACK.test(text) && !JS_COMPATIBLE.test(text)) continue;

      const published = linkedinPublished(link);
      if (!published) continue;
      if (Date.now() - new Date(published).getTime() > 14 * 86400000) continue;

      const email = pickEmail(text);
      if (!email) continue;
      if (seenEmails.has(email)) continue;

      const apply = applyNear(text, email);
      const freelance = FREELANCE.test(text);
      const remote = REMOTE.test(text);
      const onsite = ONSITE.test(text);

      // Només remot. Un onsite fora d'Alacant/València no és viable.
      if (onsite && !/\b(?:alicante|valencia|valència)\b/i.test(text)) continue;
      if (
        BAD_LOCATION.test(`${text} ${link}`) &&
        !GLOBAL_AREA.test(text) &&
        !/\b(?:alicante|valencia|valència)\b/i.test(text)
      ) {
        continue;
      }

      const location = detectLocation(text);
      const domain = email.split('@')[1]?.toLowerCase() || '';
      const company = companyFromText(text) || domain.split('.')[0] || '';
      const reviewOnly = !freelance || !remote || onsite || !apply;
      const genericTitle = /posted this|['’]s?\s+Post$|\bposted by\b/i.test(title) || title.length < 18;
      const displayTitle = genericTitle ? snippet.slice(0, 160) : title;

      out.push({
        title: (displayTitle || title || snippet.slice(0, 140)).slice(0, 200),
        description: `${snippet}\n\nContacte: ${email}`.trim(),
        url: link,
        date: published,
        publishedUnknown: false,
        source: 'LinkedIn',
        company,
        domain,
        location,
        employmentType: freelance ? 'freelance' : null,
        reviewOnly,
        lang: /Alacant|València|Espanya/.test(location) || /[ñáéíóú]|españa|remoto|desarrollador|programador|buscamos|env[ií]a|colaboraci[oó]n/i.test(text) ? 'es' : 'en',
      });
      seenUrls.add(link);
      seenEmails.add(email);
      if (out.length >= 60) break;
    }
    if (out.length >= 60) break;
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  return out;
}
