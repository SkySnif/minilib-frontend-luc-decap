// frontend/src/pages/LivresPage.tsx
import { useState, useEffect } from "react";
import type { Livre } from "../types";
import { getLivres } from "../services/livreService";
import LivreCard from "../components/LivreCard";

function LivresPage() 
{
  // Les 3 états pour tout fetch : données, chargement, erreur
  const [livres,     setLivres]     = useState<Livre[]>([]);
  const [chargement, setChargement] = useState<boolean>(true);
  const [erreur,     setErreur]     = useState<string | null>(null);

  // Chargement au montage du composant
  useEffect(
    () => 
      {
        const chargerLivres = async () => 
        {
          try 
          {
            setChargement(true);
            setErreur(null);
            const data = await getLivres();
            setLivres(data);
          }
          catch (err) 
          {
            setErreur(err instanceof Error ? err.message : "Erreur inconnue");
          } 
          finally 
          {
            setChargement(false);
          }
        };

        chargerLivres();
      }, 
      []
  ); // [] = une seule fois au montage

  // ── Rendu conditionnel ──────────────────────────────────────
  if (chargement) {
    return <p>Chargement du catalogue...</p>;
  }

  if (erreur) 
  {
    return (
      <div>
        <p style={{ color: "red" }}>Erreur : {erreur}</p>
        <p>Vérifiez que le backend tourne sur http://${import.meta.env.VITE_API_MINILIB_HOST}:${import.meta.env.VITE_API_MINILIB_PORT}</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Catalogue de livres</h1>
      <p style={{ marginBottom: "16px", color: "#555" }}>
        {livres.length} livre{livres.length > 1 ? "s" : ""} dans la bibliothèque
      </p>
      {livres.length === 0 ? (
        <p>Aucun livre dans le catalogue.</p>
      ) : (
        livres.map((livre) => (
          <LivreCard key={livre.id} livre={livre} />
        ))
      )}
    </div>
  );
}

export default LivresPage;
