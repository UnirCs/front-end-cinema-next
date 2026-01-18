'use client';

import { useContext, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname, useParams } from 'next/navigation';
import clsx from 'clsx';
import { AuthContext } from '@/context/AuthContext';
import { GlobalContext } from '@/context/GlobalContext';
import { invalidateAllCache, updateScreeningsToToday } from '@/lib/actions';
import { useI18n } from '@/lib/i18n/TranslationsProvider';
import LanguageSwitcher from './LanguageSwitcher';

const Header = () => {
  const { user, isLoading } = useContext(AuthContext);
  const { city, changeCity } = useContext(GlobalContext);
  const { lang, dict } = useI18n();
  const router = useRouter();
  const pathname = usePathname();
  const [isInvalidating, setIsInvalidating] = useState(false);
  const [isUpdatingDates, setIsUpdatingDates] = useState(false);

  const cities = [
    { value: 'madrid', label: 'Madrid' },
    { value: 'barcelona', label: 'Barcelona' },
    { value: 'valencia', label: 'Valencia' },
    { value: 'sevilla', label: 'Sevilla' }
  ];

  const handleCityChange = (e) => {
    const newCity = e.target.value;
    changeCity(newCity);
    // Si estamos en la cartelera, navegar a la nueva ciudad
    if (pathname.includes('/cartelera/')) {
      router.push(`/${lang}/cartelera/${newCity}`);
    }
  };

  const handleInvalidateCache = async () => {
    setIsInvalidating(true);
    try {
      const result = await invalidateAllCache();
      console.log('[CLIENT] Cache invalidada:', result.timestamp);
    } catch (error) {
      console.error('[CLIENT] Error al invalidar cache:', error);
    } finally {
      setIsInvalidating(false);
    }
  };

  const handleUpdateDates = async () => {
    setIsUpdatingDates(true);
    try {
      const result = await updateScreeningsToToday();
      if (result.success) {
        console.log(`[CLIENT] ${result.updatedCount} sesiones actualizadas a ${result.newDate}`);
        router.refresh();
      } else {
        console.error('[CLIENT] Error:', result.error);
      }
    } catch (error) {
      console.error('[CLIENT] Error al actualizar fechas:', error);
    } finally {
      setIsUpdatingDates(false);
    }
  };

  const navLinkClasses = clsx(
    'text-cinema-text px-4 py-2 rounded-lg bg-white/5',
    'border border-transparent',
    'hover:border-cinema-gold hover:text-cinema-gold hover:-translate-y-0.5',
    'transition-all duration-300 font-medium'
  );

  return (
    <header className={clsx(
      'bg-gradient-to-r from-cinema-dark-secondary via-cinema-dark-elevated to-cinema-dark-secondary',
      'border-b-2 border-cinema-red px-6 py-4',
      'sticky top-0 z-50',
      'shadow-lg shadow-black/50'
    )}>
      <div className="flex flex-wrap justify-between items-center max-w-7xl mx-auto gap-4">
        {/* Logo */}
        <Link href={`/${lang}`} prefetch={false} className="flex items-center gap-3 hover:opacity-90 transition-opacity">
          <span className="text-3xl drop-shadow-[0_0_8px_rgba(220,20,60,0.5)]">🎬</span>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-cinema-gold via-cinema-gold-light to-cinema-gold bg-clip-text text-transparent">
            UNIR Cinema
          </h1>
        </Link>

        {/* Selector de ciudad */}
        <div className="flex items-center gap-2">
          <label htmlFor="header-city-select" className="text-cinema-gold font-medium text-sm">
            🎬 {dict.header.city}:
          </label>
          <select
            id="header-city-select"
            value={city}
            onChange={handleCityChange}
            className={clsx(
              'px-3 py-2 rounded-lg text-sm',
              'border-2 border-cinema-border bg-cinema-dark-elevated text-cinema-text',
              'cursor-pointer transition-all duration-300',
              'hover:border-cinema-gold',
              'focus:border-cinema-gold focus:outline-none focus:ring-2 focus:ring-cinema-gold/20'
            )}
          >
            {cities.map((cityOption) => (
              <option key={cityOption.value} value={cityOption.value} className="bg-cinema-dark-elevated">
                {cityOption.label}
              </option>
            ))}
          </select>
        </div>

        {/* Navegacion */}
        <nav className="flex gap-2 items-center">
          <Link href={`/${lang}/cartelera/${city}`} prefetch={false} className={navLinkClasses}>
            {dict.nav.home}
          </Link>
          <Link href={`/${lang}/about`} prefetch={false} className={navLinkClasses}>
            {dict.nav.about}
          </Link>
          {user && user.role === 'admin' && (
            <Link href={`/${lang}/admin`} prefetch={false} className={navLinkClasses}>
              {dict.nav.admin}
            </Link>
          )}
        </nav>

        {/* Language Switcher */}
        <LanguageSwitcher />

        {/* Controles de usuario */}
        <div className="flex gap-4 items-center">
          <button
            onClick={handleUpdateDates}
            disabled={isUpdatingDates}
            className={clsx(
              'bg-gradient-to-r from-blue-500 to-cyan-600',
              'text-white px-4 py-2 rounded-lg font-bold text-sm',
              'hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/50',
              'transition-all duration-300',
              'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'
            )}
          >
            {isUpdatingDates ? dict.header.updating : dict.header.updateSessions}
          </button>
          <button
            onClick={handleInvalidateCache}
            disabled={isInvalidating}
            className={clsx(
              'bg-gradient-to-r from-orange-500 to-red-600',
              'text-white px-4 py-2 rounded-lg font-bold text-sm',
              'hover:-translate-y-0.5 hover:shadow-lg hover:shadow-orange-500/50',
              'transition-all duration-300',
              'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'
            )}
          >
            {isInvalidating ? dict.header.invalidating : dict.header.invalidateCache}
          </button>
          {isLoading ? (
            <span className="text-cinema-text-muted font-medium text-sm">
              {dict.header.loading}
            </span>
          ) : user ? (
            <>
              <Link
                href={`/${lang}/profile`}
                prefetch={false}
                className="flex items-center gap-2 text-cinema-text-muted font-medium text-sm hover:text-cinema-gold transition-colors"
              >
                {user.picture && (
                  <img
                    src={user.picture}
                    alt="Avatar"
                    className="w-8 h-8 rounded-full border-2 border-cinema-gold"
                  />
                )}
                <span>{dict.header.hello}, {user.name}</span>
              </Link>
              <a
                href="/auth/logout"
                className={clsx(
                  'bg-gradient-to-r from-cinema-red to-cinema-red-dark',
                  'text-white px-5 py-2 rounded-lg font-bold',
                  'hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cinema-red/50',
                  'transition-all duration-300'
                )}
              >
                {dict.nav.logout}
              </a>
            </>
          ) : (
            <a
              href="/auth/login"
              className={clsx(
                'bg-gradient-to-r from-cinema-gold to-cinema-gold-dark',
                'text-cinema-dark px-5 py-2 rounded-lg font-bold',
                'hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cinema-gold/50 hover:brightness-110',
                'transition-all duration-300'
              )}
            >
              {dict.nav.login}
            </a>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
