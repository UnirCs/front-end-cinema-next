'use client';

// Client Component - Wrapper de proveedores de contexto
// - Auth0Provider: Proporciona el estado de autenticacion de Auth0
// - AuthProvider: Wrapper que expone el usuario en el contexto
// - GlobalProvider: Estado global de la aplicacion (ciudad seleccionada, etc.)

import { Auth0Provider } from '@auth0/nextjs-auth0';
import { AuthProvider } from '@/context/AuthContext';
import { GlobalProvider } from '@/context/GlobalContext';

export function Providers({ children }) {
  return (
    <Auth0Provider>
      <AuthProvider>
        <GlobalProvider>
          {children}
        </GlobalProvider>
      </AuthProvider>
    </Auth0Provider>
  );
}
