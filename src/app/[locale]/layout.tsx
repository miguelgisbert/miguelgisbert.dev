import type { Metadata, Viewport } from 'next';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';
import { routing } from '@/i18n/routing';
import '../../index.css';
import '../../App.css';

const OG_LOCALES: Record<string, string> = {
  en: 'en_US',
  es: 'es_ES',
  ca: 'ca_ES',
};

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });
  const path = `/${locale}`;

  return {
    metadataBase: new URL('https://miguelgisbert.dev'),
    title: t('title'),
    description: t('description'),
    keywords: [
      'Miguel Gisbert',
      'full-stack developer',
      'software engineer',
      'React developer',
      'TypeScript',
      'Node.js',
      'React Native',
      'Python',
      'AI integration',
      'LLM',
      'RAG',
      'programador',
      'desarrollador full-stack',
      'programador Alicante',
      'remote developer',
    ],
    authors: [{ name: 'Miguel Gisbert' }],
    icons: { icon: '/favicon.svg' },
    alternates: {
      canonical: path,
      languages: {
        en: '/en',
        es: '/es',
        ca: '/ca',
        'x-default': '/en',
      },
    },
    openGraph: {
      type: 'website',
      siteName: 'Miguel Gisbert',
      url: path,
      title: t('title'),
      description: t('description'),
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: 'Miguel Gisbert — Full-Stack Software Engineer',
        },
      ],
      locale: OG_LOCALES[locale] ?? OG_LOCALES.en,
      alternateLocale: routing.locales
        .filter((l) => l !== locale)
        .map((l) => OG_LOCALES[l]),
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
      images: ['/og-image.png'],
    },
    robots: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
    },
  };
}

const siteUrl = 'https://miguelgisbert.dev';
const socialProfiles = [
  'https://www.linkedin.com/in/miguel-gisbert-osuna/',
  'https://github.com/miguelgisbert/',
  'https://www.npmjs.com/~miguelgisbert',
];
const knowsAbout = [
  'Full-Stack Development',
  'React',
  'TypeScript',
  'JavaScript',
  'Node.js',
  'React Native',
  'Python',
  'Django',
  'PostgreSQL',
  'Docker',
  'CI/CD',
  'AI Integration',
  'LLM Integration',
  'RAG Pipelines',
  'Software Engineering',
];
const postalAddress = {
  '@type': 'PostalAddress',
  addressLocality: 'Alicante',
  addressRegion: 'Valencian Community',
  addressCountry: 'ES',
};
const description =
  'Full-Stack Software Engineer with 10+ years of experience building high-performance web and mobile applications with React, TypeScript, Node.js and Python, specialized in AI/LLM integration.';

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      name: 'Miguel Gisbert',
      givenName: 'Miguel',
      familyName: 'Gisbert',
      url: `${siteUrl}/`,
      image: `${siteUrl}/og-image.png`,
      jobTitle: 'Full-Stack Software Engineer',
      description,
      email: 'mailto:info@miguelgisbert.dev',
      address: postalAddress,
      areaServed: 'Worldwide',
      knowsLanguage: ['en', 'es', 'ca'],
      knowsAbout,
      sameAs: socialProfiles,
    },
    {
      '@type': 'WebSite',
      name: 'Miguel Gisbert',
      url: `${siteUrl}/`,
      inLanguage: routing.locales,
    },
    {
      '@type': 'ProfessionalService',
      name: 'Miguel Gisbert — Full-Stack Software Engineer',
      url: `${siteUrl}/`,
      image: `${siteUrl}/og-image.png`,
      description,
      email: 'mailto:info@miguelgisbert.dev',
      address: postalAddress,
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 38.3452,
        longitude: -0.481,
      },
      areaServed: { '@type': 'Place', name: 'Worldwide' },
      priceRange: '$$',
      founder: { '@type': 'Person', name: 'Miguel Gisbert' },
      serviceType: [
        'Web Application Development',
        'Mobile App Development',
        'AI & LLM Integration',
        'Software Consulting',
      ],
      knowsAbout,
      sameAs: socialProfiles,
    },
  ],
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <html lang={locale}>
      <body suppressHydrationWarning>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <AppRouterCacheProvider>
          <NextIntlClientProvider>{children}</NextIntlClientProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
