'use client';

// Client Component - Proveedor de contexto de autenticacion con Auth0:
// - Utiliza useUser de @auth0/nextjs-auth0 para obtener el usuario autenticado
// - Auth0 maneja la cookie __session automaticamente
// - Proporciona compatibilidad con componentes existentes

import { createContext } from 'react';
import { useUser } from '@auth0/nextjs-auth0';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { user: auth0User, error, isLoading } = useUser();

  // Mapear el usuario de Auth0 a la estructura esperada por los componentes
  const user = auth0User ? {
    name: auth0User.name || auth0User.email?.split('@')[0],
    email: auth0User.email,
    // Para el rol, usamos 'user' por defecto ya que Auth0 no lo proporciona directamente
    // Los usuarios admin pueden ser gestionados desde el dashboard de Auth0 o la BD
    role: 'user',
    picture: auth0User.picture
  } : null;

  return (
    <AuthContext.Provider value={{ user, error, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
