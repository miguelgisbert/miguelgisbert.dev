'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

const FloatingCta = () => {
  const t = useTranslations('Cta');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const nearBottom = y + window.innerHeight > document.body.scrollHeight - 700;
      setVisible(y > 600 && !nearBottom);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <a
      href="#contact"
      className={`floating-cta${visible ? ' floating-cta--visible' : ''}`}
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <rect x="3" y="4.5" width="18" height="16.5" rx="3" />
        <path d="M3 9h18M8 2.5v4M16 2.5v4" strokeLinecap="round" />
      </svg>
      {t('primary')}
    </a>
  );
};

export default FloatingCta;
