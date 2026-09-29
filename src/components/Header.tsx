'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname } from '@/i18n/navigation';
import LanguageSwitcher from './LanguageSwitcher';

const navSections = ['services', 'expertise', 'portfolio', 'reviews', 'contact'] as const;

const Header = () => {
  const t = useTranslations('Header');
  const locale = useLocale();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const hrefFor = (section: string) =>
    pathname === '/' ? `#${section}` : `/${locale}#${section}`;

  const homeHref = pathname === '/' ? '#main' : `/${locale}`;

  return (
    <header className={`header${scrolled ? ' header--scrolled' : ''}`}>
      <div className="header__inner">
        <a href={homeHref} className="header__logo" aria-label={`MG — ${t('home')}`}>
          <svg width="36" height="36" viewBox="0 0 36 36" aria-hidden="true" focusable="false">
            <circle cx="18" cy="18" r="18" fill="#64ffda" />
            <text x="18" y="23" textAnchor="middle" fill="#0a0a0a" fontWeight="700" fontSize="14" fontFamily="Inter, sans-serif">MG</text>
          </svg>
        </a>
        <div className="header__right">
          <nav className="header__nav">
            {navSections.map((section) => (
              <a key={section} href={hrefFor(section)}>
                {t(section)}
              </a>
            ))}
          </nav>
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
};

export default Header;
