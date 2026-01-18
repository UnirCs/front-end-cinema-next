// Panel de administración con i18n

import clsx from 'clsx';
import { getDictionary } from '@/lib/i18n/dictionaries';

export default async function AdminPage({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  const stats = [
    { icon: '👥', label: dict.admin.registeredUsers, value: `4 ${dict.admin.users}` },
    { icon: '🎬', label: dict.admin.movies, value: `12 ${dict.admin.titles}` },
    { icon: '📍', label: dict.admin.cities, value: `4 ${dict.admin.locations}` },
    { icon: '🎟️', label: dict.admin.todayReservations, value: `156 ${dict.admin.tickets}` },
  ];

  const statCardClasses = clsx(
    'bg-cinema-dark-elevated p-5 rounded-xl text-center',
    'border border-cinema-border',
    'hover:border-cinema-gold hover:-translate-y-1',
    'transition-all duration-300',
    'hover:shadow-lg hover:shadow-cinema-gold/20'
  );

  return (
    <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
      <div className={clsx(
        'bg-gradient-to-br from-cinema-dark-card to-cinema-dark-elevated',
        'p-8 rounded-2xl shadow-lg border border-cinema-border'
      )}>
        <h1 className="text-cinema-gold text-3xl font-bold text-center mb-2 pb-4 border-b-4 border-cinema-red">
          {dict.admin.title}
        </h1>
        <p className="text-cinema-text-muted text-center mb-8">{dict.admin.subtitle}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className={statCardClasses}>
              <span className="text-3xl block mb-2">{stat.icon}</span>
              <strong className="text-cinema-gold text-sm block mb-1">{stat.label}</strong>
              <span className="text-cinema-text text-xl font-bold">{stat.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
