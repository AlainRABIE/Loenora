import createMiddleware from 'next-intl/middleware';
 
export default createMiddleware({
  // A list of all locales that are supported
  locales: ['fr', 'en', 'tn'],
 
  // Used when no locale matches
  defaultLocale: 'fr'
});
 
export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/_next` or `/_vercel`
  // - … if they start with `/admin` (admin routes don't use locales)
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: ['/((?!api|_next|_vercel|admin|.*\\..*).*)']
};
    