import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/adminAuth';
import { LoginForm } from './LoginForm';

export default async function LoginPage() {
  if (await isAdmin()) redirect('/admin');
  return (
    <div className="adm-login-page">
      <LoginForm />
    </div>
  );
}
