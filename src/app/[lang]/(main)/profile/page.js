// Server Component - Pagina de perfil con i18n

import { auth0 } from '@/lib/auth0';
import { findUserByEmail } from '@/app/api/v1/_store';
import { getUserOrdersFromStore } from '@/lib/api-server';
import { redirect } from 'next/navigation';
import { getDictionary } from '@/lib/i18n/dictionaries';
import clsx from 'clsx';
import OrderCard from './OrderCard';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export default async function ProfilePage({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const session = await auth0.getSession();

  if (!session) {
    redirect('/auth/login');
  }

  const { user: auth0User } = session;
  const dbUser = await findUserByEmail(auth0User.email);

  const user = dbUser || {
    name: auth0User.name || auth0User.email.split('@')[0],
    email: auth0User.email,
    role: 'user'
  };

  const orders = dbUser ? await getUserOrdersFromStore(dbUser.id) : [];

  return (
    <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
      {/* Tarjeta de perfil */}
      <div className={clsx(
        'max-w-md mx-auto mt-8 p-8',
        'bg-gradient-to-br from-cinema-dark-card to-cinema-dark-elevated',
        'rounded-2xl shadow-lg border border-cinema-border'
      )}>
        <h2 className="text-cinema-gold text-2xl font-bold text-center mb-2 pb-4 border-b-4 border-cinema-red">
          {dict.profile.title}
        </h2>

        <div className="space-y-4 mt-6">
          {auth0User.picture && (
            <div className="flex justify-center">
              <img
                src={auth0User.picture}
                alt="Avatar"
                className="w-24 h-24 rounded-full border-4 border-cinema-gold"
              />
            </div>
          )}

          <div className="bg-cinema-dark-elevated p-4 rounded-lg">
            <p className="text-cinema-text-muted text-sm">{dict.profile.name}</p>
            <p className="text-cinema-text font-semibold">{user.name}</p>
          </div>

          <div className="bg-cinema-dark-elevated p-4 rounded-lg">
            <p className="text-cinema-text-muted text-sm">{dict.profile.email}</p>
            <p className="text-cinema-text font-semibold">{user.email}</p>
          </div>

          <div className="bg-cinema-dark-elevated p-4 rounded-lg">
            <p className="text-cinema-text-muted text-sm">{dict.profile.role}</p>
            <p className="text-cinema-text font-semibold capitalize">{user.role}</p>
          </div>

          <div className="mt-6 p-4 bg-cinema-dark-elevated rounded-lg border-l-4 border-green-500">
            <p className="text-green-400 font-semibold">{dict.profile.authenticatedWith}</p>
            <p className="text-cinema-text-muted text-sm mt-1">{dict.profile.syncMessage}</p>
          </div>
        </div>

        <a
          href="/auth/logout"
          className={clsx(
            'block w-full mt-6 p-3 rounded-lg font-bold text-center',
            'bg-gradient-to-r from-cinema-red to-cinema-red-dark text-white',
            'hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cinema-red/50',
            'transition-all duration-300'
          )}
        >
          {dict.nav.logout}
        </a>
      </div>

      {/* Seccion de ordenes */}
      <div className="mt-12">
        <h2 className="text-cinema-gold text-2xl font-bold text-center mb-8 pb-4 border-b-2 border-cinema-border">
          {dict.profile.myTickets}
        </h2>

        {orders.length === 0 ? (
          <div className={clsx(
            'max-w-md mx-auto p-8 text-center',
            'bg-gradient-to-br from-cinema-dark-card to-cinema-dark-elevated',
            'rounded-2xl shadow-lg border border-cinema-border'
          )}>
            <div className="text-6xl mb-4">🎬</div>
            <p className="text-cinema-text-muted">
              {dict.profile.noTickets}
            </p>
            <a
              href={`/${lang}/cartelera/madrid`}
              className={clsx(
                'inline-block mt-4 px-6 py-2 rounded-lg font-bold',
                'bg-gradient-to-r from-cinema-gold to-cinema-gold-dark text-cinema-dark',
                'hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cinema-gold/50',
                'transition-all duration-300'
              )}
            >
              {dict.profile.viewBillboard}
            </a>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} dict={dict} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
