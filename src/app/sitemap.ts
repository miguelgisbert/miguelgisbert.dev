import { statSync } from 'node:fs';
import { join } from 'node:path';
import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { projects } from '@/content/projects';

const baseUrl = 'https://miguelgisbert.dev';

const lastModified = new Date(
  routing.locales.reduce((latest, locale) => {
    const { mtimeMs } = statSync(join(process.cwd(), 'src', 'messages', `${locale}.json`));
    return Math.max(latest, mtimeMs);
  }, 0),
);

export default function sitemap(): MetadataRoute.Sitemap {
  const homeAlternates = Object.fromEntries(
    routing.locales.map((locale) => [locale, `${baseUrl}/${locale}`]),
  );

  const homeEntries: MetadataRoute.Sitemap = routing.locales.map((locale) => ({
    url: `${baseUrl}/${locale}`,
    lastModified,
    changeFrequency: 'monthly',
    priority: locale === routing.defaultLocale ? 1 : 0.9,
    alternates: { languages: homeAlternates },
  }));

  const workEntries: MetadataRoute.Sitemap = routing.locales.flatMap((locale) =>
    projects.map((project) => ({
      url: `${baseUrl}/${locale}/work/${project.key}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((l) => [l, `${baseUrl}/${l}/work/${project.key}`]),
        ),
      },
    })),
  );

  return [...homeEntries, ...workEntries];
}
