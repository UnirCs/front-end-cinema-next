'use client';

import { useContext, useEffect } from 'react';
import { GlobalContext } from '@/context/GlobalContext';

export default function CitySyncClient({ city }) {
  const { changeCity } = useContext(GlobalContext);

  useEffect(() => {
    changeCity(city);
  }, [city, changeCity]);

  return null;
}
