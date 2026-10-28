import { decodeEntities, stripTags, escRe, detectLang, domainFromUrl, normUrl, shortTitle } from './util.js';
import { classifySegment } from './render.js';
import { isBoardHost, companyFromBoardUrl } from './boards.js';

const seekerRe =
  /\[for hire\]|willing to relocate|location:\s*\S+[\s\S]{0,40}remote:|^\s*seeking (freelance|contract)|^\s*available (for|as) (a )?(freelance|developer|engineer)|hire me|looking for freelance (work|gig|contract|opportunit)|\bhi,? i['’]m\b|\d+\s*\+?\s*years?\s*\|/i;

const EMAIL_RE = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i;
const EMAIL_NOISE_RE = /noreply|no-reply|donotreply|example\.|sentry|localhost|@.*\.(?:png|jpe?g|webp|svg)\b/i;
const APPLY_RE =
  /(?:send|email|forward|share|attach|submit)[^.\n]{0,90}(?:cv|resume|résumé|application|portfolio)|(?:cv|resume|résumé)[^.\n]{0,70}(?:to|at|via)\b|apply (?:via|by) email|email (?:your|us|me) (?:cv|resume)|(?:env[ií]a|envia|manda|remite|adjunta|comparte)[^.\n]{0,90}(?:cv|curr[ií]culum|curriculum|portfolio)|(?:cv|curr[ií]culum)[^.\n]{0,70}(?:a|al)\b/i;

// Senyals forts de freelance/contract. El mot solt «contract» no compta a la
// descripció: ha d'anar acompanyat de role/position/project/gig/job.
const DEFAULT_CONTRACT =
  '\\b(?:freelanc\\w*|contractor|contracting|contract\\s+(?:role|position|project|gig|job)|aut[oó]nomo|independiente|independent|temporary|temporal|interim|befristet|fixed[- ]term|project[- ]based|part[- ]time|obra y servicio|subcontract\\w*|subcontrat\\w*|day rate|hourly rate|per hour)\\b';

const CONTRACT_WINDOW = 1400;

const DEFAULT_EMPLOYMENT_BLOCK =
  'full[\\s_-]?time|fulltime|permanent(?:ly)?|indefinite[\\s_-]+contract|indefinid[oa]|contrato[\\s_-]+indefinido|empleo[\\s_-]+indefinido|unbefristet|vast[\\s_-]+dienstverband|onbepaalde[\\s_-]+tijd|working[\\s_-]?student|werkstudent(?:in)?|internship|prak(?:tikum)?|trainee|apprenticeship|m\\s*[/|]\\s*f\\s*[/|]\\s*d|m\\s*[/|]\\s*w\\s*[/|]\\s*d|w\\s*[/|]\\s*m\\s*[/|]\\s*d|f\\s*[/|]\\s*m\\s*[/|]\\s*d|jornada(?:[\\s_-]+laboral)?[\\s_-]+completa|tiempo[\\s_-]+completo|contrato[\\s_-]+fijo|empleo[\\s_-]+fijo|permanente|vollzeit|festanstellung|\\bcdi\\b|contract[\\s-]+to[\\s-]+(?:hire|perm)|temp[\\s-]+to[\\s-]+perm';

const PERMANENT_BLOCK =
  'permanent(?:ly)?|indefinite[\\s_-]+contract|indefinid[oa]|contrato[\\s_-]+indefinido|empleo[\\s_-]+indefinido|unbefristet|vast[\\s_-]+dienstverband|onbepaalde[\\s_-]+tijd|festanstellung|contrato[\\s_-]+fijo|empleo[\\s_-]+fijo|\\bcdi\\b';

const NOT_FREELANCE_BLOCK =
  'working[\\s_-]?student|werkstudent(?:in)?|internship|prak(?:tikum)?|trainee|apprenticeship|contract[\\s-]+to[\\s-]+(?:hire|perm)|temp[\\s-]+to[\\s-]+perm|m\\s*[/|]\\s*f\\s*[/|]\\s*d|m\\s*[/|]\\s*w\\s*[/|]\\s*d|w\\s*[/|]\\s*m\\s*[/|]\\s*d|f\\s*[/|]\\s*m\\s*[/|]\\s*d';

const FULLTIME_STRUCTURED =
  /full[\s_-]?time|permanent|indefinid|unbefristet|festanstellung|\bcdi\b|vast[\s_-]+dienstverband|onbepaalde[\s_-]+tijd/;
const CONTRACT_STRUCTURED =
  /freelanc|contractor|contract|temporary|interim|part[\s_-]?time|project|fixed[\s_-]+term|self[\s_-]?employed/;
const OTHER_STRUCTURED = /intern|trainee|working[\s_-]?student|werkstudent|apprentice/;
const FRAMEWORK_MISMATCH = /angular|vue(?:\.js)?|svelte|flutter|swift|kotlin/i;
const FRAMEWORK_FIT = /react|next\.?js|node(?:\.js)?|typescript|javascript|python|full[\s-]?stack|software engineer|web developer|frontend|backend/i;

function normalizeEmployment(value) {
  const s = String(value || '').toLowerCase().trim();
  if (!s) return null;
  if (OTHER_STRUCTURED.test(s)) return 'other';
  if (FULLTIME_STRUCTURED.test(s)) return 'full_time';
  if (CONTRACT_STRUCTURED.test(s)) return 'contract';
  return null;
}

export function makeEvaluator(config) {
  const since = Date.now() / 1000 - config.days * 86400;
  const includeRe = new RegExp(config.include.map(escRe).join('|'), 'i');
  const excludeTitleRe = new RegExp(config.excludeTitle.map(escRe).join('|'), 'i');
  const contractDescRe = new RegExp(config.requireContractPattern || DEFAULT_CONTRACT, 'i');
  const contractTitleRe = new RegExp(`\\bcontract\\b|${config.requireContractPattern || DEFAULT_CONTRACT}`, 'i');
  const employmentBlockRe = new RegExp(config.excludeEmploymentPattern || DEFAULT_EMPLOYMENT_BLOCK, 'i');
  const permanentBlockRe = new RegExp(PERMANENT_BLOCK, 'i');
  const notFreelanceBlockRe = new RegExp(NOT_FREELANCE_BLOCK, 'i');

  function scoreText(text) {
    const hay = text.toLowerCase();
    let score = 0;
    const reasons = [];
    for (const [word, pts] of Object.entries(config.boost)) {
      if (new RegExp(escRe(word), 'i').test(hay)) {
        score += pts;
        reasons.push(`${word}+${pts}`);
      }
    }
    return { score, reasons };
  }

  function isEligible(title, description = '', meta = {}) {
    if (!title) return false;
    if (excludeTitleRe.test(title)) return false;
    const plainTitle = decodeEntities(title);
    const plainDesc = stripTags(description).slice(0, 4000);
    if (seekerRe.test(plainTitle) || seekerRe.test(plainDesc.slice(0, 300))) return false;
    // No volem rols d'Angular/Vue/Flutter/etc. si el títol no té cap senyal
    // del stack de Miguel (React, Next, Node, TS, JS, Python, full-stack…).
    if (FRAMEWORK_MISMATCH.test(plainTitle) && !FRAMEWORK_FIT.test(plainTitle)) return false;
    const full = `${plainTitle} ${plainDesc}`;
    if (!includeRe.test(full)) return false;

    const structured = normalizeEmployment(meta.employmentType);
    if (meta.reviewOnly) {
      // Cua de revisió: ofertes remotes del stack amb email, però sense
      // confirmació explícita de freelance. No s'envien automàticament.
      if (permanentBlockRe.test(full) || notFreelanceBlockRe.test(full)) return false;
      return true;
    }
    if (structured === 'full_time' || structured === 'other') return false;

    if (structured === 'contract') {
      // Una font que ja declara contract/freelance no necessita la paraula al
      // text, però seguim rebutjant indefinits, working students i m/f/d.
      if (permanentBlockRe.test(full) || notFreelanceBlockRe.test(full)) return false;
      return true;
    }

    // Sense metadada d'ocupació: el text ha de ser clarament freelance.
    if (employmentBlockRe.test(full)) return false;
    const contractHay = `${plainTitle} ${plainDesc.slice(0, CONTRACT_WINDOW)}`;
    if (!contractTitleRe.test(plainTitle) && !contractDescRe.test(contractHay)) return false;
    return true;
  }

  function evaluate(raw) {
    const {
      title,
      description = '',
      url,
      date,
      source,
      company = '',
      contactName = '',
      targetEmail = '',
      domain = '',
      location = '',
      country = '',
      lang,
      employmentType = '',
      platform = '',
      reviewOnly = false,
      publishedUnknown = false,
    } = raw;
    if (!url || !title) return null;
    const meta = { employmentType, platform, reviewOnly };
    if (!isEligible(title, description, meta)) return null;

    const plainTitle = decodeEntities(title);
    const plainDesc = stripTags(description).slice(0, 4000);
    const full = `${plainTitle} ${plainDesc}`;
    const t = new Date(date);
    if (!Number.isNaN(t.getTime()) && t.getTime() / 1000 < since) return null;

    const titleScore = scoreText(plainTitle);
    const descScore = scoreText(plainDesc);
    const reasons = [...titleScore.reasons, ...descScore.reasons];
    let score = titleScore.score * 2 + descScore.score;

    if (!Number.isNaN(t.getTime())) {
      const ageDays = (Date.now() - t.getTime()) / 86400000;
      if (ageDays >= 0 && ageDays <= 1) {
        score += 20;
        reasons.push('fresh+20');
      } else if (ageDays <= 3) {
        score += 12;
        reasons.push('fresh+12');
      } else if (ageDays <= 7) {
        score += 6;
        reasons.push('fresh+6');
      }
    }

    const hasPostedEmail = EMAIL_RE.test(plainDesc) && !EMAIL_NOISE_RE.test(plainDesc);
    const applyEmail = hasPostedEmail && APPLY_RE.test(plainDesc.slice(0, 3000));
    if (hasPostedEmail) {
      score += 8;
      reasons.push('email+8');
    }
    if (applyEmail) {
      score += 6;
      reasons.push('apply-email+6');
    }
    if (score <= 0) return null;

    const finalDomain = domain || domainFromUrl(url);
    let companyFinal = String(company || '').trim();
    if (!companyFinal) companyFinal = companyFromBoardUrl(url);
    if (!companyFinal && finalDomain && !isBoardHost(finalDomain)) {
      companyFinal = finalDomain.split('.')[0].replace(/[-_]+/g, ' ').trim();
    }

    return {
      title: plainTitle.slice(0, 200),
      url,
      source,
      date: Number.isNaN(t.getTime()) ? new Date().toISOString().slice(0, 10) : t.toISOString().slice(0, 10),
      score,
      reasons: [...new Set(reasons)].slice(0, 10),
      description: plainDesc,
      segment: classifySegment(full, config),
      company: companyFinal,
      contactName,
      targetEmail,
      domain: finalDomain,
      location,
      country,
      lang: lang || detectLang({ location, country, source }),
      employmentType: employmentType || null,
      platform: platform || null,
      reviewOnly: Boolean(reviewOnly),
      publishedUnknown: Boolean(publishedUnknown),
      hasPostedEmail,
      applyEmail,
    };
  }

  function dedupe(leads) {
    const seen = new Map();
    for (const j of leads) {
      const key = normUrl(j.url);
      if (!key || seen.has(key)) continue;
      seen.set(key, j);
    }
    return [...seen.values()].sort((a, b) => b.score - a.score || b.date.localeCompare(a.date));
  }

  return { evaluate, dedupe, shortTitle, isEligible };
}
