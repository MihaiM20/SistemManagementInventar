import axios from "axios";
import Config from "./Config";
import { reactLocalStorage } from "reactjs-localstorage";

class AuthHandler {
  /**
   * Încercare autentificare cu username și parolă.
   * La succes, salvează access & refresh token și rolul utilizatorului.
   */
  static async login(username, password, callback) {
    try {
      const response = await axios.post(
        Config.loginUrl.trim(),
        { username, parola: password }
      );
      if (response.status === 200) {
        // Preluăm token-urile și rolul direct din răspunsul backend
        const { access, refresh, role } = response.data;

        // Salvăm token-urile
        reactLocalStorage.set("token", access);
        reactLocalStorage.set("refresh", refresh);

        // Salvăm rolul și datele userului
        reactLocalStorage.setObject("user", { username, role });

        callback({ error: false, message: "Conectare reușită!" });
      }
    } catch (error) {
      console.error("Eroare la login:", error);
      callback({ error: true, message: "Eroare la conectare, date invalide!" });
    }
  }

  /** Returnează true dacă există token-uri salvate */
  static loggedIn() {
    return !!(this.getLoginToken() && this.getRefreshToken());
  }

  /** Returnează access token-ul */
  static getLoginToken() {
    return reactLocalStorage.get("token");
  }

  /** Returnează refresh token-ul */
  static getRefreshToken() {
    return reactLocalStorage.get("refresh");
  }

  /** Returnează rolul curent stocat */
  static getUserRole() {
    const user = reactLocalStorage.getObject("user");
    return user?.role;
  }

  /** Șterge token-urile și datele user la logout */
  static logoutUser() {
    reactLocalStorage.remove("token");
    reactLocalStorage.remove("refresh");
    reactLocalStorage.remove("user");
  }

  /** Verifică expirare token */
  static checkTokenExpiry() {
    const token = this.getLoginToken();
    if (!token) return false;
    const parts = token.split(".");
    if (parts.length !== 3) return false;
    try {
      const payload = JSON.parse(atob(parts[1]));
      return Date.now() > payload.exp * 1000;
    } catch {
      return false;
    }
  }
}

export default AuthHandler;
