'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from './LanguageSwitcher';

const Header = () => {
  const t = useTranslations('Header');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`header${scrolled ? ' header--scrolled' : ''}`}>
      <div className="header__inner">
        <a href="#main" className="header__logo" aria-label={t('home')}>
          <svg width="36" height="36" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="18" fill="#64ffda" />
            <text x="18" y="23" textAnchor="middle" fill="#0a0a0a" fontWeight="700" fontSize="14" fontFamily="Inter, sans-serif">MG</text>
          </svg>
        </a>
        <div className="header__right">
          <nav className="header__nav">
            <a href="#expertise">{t('expertise')}</a>
            <a href="#portfolio">{t('portfolio')}</a>
            <a href="#reviews">{t('reviews')}</a>
            <a href="#contact">{t('contact')}</a>
          </nav>
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
};

export default Header;
