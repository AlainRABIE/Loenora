import createMiddleware from 'next-intl/middleware';
 
export default createMiddleware({
  locales: ['fr', 'en', 'tn'],
  defaultLocale: 'fr'
});
 
export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(fr|en|tn)/:path*']
};