import React from 'react';
import Config from './utilitati/Config';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Componente de pagini
import LogoutComponent from './pagini/LogoutComponent';
import Login from './pagini/login';
import ComponentaAcasa from './pagini/ComponentaAcasa';
import ComponentaFurnizor from './pagini/ComponentaFurnizor';
import ComponentaDetaliiFurnizor from './pagini/ComponentaDetaliiFurnizor';
import ComponentaAdaugareBanca from './pagini/ComponentaAdaugareBanca';
import ComponentaEditBanca from './pagini/ComponentaEditBanca';
import ComponentaAdaugareProdus from './pagini/ComponentaAdaugareProdus';
import ComponentaEditProdus from './pagini/ComponentaEditProdus';
import ComponentaContFurnizor from './pagini/ComponentaContFurnizor';
import ComponentaAngajat from './pagini/ComponentaAngajat';
import ComponentaDetaliiAngajat from './pagini/ComponentaDetaliiAngajat';
import ComponentaGenerareFactura from './pagini/ComponentaGenerareFactura';
import ComponentaCerereClient from './pagini/ComponentaCerereClient';

// Wrapper care protejează rutele și încarcă layout-ul principal
import PrivateRouteNew from "./utilitati/PrivateRouteNew";

// Găsim elementul root în HTML și creăm un root React
const rootElement = document.getElementById('root');
if (!rootElement) throw new Error("Root element not found");

const root = createRoot(rootElement);

// Render-ul aplicației React
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        {/* Ruta publică de login */}
        <Route path="/" element={<Login />} />

        {/* Ruta de logout */}
        <Route path={Config.logoutPageUrl} element={<LogoutComponent />} />
        
        {/* Rutele protejate – dacă utilizatorul nu e logat, redirectează la "/" */}
        
        {/* Pagina de start / dashboard */}
        <Route 
          path="/acasa" 
          element={<PrivateRouteNew page={ComponentaAcasa} activepage="0" />} 
        />
        
        {/* Gestionare furnizori */}
        <Route 
          path="/furnizor" 
          element={<PrivateRouteNew page={ComponentaFurnizor} activepage="1" />} 
        />

        {/* Detalii furnizor (din lista furnizori) */}
        <Route 
          path="/detaliifurnizor/:id" 
          element={<PrivateRouteNew page={ComponentaDetaliiFurnizor} activepage="1" />} 
        />

        {/* Adăugare cont bancar pentru un furnizor */}
        <Route 
          path="/adaugaBancaFurnizor/:id" 
          element={<PrivateRouteNew page={ComponentaAdaugareBanca} activepage="1" />} 
        />

        {/* Editare cont bancar furnizor */}
        <Route 
          path="/editBancaFurnizor/:id_furnizor/:id" 
          element={<PrivateRouteNew page={ComponentaEditBanca} activepage="1" />} 
        />

        {/* Adăugare produs nou */}
        <Route 
          path="/adaugareProdus" 
          element={<PrivateRouteNew page={ComponentaAdaugareProdus} activepage="2" />} 
        />

        {/* Gestionare și editare produse */}
        <Route 
          path="/gestionareProdus" 
          element={<PrivateRouteNew page={ComponentaEditProdus} activepage="3" />} 
        />

        {/* Gestionare cont furnizor (tranzacții) */}
        <Route 
          path="/gestionareContFurnizor" 
          element={<PrivateRouteNew page={ComponentaContFurnizor} activepage="4" />} 
        />

        {/* Gestionare angajați */}
        <Route 
          path="/gestionareAngajat" 
          element={<PrivateRouteNew page={ComponentaAngajat} activepage="5" />} 
        />

        {/* Detalii angajat */}
        <Route 
          path="/detaliiAngajat/:id" 
          element={<PrivateRouteNew page={ComponentaDetaliiAngajat} activepage="5" />} 
        />

        {/* Vizualizare și gestionare cereri clienți */}
        <Route 
          path="/cerereClient" 
          element={<PrivateRouteNew page={ComponentaCerereClient} activepage="6" />} 
        />

        {/* Generare factură */}
        <Route 
          path="/generareFactura" 
          element={<PrivateRouteNew page={ComponentaGenerareFactura} activepage="7" />} 
        />
      </Routes>
    </Router>
  </React.StrictMode>
);
