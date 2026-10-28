const BOARD_RE =
  /arbeitnow|remoteok|himalayas|tecnoempleo|weworkremotely|remotive|berlinstartupjobs|reddit\.com|redd\.it|ycombinator|hn\.algolia|greenhouse|lever\.co|ashbyhq|smartrecruiters|linkedin|indeed\.|infojobs|europa\.eu|glassdoor|stackoverflow|welcometothejungle|otalia|adzuna|jobfluent|jooble|dice\.com|careerjet|monster\.|freelancer\.com|jobicy|workingnomads|nodesk\.co|devremotely|reallyremote|remotefrontendjobs/i;

export function isBoardHost(host) {
  if (!host) return false;
  return BOARD_RE.test(host);
}

export function isBoardEmail(email) {
  if (!email || !email.includes('@')) return false;
  return BOARD_RE.test(email.split('@')[1]);
}

export function companyFromBoardUrl(url) {
  try {
    const u = new URL(url);
    const m =
      u.pathname.match(/\/jobs\/companies\/([^/]+)/i) ||
      u.pathname.match(/\/company\/([^/]+)/i) ||
      u.pathname.match(/\/(?:job-boards|boards)\/(?:embed\/job_board\/)?([^/]+)/i);
    if (m) return decodeURIComponent(m[1]).replace(/[-_]+/g, ' ').trim();
  } catch {}
  return '';
}
