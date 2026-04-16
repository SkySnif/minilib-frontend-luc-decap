// frontend/src/pages/LivresPage.tsx

import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import { useNavigate } from "react-router-dom";
import type { NavigateFunction }  from "react-router-dom";

import { filtreLivreSchema } from "@hendec/types";
import type { Livre, FiltresLivre } from "@hendec/types";

import { getLivres, supprimerLivre } from "../../../services/livreService";
import LivreCard from "../../../components/LivreCard";

// tmp type to put in @hendec - review format and validation/enum
import type { infoMessage } from "../../../types/index";
// Tmp auth for test button Delete, Edit or Emprunt
import { useAuth } from "../../../auth/auth"

export function LivresList() 
{
  // Les 3 états pour tout fetch : données, chargement, erreur
  const [livres,     setLivres]     = useState<Livre[]>([]);
  const [chargement, setChargement] = useState<boolean>(true);
  const [erreur,     setErreur]     = useState<string | null>(null);
  const [feedbackMessage,     setMessage]     = useState<infoMessage> ( { status: "", message: "" });


  // Retrieve the url param to put it the DTO LivreFiltre
  const [searchParams] = useSearchParams();

  // Retrieve context rigths
  const { isallowToEdit, isallowToDelete, isAllowToBook } = useAuth();
  
  const navigate: NavigateFunction = useNavigate();

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

  const handleDelete = async (id: number) => 
  {
    try
    {
      if ( confirm(`Etes-vous sure de vouloir supprimer le livre "${livres.find(livre => livre.id == id)?.titre}" !`) == true) {
        await supprimerLivre(id);

        setMessage( { status : "ok", message: `Livre ${id} supprimé` } );

        // update current list
        const updatedLivrelist = livres.filter(livre => livre.id !== id);
        setLivres(updatedLivrelist);
      } 
    }
    catch( err: any)
    {
      setMessage( { status : "ko", message: `Suppession livre ${id} failed: ${err.message}` } );
    }
  }


  return (
    <div>
      <h1>Catalogue de livres</h1>
      
      <p style={{ marginBottom: "16px", color: "#000000" }}>
        {livres.length} livre{livres.length > 1 ? "s" : ""} dans la bibliothèque
      </p>
      
      {
        livres.length === 0 ? 
        (
          <p>Aucun livre dans le catalogue.</p>
        ) 
        : 
        (
          livres.map(
            (livre) => 
            (
            <LivreCard 
              livre={livre} 
              canReserve={isAllowToBook}
              canEdit={isallowToEdit} 
              canDelete={isallowToDelete} 
              onReserver={() => navigate(`../../update/${livre.id}`)}
              onEdit={() => navigate(`../../update/${livre.id}`)}
              onDelete={() => handleDelete(livre.id) }
            />
            )
          )
        )
      }
      <div id="floating_message" style={{backgroundColor: feedbackMessage.status == "ok" ? "#21a315e3": "#e4243e" }}>
        {feedbackMessage.message}
      </div>    
    </div>
  );
}
