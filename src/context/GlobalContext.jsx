'use client';

// Client Component - Proveedor de contexto global:
// - Los contextos de React deben ser Client Components
// - Utiliza useState para manejar ciudad seleccionada
// - Proporciona funciones para cambiar el estado global
// - El tema oscuro es ahora permanente, no requiere toggle

import { createContext, useState } from 'react';

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {

  const [city, setCity] = useState('madrid');

  const changeCity = (newCity) => {
    setCity(newCity);
  };

  return (
    <GlobalContext.Provider value={{ city, changeCity }}>
      {children}
    </GlobalContext.Provider>
  );
};
