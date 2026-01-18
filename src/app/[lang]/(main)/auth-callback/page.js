'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import clsx from 'clsx';
import { useI18n } from '@/lib/i18n/TranslationsProvider';

function LoadingState() {
  return (
    <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full flex items-center justify-center min-h-[50vh]">
      <div className={clsx(
        'max-w-md mx-auto p-8 text-center',
        'bg-gradient-to-br from-cinema-dark-card to-cinema-dark-elevated',
        'rounded-2xl shadow-lg border border-cinema-border'
      )}>
        <div className="text-4xl mb-4 animate-spin">🎬</div>
        <h2 className="text-cinema-gold text-xl font-bold mb-2">
          Loading...
        </h2>
      </div>
    </div>
  );
}

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { lang } = useParams();
  const { dict } = useI18n();
  const [status, setStatus] = useState('syncing');
  const [error, setError] = useState(null);

  useEffect(() => {
    async function syncUser() {
      try {
        const response = await fetch('/api/v1/sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          setError(errorData.error || 'Error syncing user');
          setStatus('error');
          return;
        }

        const data = await response.json();
        console.log('[AUTH-CALLBACK] User synced:', data.user?.email);
        setStatus('success');

        const returnTo = searchParams.get('returnTo') || `/${lang}`;
        setTimeout(() => {
          router.push(returnTo);
        }, 1500);

      } catch (err) {
        console.error('[AUTH-CALLBACK] Error:', err);
        setError(err.message);
        setStatus('error');
      }
    }

    syncUser();
  }, [router, searchParams, lang]);

  return (
    <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full flex items-center justify-center min-h-[50vh]">
      <div className={clsx(
        'max-w-md mx-auto p-8 text-center',
        'bg-gradient-to-br from-cinema-dark-card to-cinema-dark-elevated',
        'rounded-2xl shadow-lg border border-cinema-border'
      )}>
        {status === 'syncing' && (
          <>
            <div className="text-4xl mb-4 animate-spin">🎬</div>
            <h2 className="text-cinema-gold text-xl font-bold mb-2">
              {dict.common.loading}
            </h2>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="text-4xl mb-4">✅</div>
            <h2 className="text-green-400 text-xl font-bold mb-2">
              {dict.session.success}
            </h2>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="text-4xl mb-4">❌</div>
            <h2 className="text-red-400 text-xl font-bold mb-2">
              {dict.common.error}
            </h2>
            <p className="text-cinema-text-muted mb-4">{error}</p>
            <button
              onClick={() => router.push(`/${lang}`)}
              className={clsx(
                'px-6 py-2 rounded-lg font-bold',
                'bg-gradient-to-r from-cinema-gold to-cinema-gold-dark text-cinema-dark',
                'hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cinema-gold/50',
                'transition-all duration-300'
              )}
            >
              {dict.notFound.backHome}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <AuthCallbackContent />
    </Suspense>
  );
}
