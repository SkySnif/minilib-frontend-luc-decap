// frontend/src/pages/LivresRecherche
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { useNavigate } from "react-router-dom";
import type { NavigateFunction }  from "react-router-dom";

import { getLivreById, updateLivre } from "../../../services/livreService";
import type { Livre } from "@hendec/types/minilib";

import type { infoMessage } from "../../../types/index";

// Tmp auth for test button Delete, Edit or Emprunt
import { useAuth } from "../../../auth/auth"

/**
 * Search for livres
 *
 */
export function LivresPageUpdate()
{

  const v_navigate: NavigateFunction = useNavigate();
  const { id } = useParams();

  const [livre,     setLivre]     = useState<Livre>();
  const [chargement, setChargement] = useState<boolean>(true);
  const [erreur,     setErreur]     = useState<string | null>(null);
  const [feedbackMessage,     setMessage]     = useState<infoMessage> ( { status: "", message: "" });

  // Retrieve context rigths
  const { isallowToEdit } = useAuth();

  if ( !isallowToEdit)
    v_navigate( '/');


  // Chargement au montage du composant
  useEffect(
    () => 
      {

      const chargerLivreToUpdate = async () => 
      {
        try 
        {
          setChargement(true);
          setErreur(null);
          const data: Livre = await getLivreById(Number(id));
          setLivre(data);
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

      chargerLivreToUpdate();
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
      <div>
        <p style={{ color: "red" }}>Erreur : {erreur}</p>
        <p>Vérifiez que le backend tourne</p>
      </div>
    );
  }

  if (!livre) 
    return <p>Livre Introuvable</p>;


const handleUpdate = async () => {
  if (!livre) return;
    try
    {
      const retour: Livre|null=await updateLivre(livre);
      setMessage( { status : "ok", message: "Mise à jours done" } );
    }
    catch (err) 
    {
      setMessage( { status : "ko", message: "Mise à jours failed" } );
    }
};

  return (
    <div>
      <p>
      <label id="edit_title">
        <p>Mise à jours livre {livre.isbn} - id : {livre.id} </p>
      </label>
      </p>

      <p>
      <label id="edit_label">ISBN: </label>
      <input id="edit"
        value={livre.isbn}
        onChange={(e) =>
          setLivre({ ...livre, isbn: e.target.value })
        }
      />
      </p>

      <p>
      <label id="edit_label">Titre: </label>
      <input id="edit"
        value={livre.titre}
        onChange={(e) =>
          setLivre({ ...livre, titre: e.target.value })
        }
      />
      </p>

      <p>
      <label id="edit_label">Auteur: </label>
      <input id="edit"
        value={livre.auteur}
        onChange={(e) =>
          setLivre({ ...livre, auteur: e.target.value })
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
        value={livre.annee ?? ""}
        onChange={(e) =>
          setLivre({ ...livre, annee: Number(e.target.value) })
        }
      />
      </p>

      <p>
      <label id="edit_label">Disponibilité: </label>
      <input
        type="checkbox"
        checked={livre.disponible}
        onChange={(e) =>
          setLivre({ ...livre, disponible: e.target.checked })
        }
      />
      </p>

      <p>
      <label id="edit_label">Genre: </label>
      <select id="edit"
        value={livre.genre ?? "" }
        onChange={(e) =>
          setLivre( { ...livre, genre: e.target.value })}
      >
        <option value={livre.genre ?? "N/A"}>{livre.genre}</option>
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
        onClick={() => v_navigate(-1)}
      >
      Retour
    </button>
      <div id="floating_message" style={{backgroundColor: feedbackMessage.status == "ok" ? "#21a315e3": "#e4243e" }}>
        {feedbackMessage.message}
      </div>
  </div>
  )
}

