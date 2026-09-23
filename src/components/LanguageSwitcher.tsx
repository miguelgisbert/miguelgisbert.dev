'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

const LanguageSwitcher = () => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="lang" role="group" aria-label="Language">
      <svg
        className="lang__globe"
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="9" />
        <path
          d="M3 12h18M12 3c2.5 2.5 3.8 5.6 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.6-3.8-9S9.5 5.5 12 3z"
          strokeLinecap="round"
        />
      </svg>
      {routing.locales.map((l, i) => (
        <span key={l} className="lang__item">
          {i > 0 && <span className="lang__sep" aria-hidden="true">/</span>}
          <button
            type="button"
            className={`lang__link${l === locale ? ' lang__link--active' : ''}`}
            aria-current={l === locale ? 'true' : undefined}
            onClick={() => router.replace(pathname, { locale: l })}
          >
            {l.toUpperCase()}
          </button>
        </span>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
