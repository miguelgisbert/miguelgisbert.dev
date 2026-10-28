'use client';

import { useRouter } from 'next/navigation';
import { AdminIcon } from './_components/Icons';
import { logout } from './actions';

export function LogoutButton() {
  const router = useRouter();
  return (
    <a
      href="#"
      className="adm-nav-link"
      onClick={async (e) => {
        e.preventDefault();
        await logout();
        router.push('/admin/login');
        router.refresh();
      }}
    >
      <AdminIcon name="logout" size={17} className="adm-nav-icon" />
      <span className="adm-nav-label">Eixir</span>
    </a>
  );
}
