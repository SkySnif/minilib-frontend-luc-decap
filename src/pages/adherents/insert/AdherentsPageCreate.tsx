// frontend/src/pages/adherentsRecherche
import { useState } from "react";

import { useNavigate } from "react-router-dom";
import type { NavigateFunction }  from "react-router-dom";

import { creerAdherentsdherent } from "../../../services/adherentService";


import { createadherentSchema } from "@hendec/types/minilib";
import type { CreateadherentDto, adherent } from "@hendec/types/minilib";

import type { infoMessage } from "../../../types/index";

// Tmp auth for test button Delete, Edit or Emprunt
import { useAuth } from "../../../auth/auth"

/**
 * Search for adherents
 *
 */
export function adherentsPageCreate()
{
  const navigate: NavigateFunction = useNavigate();

  // use partial instead of init empty, more secure because data are validated by Zod
  const [Createadherent, setCreateadherent] = useState<Partial<CreateadherentDto>>({});
  const [adherent,     setadherent]     = useState<adherent>();
  const [feedbackMessage,     setMessage]     = useState<infoMessage> ( { status: "", message: "" });

  const handleCreate = async () => 
  {
    if (!Createadherent) 
      return;

      try
      { 
        const v_CreateadherentValidated = createadherentSchema.safeParse(Createadherent);
  
        if (!v_CreateadherentValidated.success) 
        {
          setMessage( { status : "ko", message: `adherent data invalide : ${v_CreateadherentValidated.error}` } );
        }
        else
        {
          if ( confirm(`Etes-vous sure de vouloir créer le adherent  "${v_CreateadherentValidated.data.titre}" !`) == true) 
            {
              const v_retour: adherent = await creeradherent(v_CreateadherentValidated.data);
              setMessage( { status : "ok", message: `adherent créer : adherent id = ${v_retour.id}` } );
              setadherent(v_retour);

              // Go to update ? replaced by button "Mise à jour"
              // navigate( `/adherents/update/${v_retour?.id}`)
            }
        }
      }
      catch (err: any) 
      {
        setMessage( { status : "ko", message: `Creation failed : ${err.message}` } );
      }
  };

  // Retrieve context rigths
  const { isallowToCreate } = useAuth();

  if ( !isallowToCreate)
    navigate( '/');

// Empty at the beggining - not correct
// Instead initialition aith empty value, use Partial and zod validate before sending http request<
//if  ( !Createadherent)
//    return 

  return (
    <div>
      <label id="edit_title" >
      <p>
      { adherent ? 
          <p>adherent créé {adherent.isbn} - id : {adherent.id} </p>
      :
          <p>Creation  de adherent </p>
      }
      </p>
      </label>
      
      <p>

      <label id={ adherent ? "show_label" : "edit_label" } >ISBN: </label>
      <input id={ adherent ? "show" :  "edit" }
        value={Createadherent.isbn ?? "" }
        onChange={(e) =>
          setCreateadherent({ ...Createadherent, isbn: e.target.value })
        }
      />
      </p>

      <p>
      <label id={ adherent ? "show_label" : "edit_label" }>Titre: </label>
      <input id={ adherent ? "show" :  "edit" }
        value={Createadherent.titre ?? ""}
        onChange={(e) =>
          setCreateadherent({ ...Createadherent, titre: e.target.value })
        }
      />
      </p>

      <p>
      <label id={ adherent ? "show_label" : "edit_label" }>Auteur: </label>
      <input id={ adherent ? "show" :  "edit" }
        value={Createadherent.auteur ?? ""}
        onChange={(e) =>
          setCreateadherent({ ...Createadherent, auteur: e.target.value })
        }
      />
      </p>

      <p>
      <label id={ adherent ? "show_label" : "edit_label" }>Année: </label>
      <input id={ adherent ? "show" :  "edit" }
        type="number" 
        min="1900" 
        max="2099" 
        step="1" 
        value={Createadherent?.annee ?? (new Date()).getFullYear() }
        onChange={(e) =>
          setCreateadherent({ ...Createadherent, annee: Number(e.target.value) })
        }
      />
      </p>

      <p>
      <label id={ adherent ? "show_label" : "edit_label" }>Genre: </label>
      <select id={ adherent ? "show" :  "edit" }
        value={Createadherent?.genre ?? "" }
        onChange={(e) =>
          setCreateadherent( { ...Createadherent, genre: e.target.value })}
      >
        <option value="">-- Choisir --</option>
        <option value="Fantasy">Fantasy</option>
        <option value="Autres">Autres</option>
      </select>
      </p>

      <button id={ adherent ? "show" :  "edit" } onClick={handleCreate}>
        Créer
      </button>

      <button
        id="edit"
        type="button"
        onClick={() => { adherent ? navigate(`/adherents/update/${adherent?.id}`) : navigate(-1) }}
      >
        { adherent ?  "Mettre à jours" : "Retour" }
      </button>

      <div id="floating_message" style={{backgroundColor: feedbackMessage.status == "ok" ? "#21a315e3": "#B71C1C" }}>
        {feedbackMessage.message}
      </div>
  </div>
  )
}

