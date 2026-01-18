'use client';

/**
 * Global Error Handler (Root level)
 *
 * Esta página se muestra cuando ocurre un error
 * no capturado en cualquier parte de la aplicación.
 *
 * Debe ser un Client Component y recibe:
 * - error: El error que ocurrió
 * - reset: Función para intentar recuperarse del error
 */
export default function GlobalError({ error, reset }) {
  return (
    <html lang="es">
      <body>
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #2d1f1f 0%, #1a1a1a 100%)',
          color: '#fff',
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          padding: '2rem',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '6rem',
            marginBottom: '1rem'
          }}>
            ⚠️
          </div>

          <h1 style={{
            fontSize: '2.5rem',
            marginBottom: '1rem',
            fontWeight: '600',
            color: '#ff6b6b'
          }}>
            ¡Algo salió mal!
          </h1>

          <p style={{
            fontSize: '1.2rem',
            opacity: 0.8,
            maxWidth: '500px',
            marginBottom: '2rem',
            lineHeight: 1.6
          }}>
            Ha ocurrido un error inesperado en UNIR Cinema.
            Por favor, intenta de nuevo o vuelve al inicio.
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              onClick={() => reset()}
              style={{
                background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
                color: '#fff',
                padding: '1rem 2rem',
                borderRadius: '50px',
                border: 'none',
                fontWeight: '600',
                fontSize: '1.1rem',
                boxShadow: '0 4px 15px rgba(220, 53, 69, 0.4)',
                cursor: 'pointer'
              }}
            >
              🔄 Intentar de nuevo
            </button>

            <a
              href="/Tema_5/Codigo%20de%20apoyo/unir-cinema-08-ssg-isr/public"
              style={{
                background: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)',
                color: '#fff',
                padding: '1rem 2rem',
                borderRadius: '50px',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '1.1rem',
                boxShadow: '0 4px 15px rgba(0, 123, 255, 0.4)'
              }}
            >
              🏠 Volver al inicio
            </a>
          </div>

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

