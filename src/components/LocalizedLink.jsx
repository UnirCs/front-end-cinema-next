"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

/**
 * Componente Link localizado que automáticamente añade el prefijo
 * del idioma actual a los enlaces.
 */
export default function LocalizedLink({ href, children, ...rest }) {
  const { lang } = useParams();

  // Normaliza el href para que siempre empiece con /
  const normalized = href.startsWith("/") ? href : `/${href}`;

  // Evita duplicar el prefijo del idioma si ya está presente
  const finalHref =
    normalized.startsWith(`/${lang}/`) || normalized === `/${lang}`
      ? normalized
      : `/${lang}${normalized}`;

  return (
    <Link href={finalHref} prefetch={false} {...rest}>
      {children}
    </Link>
  );
}
