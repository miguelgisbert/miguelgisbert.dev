import createMiddleware from 'next-intl/middleware';
import {NextResponse} from 'next/server';
import {routing} from './i18n/routing';

const intl = createMiddleware(routing);

export default function middleware(req: Parameters<typeof intl>[0]) {
  if (req.nextUrl.hostname === 'www.miguelgisbert.dev') {
    const url = req.nextUrl.clone();
    url.protocol = 'https:';
    url.host = 'miguelgisbert.dev';
    return NextResponse.redirect(url, 308);
  }

  return intl(req);
}

export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
};
