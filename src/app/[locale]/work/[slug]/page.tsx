import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { getProject, projects } from '@/content/projects';
import Header from '@/components/Header';
import CtaBand from '@/components/CtaBand';
import ContactForm from '@/components/ContactForm';
import Footer from '@/components/Footer';

const siteUrl = 'https://miguelgisbert.dev';

type Params = { locale: string; slug: string };

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    projects.map((project) => ({ locale, slug: project.key })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = getProject(slug);
  if (!project) return {};

  const t = await getTranslations({ locale, namespace: 'Work' });
  const title = t(`projects.${slug}.title`);
  const description = t(`projects.${slug}.description`);
  const path = `/${locale}/work/${slug}`;
  const languages = Object.fromEntries<string>(
    routing.locales.map((l) => [l, `/${l}/work/${slug}`]),
  );

  return {
    title,
    description,
    alternates: {
      canonical: path,
      languages: { ...languages, 'x-default': `/en/work/${slug}` },
    },
    openGraph: {
      type: 'article',
      siteName: 'Miguel Gisbert',
      url: path,
      title,
      description,
      images: [
        {
          url: project.image,
          width: project.width,
          height: project.height,
          alt: project.name,
        },
      ],
      locale: locale === 'es' ? 'es_ES' : locale === 'ca' ? 'ca_ES' : 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [project.image],
    },
    robots: { index: true, follow: true, 'max-image-preview': 'large' },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { locale, slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'Work' });
  const portfolio = await getTranslations({ locale, namespace: 'Portfolio' });
  const homeUrl = `${siteUrl}/${locale}`;
  const pageUrl = `${siteUrl}/${locale}/work/${slug}`;

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: t('breadcrumbHome'), item: homeUrl },
          { '@type': 'ListItem', position: 2, name: project.name },
        ],
      },
      {
        '@type': 'Article',
        headline: t(`projects.${slug}.title`),
        description: t(`projects.${slug}.description`),
        image: `${siteUrl}${project.image}`,
        url: pageUrl,
        inLanguage: locale,
        author: { '@type': 'Person', name: 'Miguel Gisbert', url: siteUrl },
        publisher: { '@type': 'Person', name: 'Miguel Gisbert', url: siteUrl },
        mainEntityOfPage: pageUrl,
      },
    ],
  };

  return (
    <>
      <Header />
      <article className="work" id="main">
        <div className="work__inner">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
          />
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">{t('breadcrumbHome')}</Link>
            <span className="breadcrumb__sep" aria-hidden="true">
              /
            </span>
            <span aria-current="page">{project.name}</span>
          </nav>

          <header className="work__header">
            <h1 className="work__title">{t(`projects.${slug}.title`)}</h1>
            <p className="work__lead">{t(`projects.${slug}.description`)}</p>
            <div className="work__meta">
              <div className="work__meta-row">
                <span className="work__meta-label">{portfolio('roleLabel')}</span>
                <span className="work__meta-value">{portfolio(`projects.${slug}.role`)}</span>
              </div>
              <div className="work__meta-row">
                <span className="work__meta-label">{portfolio('stackLabel')}</span>
                <span className="work__meta-value">{portfolio(`projects.${slug}.stack`)}</span>
              </div>
            </div>
            <div className="work__actions">
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--primary"
              >
                {t('visitSite')}
              </a>
              <a href={`/${locale}#portfolio`} className="btn btn--outline">
                {t('back')}
              </a>
            </div>
          </header>

          <div className="work__image">
            <img
              src={project.image}
              alt=""
              width={project.width}
              height={project.height}
              fetchPriority="high"
              decoding="async"
            />
          </div>

          <div className="work__body">
            <section className="work__section">
              <h2>{t('challenge')}</h2>
              <p>{t(`projects.${slug}.challenge`)}</p>
            </section>
            <section className="work__section">
              <h2>{t('approach')}</h2>
              <p>{t(`projects.${slug}.approach`)}</p>
            </section>
            <section className="work__section">
              <h2>{t('outcome')}</h2>
              <p>{t(`projects.${slug}.outcome`)}</p>
            </section>
          </div>
        </div>
      </article>
      <CtaBand />
      <ContactForm />
      <Footer />
    </>
  );
}
