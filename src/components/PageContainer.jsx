// Server Component - Contenedor de páginas con Tailwind
// Uso de clsx para combinar clases base con className opcional

import clsx from 'clsx';

const PageContainer = ({ children, className = '' }) => {
  return (
    <div className={clsx(
      'flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full',
      className
    )}>
      {children}
    </div>
  );
};

export default PageContainer;
