// Server Component - Pagina de detalles de cine con i18n

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCinemasFromStore } from '@/lib/api-server';
import { getDictionary } from '@/lib/i18n/dictionaries';
import clsx from 'clsx';

export const runtime = "nodejs";

export async function generateStaticParams() {
  const cinemas = await getCinemasFromStore();
  return cinemas.map((cinema) => ({
    city: cinema.toLowerCase(),
  }));
}


const cinemaInfo = {
  barcelona: {
    name: "Barcelona",
    address: "Passeig de Gràcia, 123, Barcelona",
    phone: "934 567 890",
    email: "barcelona@unircinema.es",
    screens: 12,
    capacity: 2500,
    parking: true,
    accessibility: true,
    vip: true,
    imax: true,
    dolbyAtmos: true,
    openingYear: 2015,
  },
  madrid: {
    name: "Madrid",
    address: "Gran Vía, 45, Madrid",
    phone: "915 678 901",
    email: "madrid@unircinema.es",
    screens: 15,
    capacity: 3000,
    parking: true,
    accessibility: true,
    vip: true,
    imax: true,
    dolbyAtmos: true,
    openingYear: 2012,
  },
  sevilla: {
    name: "Sevilla",
    address: "Calle Sierpes, 67, Sevilla",
    phone: "954 789 012",
    email: "sevilla@unircinema.es",
    screens: 8,
    capacity: 1800,
    parking: false,
    accessibility: true,
    vip: false,
    imax: false,
    dolbyAtmos: true,
    openingYear: 2018,
  },
  valencia: {
    name: "Valencia",
    address: "Plaza del Ayuntamiento, 89, Valencia",
    phone: "963 890 123",
    email: "valencia@unircinema.es",
    screens: 10,
    capacity: 2200,
    parking: true,
    accessibility: true,
    vip: true,
    imax: false,
    dolbyAtmos: true,
    openingYear: 2016,
  }
};

export default async function CinemaPage({ params }) {
  const { city, lang } = await params;
  const dict = await getDictionary(lang);
  const cinemas = await getCinemasFromStore();
  const validCities = cinemas.map(c => c.toLowerCase());

  if (!validCities.includes(city.toLowerCase())) {
    notFound();
  }

  const cinema = cinemaInfo[city.toLowerCase()];
  if (!cinema) {
    notFound();
  }

  const infoCardClasses = clsx(
    'bg-cinema-dark-elevated p-4 rounded-lg',
    'border border-cinema-border',
    'hover:border-cinema-gold transition-colors'
  );

  return (
    <div className="flex-1 p-6 md:p-10 max-w-4xl mx-auto w-full">
      <div className={clsx(
        'bg-gradient-to-br from-cinema-dark-card to-cinema-dark-elevated',
        'p-8 rounded-2xl shadow-lg border border-cinema-border'
      )}>
        <h1 className="text-cinema-gold text-3xl font-bold mb-2 pb-4 border-b-4 border-cinema-red">
          🎬 UNIR Cinema {cinema.name}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className={infoCardClasses}>
            <strong className="text-cinema-gold">{dict.cinema.address}</strong>
            <p className="text-cinema-text-muted">{cinema.address}</p>
          </div>
          <div className={infoCardClasses}>
            <strong className="text-cinema-gold">{dict.cinema.phone}</strong>
            <p className="text-cinema-text-muted">{cinema.phone}</p>
          </div>
          <div className={infoCardClasses}>
            <strong className="text-cinema-gold">{dict.cinema.email}</strong>
            <p className="text-cinema-text-muted">{cinema.email}</p>
          </div>
          <div className={infoCardClasses}>
            <strong className="text-cinema-gold">{dict.cinema.screens}</strong>
            <p className="text-cinema-text-muted">{cinema.screens}</p>
          </div>
          <div className={infoCardClasses}>
            <strong className="text-cinema-gold">{dict.cinema.capacity}</strong>
            <p className="text-cinema-text-muted">{cinema.capacity} {dict.profile.seats}</p>
          </div>
          <div className={infoCardClasses}>
            <strong className="text-cinema-gold">{dict.cinema.openSince}</strong>
            <p className="text-cinema-text-muted">{cinema.openingYear}</p>
          </div>
        </div>

        <h2 className="text-cinema-gold text-xl font-bold mt-8 mb-4">{dict.cinema.services}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { label: dict.cinema.parking, value: cinema.parking },
            { label: dict.cinema.accessibility, value: cinema.accessibility },
            { label: dict.cinema.vipRooms, value: cinema.vip },
            { label: dict.cinema.imax, value: cinema.imax },
            { label: dict.cinema.dolbyAtmos, value: cinema.dolbyAtmos },
          ].map((service) => (
            <div key={service.label} className={clsx(
              'p-3 rounded-lg text-center',
              'border',
              service.value
                ? 'bg-green-900/30 border-green-500 text-green-400'
                : 'bg-red-900/30 border-red-500 text-red-400'
            )}>
              <span className="font-semibold">{service.label}</span>
              <span className="ml-2">{service.value ? '✓' : '✗'}</span>
            </div>
          ))}
        </div>

        <Link
          href={`/${lang}/cartelera/${city}`}
          prefetch={false}
          className={clsx(
            'block mt-8 p-4 text-center rounded-lg font-bold',
            'bg-gradient-to-r from-cinema-gold to-cinema-gold-dark text-cinema-dark',
            'hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cinema-gold/50',
            'transition-all duration-300'
          )}
        >
          🎬 {dict.cinema.viewBillboard}
        </Link>
      </div>
    </div>
  );
}
