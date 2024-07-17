"use client";

export const getInLocalstorage = (key: string) => {
  const storedValue = localStorage.getItem(key);
  if (storedValue && storedValue !== "undefined") {
    return JSON.parse(storedValue);
  }
  // Manejar el caso en el que el valor sea "undefined" o no válido
  return null; // O cualquier otro valor predeterminado apropiado
};
