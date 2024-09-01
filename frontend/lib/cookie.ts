'use client'

import Cookies from "js-cookie";

// Fonction pour obtenir le token de session
export const getSessionToken = (): string | undefined => {
  return Cookies.get("session");
};

// Fonction pour définir le token de session
export const setSessionToken = (token: string): void => {
  const expirationDate = new Date();
  expirationDate.setFullYear(expirationDate.getFullYear() + 100);
  Cookies.set("session", token, { expires: expirationDate, domain:"localhost", sameSite:"None", secure:true });
};

// Fonction pour supprimer le token de session
export const removeSessionToken = (): void => {
  Cookies.remove("session")
};
