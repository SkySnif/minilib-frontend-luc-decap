// frontend/src/pages/adherentsRecherche
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { useNavigate } from "react-router-dom";
import type { NavigateFunction }  from "react-router-dom";

import { adherentResponseSchema } from "@hendec/types/minilib"; // for zod validation
import type { AdherentResponseDto } from "@hendec/types/minilib";

import { getAdherentsById, updateAdherents } from "../../../services/adherentService";

// tmp type to put in @hendec - review format and validation/enum
import type { infoMessage } from "../../../types/index";
// Tmp auth for test button Delete, Edit or Emprunt
import { useAuth } from "../../../auth/auth"



/**
 * Search for adherents
 *
 */
export function adherentsPageUpdate()
{

  const navigate: NavigateFunction = useNavigate();
  const { id } = useParams();

  const [adherent,     setadherent]     = useState<AdherentResponseDto>();
  const [chargement, setChargement] = useState<boolean>(true);
  const [erreur,     setErreur]     = useState<string | null>(null);
  const [feedbackMessage,     setMessage]     = useState<infoMessage> ( { status: "", message: "" });

  // Retrieve context rigths
  const { isallowToEdit } = useAuth();

  // Check access rigth
  if ( !isallowToEdit)
    navigate( '/');

  // Chargement au montage du composant
  useEffect(
    () => 
    {

      const chargeradherentToUpdate = async () => 
      {
        try 
        {
          setChargement(true);
          setErreur(null);
          const idParam:number=Number(id)
          if ( isNaN(idParam)) 
            throw new Error(`Id invalide : ${id}`);

          const data: AdherentResponseDto = await getAdherentsByIdById(idParam);
          setadherent(data);
        }
        catch (err: any) 
        {
          setErreur(err instanceof Error ? err.message : "Erreur inconnue");
        } 
        finally 
        {
          setChargement(false);
        }
      };

      chargeradherentToUpdate();
    }, 
    [id]
  ); // [] = une seule fois au montage

  // ── Rendu conditionnel ──────────────────────────────────────
  if (chargement) 
  {
    return <p>Chargement du catalogue...</p>;
  }

  if (erreur) 
  {
    return (
      <div id="floating_message" style={{ backgroundColor: "#B71C1C" }} >
        {erreur}
      </div>
    );
  }

  if (!adherent) 
    return (
      <div id="floating_message" style={{ backgroundColor: "#B71C1C" }} >
        <p>adherent {id} introuvable</p>
      </div>
    )
      
  const handleUpdate = async () => {
    if (!adherent) return;
      try
      {
        const v_adherentValidated = adherentResponseSchema.safeParse(adherent);

        if (!v_adherentValidated.success) 
        {
          setMessage( { status : "ko", message: `adherent data invalide : ${v_adherentValidated.error}` } );
        }
        else
        {
          if ( confirm(`Etes-vous sure de vouloir mettre à jours le adherent "${v_adherentValidated.data.titre}" !`) == true) 
            {
              await updateAdherent(v_adherentValidated.data);
              setMessage( { status : "ok", message: "Mise à jours done" } );
              setadherent(v_adherentValidated.data);
            }
        }
      }
      catch (err: any) 
      {
        setMessage( { status : "ko", message: `Update book failed: ${err.message}` } );
      }
  };

  return (
    <div>
      <p>
      <label id="edit_title">
        <p>Mise à jours adherent {adherent.isbn} - id : {adherent.id} </p>
      </label>
      </p>

      <p>
      <label id="edit_label">ISBN: </label>
      <input id="edit"
        value={adherent.isbn}
        onChange={(e) =>
          setadherent({ ...adherent, isbn: e.target.value })
        }
      />
      </p>

      <p>
      <label id="edit_label">Titre: </label>
      <input id="edit"
        value={adherent.titre}
        onChange={(e) =>
          setadherent({ ...adherent, titre: e.target.value })
        }
      />
      </p>

      <p>
      <label id="edit_label">Auteur: </label>
      <input id="edit"
        value={adherent.auteur}
        onChange={(e) =>
          setadherent({ ...adherent, auteur: e.target.value })
        }
      />
      </p>

      <p>
      <label id="edit_label">Année: </label>
      <input id="edit"
        type="number" 
        min="1900" 
        max="2099" 
        step="1" 
        value={adherent.annee ?? ""}
        onChange={(e) =>
          setadherent({ ...adherent, annee: Number(e.target.value) })
        }
      />
      </p>

      <p>
      <label id="edit_label">Disponibilité: </label>
      <input
        type="checkbox"
        id="edit"
        checked={adherent.disponible}
        onChange={(e) =>
          setadherent({ ...adherent, disponible: e.target.checked })
        }
      />
      </p>

      <p>
      <label id="edit_label">Genre: </label>
      <select id="edit"
        value={adherent.genre ?? "" }
        onChange={(e) =>
          setadherent( { ...adherent, genre: e.target.value })}
      >
        <option value={adherent.genre ?? ""}>{adherent.genre}</option>
        <option value="Fantasy">Fantasy</option>
        <option value="Autres">Autres</option>
        <option value="false">Indisponible</option>
      </select>
      </p>

    <button id="edit" onClick={handleUpdate}>
      Mettre à jour
    </button>

      <button
        id="edit"
        type="button"
        value="Retour"
        onClick={() => navigate(-1)}
      >
      Retour
    </button>
    <div id="floating_message" style={{backgroundColor: feedbackMessage.status == "ok" ? "#21a315e3": "#B71C1C" }}>
      {feedbackMessage.message}
    </div>
  </div>
  )
}

