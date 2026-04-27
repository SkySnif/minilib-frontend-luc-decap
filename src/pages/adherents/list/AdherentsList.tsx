// frontend/src/pages/adherentsPage.tsx

import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import { useNavigate } from "react-router-dom";
import type { NavigateFunction }  from "react-router-dom";

import { filtreadherentSchema } from "@hendec/types";
import type { adherentsListDto, FiltresadherentDto } from "@hendec/types";


import { getadherents, supprimeradherent } from "../../../services/adherentService";
import adherentCard from "../../../components/adherentCard";

// tmp type to put in @hendec - review format and validation/enum
import type { infoMessage } from "../../../types/index";
// Tmp auth for test button Delete, Edit or Emprunt
import { useAuth } from "../../../auth/auth"

export function adherentsList() 
{
  // Les 3 états pour tout fetch : données, chargement, erreur
  const [adherents,     setadherents]     = useState<adherentsListDto>([]);
  const [chargement, setChargement] = useState<boolean>(true);
  const [erreur,     setErreur]     = useState<string | null>(null);
  const [feedbackMessage,     setMessage]     = useState<infoMessage> ( { status: "", message: "" });

  // Retrieve the url param to put it the DTO adherentFiltre
  const [searchParams] = useSearchParams();

  // Retrieve context rigths
  const { isallowToEdit, isallowToDelete, isAllowToBook } = useAuth();
  
  const navigate: NavigateFunction = useNavigate();

  // Chargement au montage du composant
  useEffect(
    () => 
      {
        const raw = Object.fromEntries(searchParams.entries());

        const filtres: FiltresadherentDto = filtreadherentSchema.parse({
        ...raw,
          disponible:
          raw.disponible === undefined
             ? undefined
            : raw.disponible === "true"
        }
      );

      const chargeradherents = async () => 
      {
        try 
        {
          setChargement(true);
          setErreur(null);

          const data = await getadherents(filtres);

          // in case of no data (404) manage inn the Api, the function will return undefined
          // Set adherents empty in this case to refresh to page/state
          if ( data === undefined) 
          {
            setadherents( [] );
            return;
          }


          setadherents(data);
        }
        catch (err: any) 
        {
          setMessage( { status : "error", message: err instanceof Error ? `Error: ${err.message}` : "Erreur inconnue" });
          setErreur(err instanceof Error ? err.message : "Erreur inconnue");
        } 
        finally 
        {
          setChargement(false);
        }
      };

      chargeradherents();
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
    if ( erreur.includes( ""))
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
      if ( confirm(`Etes-vous sure de vouloir supprimer le adherent "${adherents.find(adherent => adherent.id == id)?.titre}" !`) == true) {
        await supprimeradherent(id);

        setMessage( 
          { status : "ok", message: `adherent ${id} supprimé` } 
        );

        // update current list
        const updatedadherentlist = adherents.filter(adherent => adherent.id !== id);
        setadherents(updatedadherentlist);
      } 
    }
    catch( err: any)
    {
      setMessage( { status : "error", message: `Suppession adherent ${id} failed: ${err.message}` } );
    }
  }


  return (
    <div>
      <h1>Catalogue de adherents</h1>
      
      <p style={{ marginBottom: "16px", color: "#000000" }}>
        {adherents.length} adherent{adherents.length > 1 ? "s" : ""} dans la bibliothèque
      </p>
      
      {
        adherents.length === 0 ? 
        (
          <p>Aucun adherent dans le catalogue.</p>
        ) 
        : 
        (
          adherents.map(
            (adherent) => 
            (
            <adherentCard 
              adherent={adherent} 
              canReserve={isAllowToBook}
              canEdit={isallowToEdit} 
              canDelete={isallowToDelete} 
              onReserver={() => navigate(`../../update/${adherent.id}`)}
              onEdit={() => navigate(`../update/${adherent.id}`)}
              onDelete={() => handleDelete(adherent.id) }
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
