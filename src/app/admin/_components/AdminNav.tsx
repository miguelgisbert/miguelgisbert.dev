'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AdminIcon, type IconName } from './Icons';
import { LogoutButton } from '../LogoutButton';

type Item = {
  href: string;
  label: string;
  icon: IconName;
  count?: number;
};

export function AdminNav({ pending, suppressed }: { pending: number; suppressed: number }) {
  const pathname = usePathname();
  const items: Item[] = [
    { href: '/admin', label: 'Panell', icon: 'dashboard' },
    { href: '/admin/leads', label: 'Leads', icon: 'leads', count: pending },
    { href: '/admin/suppression', label: 'Supressió', icon: 'shield', count: suppressed },
    { href: '/admin/templates', label: 'Plantilles', icon: 'template' },
    { href: '/admin/targets', label: 'Dianes', icon: 'target' },
  ];

  const isActive = (href: string) =>
    href === '/admin' ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <nav className="adm-nav" aria-label="Seccions del panell">
      <Link className="adm-brand" href="/admin" aria-label="Panell d’outreach">
        <span className="adm-brand-mark">
          <AdminIcon name="terminal" size={16} />
        </span>
        <span className="adm-brand-text">
          Outreach
          <small>miguelgisbert.dev</small>
        </span>
      </Link>

      <div className="adm-nav-items">
        {items.map((item) => (
          <Link
            key={item.href}
            className="adm-nav-link"
            href={item.href}
            aria-current={isActive(item.href) ? 'page' : undefined}
          >
            <AdminIcon name={item.icon} size={17} className="adm-nav-icon" />
            <span className="adm-nav-label">{item.label}</span>
            {item.count ? <span className="adm-count">{item.count}</span> : null}
          </Link>
        ))}
      </div>

      <div className="adm-nav-footer">
        <Link className="adm-nav-link adm-visit" href="/" target="_blank" rel="noreferrer">
          <AdminIcon name="external" size={17} className="adm-nav-icon" />
          <span className="adm-nav-label">Veure web</span>
        </Link>
        <LogoutButton />
      </div>
    </nav>
  );
}
