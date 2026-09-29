export type ProjectKey =
  | 'cragxchange'
  | 'bluecode'
  | 'lifonet'
  | 'laiabobe'
  | 'agrovolt'
  | 'legalpyme';

export type Project = {
  key: ProjectKey;
  name: string;
  image: string;
  width: number;
  height: number;
  url: string;
};

export const projects: Project[] = [
  {
    key: 'cragxchange',
    name: 'CragXchange',
    image: '/images/cragXchange.webp',
    width: 487,
    height: 371,
    url: 'https://cragxchange.com/',
  },
  {
    key: 'bluecode',
    name: 'Bluecode',
    image: '/images/Screenshot-from-2022-12-10-18-34-15.webp',
    width: 942,
    height: 853,
    url: 'https://wearebluecode.com/',
  },
  {
    key: 'lifonet',
    name: 'Lifonet',
    image: '/images/lifonet.webp',
    width: 1200,
    height: 742,
    url: 'https://lifonet.com/',
  },
  {
    key: 'laiabobe',
    name: 'Laia Bobe',
    image: '/images/laiabobe.webp',
    width: 520,
    height: 492,
    url: 'https://laiabobe.com/',
  },
  {
    key: 'agrovolt',
    name: 'Agrovolt',
    image: '/images/agrovolt-mobile.webp',
    width: 390,
    height: 844,
    url: 'https://www.agrovolt.es/',
  },
  {
    key: 'legalpyme',
    name: 'LegalPyme',
    image: '/images/legalPyme.webp',
    width: 911,
    height: 731,
    url: 'https://www.legalpyme.es/',
  },
];

export const getProject = (key: string): Project | undefined =>
  projects.find((project) => project.key === key);
