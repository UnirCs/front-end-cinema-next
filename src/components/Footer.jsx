// Client Component - Footer con Tailwind e i18n
'use client';

import clsx from 'clsx';
import { useI18n } from '@/lib/i18n/TranslationsProvider';

const Footer = () => {
  const { dict } = useI18n();

  return (
    <footer className={clsx(
      'bg-gradient-to-r from-cinema-dark-secondary via-cinema-dark-elevated to-cinema-dark-secondary',
      'border-t-2 border-cinema-red py-6 text-center',
      'shadow-[0_-4px_20px_rgba(0,0,0,0.5)]'
    )}>
      <p className="text-cinema-text-muted text-sm">
        {dict.footer.rights}
      </p>
    </footer>
  );
};

export default Footer;
