import React from "react";
import { Navigate } from "react-router-dom";
import AuthHandler from "../utilitati/AuthHandler";
import MainComponent from "../componente/MainComponentWrapper";

/**
 * PrivateRouteNew protejează accesul paginilor care necesită autentificare.
 * - Dacă utilizatorul NU este logat, redirecționează către pagina de login ('/').
 * - Altfel, încarcă wrapper-ul MainComponent, care ofereă layout-ul și contextul aplicației.
 *
 * Props:
 *  - page: numele sau identificatorul paginii care va fi afișată
 *  - activepage: index sau cheie pentru item-ul activ din meniu
 *  - ...props: orice alte props care trebuie transmise mai departe către MainComponent
 */
const PrivateRouteNew = ({ page, activepage, ...props }) => {
  // Verifică dacă există token-urile de autentificare în localStorage
  if (!AuthHandler.loggedIn()) {
    // Dacă nu e autentificat, redirecționează spre login (ruta '/')
    return <Navigate to="/" replace />;
  }

  // Dacă e autentificat, încarcă componenta principală cu pagina dorită
  return (
    <MainComponent
      page={page}             // pagina care va fi randată în wrapper
      activepage={activepage} // elementul de meniu care va fi marcat ca activ
      {...props}              // orice alte props necesare paginii
    />
  );
};

export default PrivateRouteNew;
