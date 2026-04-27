// frontend/src/pages/adherentsPage.tsx

import { Outlet } from 'react-router-dom';

import { adherentsRecherche } from './adherentsRecherche';

export function adherentsPageRechercher() 
{
  return (
     <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      
        {/* BARRE HAUT */}
        <header style={{ padding: "1rem", borderBottom: "3px solid #ccc" }}>
          <adherentsRecherche />
        </header>

        {/* CONTENU */}
        <main style={{ padding: "1rem", flex: 1 }}>
          {/* Contenu dynamique */}
          <Outlet />
        </main>
    </div>
  );
}
