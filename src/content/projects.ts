export type ProjectKey =
  | 'cragxchange'
  | 'plegohr'
  | 'lifonet'
  | 'laiabobe'
  | 'agrovolt'
  | 'legalpyme';

export type Project = {
  key: ProjectKey;
  name: string;
  image: string;
  imageSrcSet?: string;
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
    key: 'plegohr',
    name: 'PlegoHR',
    image: '/images/plegohr.webp',
    imageSrcSet: '/images/plegohr-720.webp 720w, /images/plegohr.webp 1200w',
    width: 1200,
    height: 833,
    url: 'https://plegohr.vercel.app/',
  },
  {
    key: 'lifonet',
    name: 'Lifonet',
    image: '/images/lifonet.webp',
    imageSrcSet: '/images/lifonet-720.webp 720w, /images/lifonet.webp 1200w',
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
