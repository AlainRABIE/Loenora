import createMiddleware from 'next-intl/middleware';
 
export default createMiddleware({
  locales: ['fr', 'en', 'tn'],
  defaultLocale: 'fr'
});
 
export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};
