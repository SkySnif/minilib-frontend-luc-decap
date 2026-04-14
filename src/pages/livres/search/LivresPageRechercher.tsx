// frontend/src/pages/LivresPage.tsx

import { Outlet } from 'react-router-dom';

import { LivresRecherche } from './LivresRecherche';

export function LivresPageRechercher() 
{
  return (
     <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      
        {/* BARRE HAUT */}
        <header style={{ padding: "1rem", borderBottom: "3px solid #ccc" }}>
          <LivresRecherche />
        </header>

        {/* CONTENU */}
        <main style={{ padding: "1rem", flex: 1 }}>
          {/* Contenu dynamique */}
          <Outlet />
        </main>
    </div>
  );
}
