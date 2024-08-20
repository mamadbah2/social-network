import Cookies from "js-cookie";

// Fonction pour obtenir le token de session
export const getSessionToken = (): string | undefined => {
  return Cookies.get("token");
};

// Fonction pour définir le token de session
export const setSessionToken = (token: string): void => {
  Cookies.set("token", token, { expires: 7 });
};

// Fonction pour supprimer le token de session
export const removeSessionToken = (): void => {
  Cookies.remove("token");
};
