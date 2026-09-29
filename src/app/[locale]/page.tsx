import { setRequestLocale } from 'next-intl/server';
import Header from '@/components/Header';
import Main from '@/components/Main';
import Services from '@/components/Services';
import Portfolio from '@/components/Portfolio';
import CtaBand from '@/components/CtaBand';
import Skills from '@/components/Skills';
import Expertise from '@/components/Expertise';
import Tools from '@/components/Tools';
import Process from '@/components/Process';
import Education from '@/components/Education';
import Reviews from '@/components/Reviews';
import Faq from '@/components/Faq';
import ContactForm from '@/components/ContactForm';
import FloatingCta from '@/components/FloatingCta';
import Footer from '@/components/Footer';
import { getTranslations } from 'next-intl/server';

const FAQ_KEYS = [
  'pricing',
  'usuk',
  'availability',
  'start',
  'codebase',
  'ai',
  'stack',
] as const;

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'Faq' });
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_KEYS.map((key) => ({
      '@type': 'Question',
      name: t(`items.${key}.q`),
      acceptedAnswer: {
        '@type': 'Answer',
        text: t(`items.${key}.a`),
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Header />
      <main id="main">
        <Main />
        <Services />
        <Portfolio />
        <CtaBand />
        <Skills />
        <Expertise />
        <Tools />
        <Process />
        <Education />
        <Reviews />
        <Faq />
        <ContactForm />
      </main>
      <FloatingCta />
      <Footer />
    </>
  );
}
