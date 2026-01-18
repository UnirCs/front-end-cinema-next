import Link from 'next/link';

/**
 * Página Not Found Global (Root level)
 *
 * Esta página se muestra cuando no se encuentra una ruta
 * en el nivel raíz de la aplicación (fuera de route groups).
 *
 * A diferencia del not-found dentro del grupo (main),
 * esta página NO incluye el Header ni el Footer ya que
 * está fuera del layout del grupo.
 */
export default function GlobalNotFound() {
  return (
    <html lang="es">
      <body>
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          color: '#fff',
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          padding: '2rem',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '8rem',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #007bff 0%, #00d4ff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '1rem'
          }}>
            404
          </div>

          <h1 style={{
            fontSize: '2.5rem',
            marginBottom: '1rem',
            fontWeight: '600'
          }}>
            🎬 Página no encontrada
          </h1>

          <p style={{
            fontSize: '1.2rem',
            opacity: 0.8,
            maxWidth: '500px',
            marginBottom: '2rem',
            lineHeight: 1.6
          }}>
            ¡Ups! Parece que esta película no está en cartelera.
            La página que buscas no existe o ha sido movida.
          </p>

          <Link
            href="/es"
            prefetch={false}
            style={{
              background: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)',
              color: '#fff',
              padding: '1rem 2rem',
              borderRadius: '50px',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '1.1rem',
              boxShadow: '0 4px 15px rgba(0, 123, 255, 0.4)',
              transition: 'all 0.3s ease'
            }}
          >
            🏠 Volver a UNIR Cinema
          </Link>

          <p style={{
            marginTop: '3rem',
            opacity: 0.5,
            fontSize: '0.9rem'
          }}>
            UNIR Cinema - Tu experiencia cinematográfica
          </p>
        </div>
      </body>
    </html>
  );
}

