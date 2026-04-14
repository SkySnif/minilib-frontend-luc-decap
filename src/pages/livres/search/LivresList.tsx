// frontend/src/pages/LivresPage.tsx

import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import { useNavigate } from "react-router-dom";
import type { NavigateFunction }  from "react-router-dom";

import { filtreLivreSchema } from "@hendec/types";
import type { Livre, FiltresLivre } from "@hendec/types";

import { getLivres } from "../../../services/livreService";
import LivreCard from "../../../components/LivreCard";

// Tmp auth for test button Delete, Edit or Emprunt
import { useAuth } from "../../../auth/auth"

export function LivresList() 
{
  // Les 3 états pour tout fetch : données, chargement, erreur
  const [livres,     setLivres]     = useState<Livre[]>([]);
  const [chargement, setChargement] = useState<boolean>(true);
  const [erreur,     setErreur]     = useState<string | null>(null);
  
  // Retrieve the url param to put it the DTO LivreFiltre
  const [searchParams] = useSearchParams();

  // Retrieve context rigths
  const { isallowToEdit, isallowToDelete, isAllowToBook } = useAuth();
  
  const v_navigate: NavigateFunction = useNavigate();

  // Chargement au montage du composant
  useEffect(
    () => 
      {
        const raw = Object.fromEntries(searchParams.entries());

        const filtres: FiltresLivre = filtreLivreSchema.parse({
        ...raw,
          disponible:
          raw.disponible === undefined
             ? undefined
            : raw.disponible === "true"
        }
      );

      const chargerLivres = async () => 
      {
        try 
        {
          setChargement(true);
          setErreur(null);
          const data: Livre[] = await getLivres(filtres);
          setLivres(data);
        }
        catch (err) 
        {
          alert( "Error catched");
          setErreur(err instanceof Error ? err.message : "Erreur inconnue");
        } 
        finally 
        {
          setChargement(false);
        }
      };

      chargerLivres();
    }, 
    [searchParams]
  ); // [] = une seule fois au montage

  // ── Rendu conditionnel ──────────────────────────────────────
  if (chargement) 
  {
    return <p>Chargement du catalogue...</p>;
  }

  if (erreur) 
  {
    return (
      <div>
        <p style={{ color: "red" }}>Erreur : {erreur}</p>
        <p>Vérifiez que le backend tourne</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Catalogue de livres</h1>
      <p style={{ marginBottom: "16px", color: "#000000" }}>
        {livres.length} livre{livres.length > 1 ? "s" : ""} dans la bibliothèque
      </p>
      {livres.length === 0 ? (
        <p>Aucun livre dans le catalogue.</p>
      ) : (
        livres.map((livre) => (
          <LivreCard livre={livre} 
            canReserve={isAllowToBook}
            canEdit={isallowToEdit} 
            canDelete={isallowToDelete} 
            onReserver={() => v_navigate(`../../update/${livre.id}`)}
            onEdit={() => v_navigate(`../../update/${livre.id}`)}
            onDelete={() => v_navigate(`../../update/${livre.id}`)}
                />
//          <LivreCard key={livre.id} livre={livre} />
))
      )}
    </div>
  );
}
