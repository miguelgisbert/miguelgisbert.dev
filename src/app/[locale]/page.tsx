import { setRequestLocale } from 'next-intl/server';
import Header from '@/components/Header';
import Main from '@/components/Main';
import Expertise from '@/components/Expertise';
import Tools from '@/components/Tools';
import Skills from '@/components/Skills';
import Portfolio from '@/components/Portfolio';
import Education from '@/components/Education';
import Reviews from '@/components/Reviews';
import ContactForm from '@/components/ContactForm';
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
      <Expertise />
      <Tools />
      <Skills />
      <Portfolio />
      <Education />
      <Reviews />
      <ContactForm />
      <Footer />
    </>
  );
}
