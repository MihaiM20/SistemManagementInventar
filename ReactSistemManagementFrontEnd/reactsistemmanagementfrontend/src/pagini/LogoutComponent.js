import React from 'react';
import { Navigate } from 'react-router-dom';
import AuthHandler from '../utilitati/AuthHandler';

/**
 * LogoutComponent este componenta care se ocupă de deconectarea utilizatorului.
 * La renderizare, apelează AuthHandler.logoutUser() pentru a șterge token-urile
 * și apoi redirecționează utilizatorul către pagina de login (/).
 */
class LogoutComponent extends React.Component {
  render() {
    // Ștergem access și refresh token din localStorage
    AuthHandler.logoutUser();
    // Redirect către ruta de login ('/'), înlocuind istoricul curent
    return <Navigate to="/" replace />;
  }
}

export default LogoutComponent;
