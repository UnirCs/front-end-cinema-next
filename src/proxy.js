import { NextResponse } from 'next/server';
import { auth0 } from "./lib/auth0";

// Locales soportados para i18n
const locales = ['es', 'en', 'fr'];
const defaultLocale = 'es';

// Rutas que requieren autenticacion (sin prefijo de idioma)
const protectedPaths = [
  '/admin',
  '/movie/*/session/*'
];

/**
 * Obtiene el pathname sin el prefijo de idioma
 */
function getPathWithoutLocale(pathname) {
  const segments = pathname.split('/');
  if (segments.length > 1 && locales.includes(segments[1])) {
    return '/' + segments.slice(2).join('/') || '/';
  }
  return pathname;
}

/**
 * Verifica si una ruta coincide con un patron protegido
 * Soporta wildcards (*) para segmentos dinamicos
 */
function isProtectedPath(pathname) {
  const pathWithoutLocale = getPathWithoutLocale(pathname);

  return protectedPaths.some(pattern => {
    const regexPattern = pattern
      .replace(/\*/g, '[^/]+')
      .replace(/\//g, '\\/');
    const regex = new RegExp(`^${regexPattern}$`);
    return regex.test(pathWithoutLocale);
  });
}

/**
 * Obtiene el locale del header Accept-Language
 */
function getLocaleFromAcceptLanguage(acceptLanguage) {
  if (!acceptLanguage) return defaultLocale;

  for (const locale of locales) {
    if (acceptLanguage.toLowerCase().includes(locale)) {
      return locale;
    }
  }

  return defaultLocale;
}

export async function proxy(request) {
  const { pathname } = request.nextUrl;

  // Dejar que Auth0 maneje sus rutas (/auth/login, /auth/logout, /auth/callback)
  const authResponse = await auth0.middleware(request);

  // =============================================
  // 1. RUTAS DE AUTH0 - Delegar al middleware de Auth0
  // =============================================
  if (pathname === '/auth/callback') {
    // Interceptar callback para redirigir a auth-callback con locale
    if (authResponse.status === 302 || authResponse.status === 307) {
      const location = authResponse.headers.get('location');
      const originalReturnTo = location ? new URL(location, request.url).pathname : `/${defaultLocale}`;

      const authCallbackUrl = new URL(`/${defaultLocale}/auth-callback`, request.url);
      authCallbackUrl.searchParams.set('returnTo', originalReturnTo);

      const response = NextResponse.redirect(authCallbackUrl);

      const setCookieHeader = authResponse.headers.get('set-cookie');
      if (setCookieHeader) {
        response.headers.set('set-cookie', setCookieHeader);
      }

      return response;
    }
    return authResponse;
  }

  // Si estamos en otras rutas de Auth0, dejarlas pasar
  if (pathname.startsWith('/auth/')) {
    return authResponse;
  }

  // Si Auth0 devuelve una respuesta de redireccion, usarla
  if (authResponse.status !== 200) {
    return authResponse;
  }

  // =============================================
  // 2. IGNORAR: Assets, API y archivos estáticos
  // =============================================
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return authResponse;
  }

  // =============================================
  // 3. REDIRECCIÓN i18n - Añadir prefijo de idioma
  // =============================================
  const pathnameHasLocale = locales.some(
    locale => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );

  if (!pathnameHasLocale) {
    const acceptLanguage = request.headers.get('accept-language');
    const locale = getLocaleFromAcceptLanguage(acceptLanguage);

    const url = request.nextUrl.clone();
    url.pathname = `/${locale}${pathname}`;

    return NextResponse.redirect(url);
  }

  // =============================================
  // 4. RUTAS PROTEGIDAS - Verificar autenticación
  // =============================================
  if (isProtectedPath(pathname)) {

    const session = await auth0.getSession(request);

    if (!session) {
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('returnTo', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return authResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
