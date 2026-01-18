// Server Component - Página About con i18n

import clsx from 'clsx';
import { getDictionary } from '@/lib/i18n/dictionaries';


export default async function AboutPage({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  const sectionClasses = clsx(
    'mb-8 bg-gradient-to-br from-cinema-dark-card to-cinema-dark-elevated',
    'p-6 rounded-xl shadow-lg border border-cinema-border'
  );

  const cityCardClasses = clsx(
    'bg-cinema-dark-elevated p-4 rounded-lg text-center',
    'border border-cinema-border',
    'hover:border-cinema-gold hover:-translate-y-1',
    'transition-all duration-300',
    'hover:shadow-lg hover:shadow-cinema-gold/20'
  );

  const cities = [
    { icon: '🏙️', name: 'Madrid', desc: dict.about.madrid },
    { icon: '🌊', name: 'Barcelona', desc: dict.about.barcelona },
    { icon: '🍊', name: 'Valencia', desc: dict.about.valencia },
    { icon: '🌞', name: 'Sevilla', desc: dict.about.sevilla },
  ];

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h2 className="text-cinema-gold text-3xl md:text-4xl font-bold text-center mb-8 pb-4 border-b-4 border-cinema-red">
        {dict.about.title}
      </h2>

      <section className={sectionClasses}>
        <h3 className="text-cinema-red text-xl font-bold mb-3">{dict.about.whoWeAre}</h3>
        <p className="text-cinema-text-muted leading-relaxed">
          {dict.about.whoWeAreText}
        </p>
      </section>

      <section className={sectionClasses}>
        <h3 className="text-cinema-red text-xl font-bold mb-3">{dict.about.history}</h3>
        <p className="text-cinema-text-muted leading-relaxed">
          {dict.about.historyText}
        </p>
      </section>

      <section className={sectionClasses}>
        <h3 className="text-cinema-red text-xl font-bold mb-4">{dict.about.ourCities}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {cities.map((city) => (
            <div key={city.name} className={cityCardClasses}>
              <h4 className="text-cinema-gold text-lg font-bold mb-2">{city.icon} {city.name}</h4>
              <p className="text-cinema-text-muted text-sm">{city.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={clsx(
        'bg-gradient-to-r from-cinema-red to-cinema-red-dark',
        'p-6 rounded-xl text-center',
        'shadow-lg shadow-cinema-red/30'
      )}>
        <h3 className="text-white text-xl font-bold mb-4">{dict.about.contact}</h3>
        <p className="text-white/90 mb-1">📧 Email: info@unircinema.es</p>
        <p className="text-white/90">📞 Teléfono: +34 900 123 456</p>
      </section>
    </div>
  );
}
