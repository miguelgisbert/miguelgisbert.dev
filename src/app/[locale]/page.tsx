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
import ContactForm from '@/components/ContactForm';
import FloatingCta from '@/components/FloatingCta';
import Footer from '@/components/Footer';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Header />
      <Main />
      <Services />
      <Portfolio />
      <CtaBand />
      <Skills />
      <Expertise />
      <Tools />
      <Process />
      <CtaBand />
      <Education />
      <Reviews />
      <ContactForm />
      <FloatingCta />
      <Footer />
    </>
  );
}
