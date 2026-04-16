// frontend/src/pages/LivresRecherche
import { useState } from "react";

import { useNavigate } from "react-router-dom";
import type { NavigateFunction }  from "react-router-dom";

import { creerLivre } from "../../../services/livreService";


import { createLivreSchema } from "@hendec/types/minilib";
import type { CreateLivreDto, Livre } from "@hendec/types/minilib";

import type { infoMessage } from "../../../types/index";

// Tmp auth for test button Delete, Edit or Emprunt
import { useAuth } from "../../../auth/auth"

/**
 * Search for livres
 *
 */
export function LivresPageCreate()
{
  const navigate: NavigateFunction = useNavigate();

  // use partial instead of init empty, more secure because data are validated by Zod
  const [Createlivre, setCreateLivre] = useState<Partial<CreateLivreDto>>({});
  const [livre,     setLivre]     = useState<Livre>();
  const [feedbackMessage,     setMessage]     = useState<infoMessage> ( { status: "", message: "" });

  const handleCreate = async () => 
  {
    if (!Createlivre) 
      return;

      try
      { 
        const v_CreatelivreValidated = createLivreSchema.safeParse(Createlivre);
  
        if (!v_CreatelivreValidated.success) 
        {
          setMessage( { status : "ko", message: `Livre data invalide : ${v_CreatelivreValidated.error}` } );
        }
        else
        {
          if ( confirm(`Etes-vous sure de vouloir créer le livre  "${v_CreatelivreValidated.data.titre}" !`) == true) 
            {
              const v_retour: Livre = await creerLivre(v_CreatelivreValidated.data);
              setMessage( { status : "ok", message: `Livre créer : Livre id = ${v_retour.id}` } );
              setLivre(v_retour);

              // Go to update ? replaced by button "Mise à jour"
              // navigate( `/livres/update/${v_retour?.id}`)
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
//if  ( !Createlivre)
//    return 

  return (
    <div>
      <label id="edit_title" >
      <p>
      { livre ? 
          <p>livre créé {livre.isbn} - id : {livre.id} </p>
      :
          <p>Creation  de livre </p>
      }
      </p>
      </label>
      
      <p>

      <label id={ livre ? "show_label" : "edit_label" } >ISBN: </label>
      <input id={ livre ? "show" :  "edit" }
        value={Createlivre.isbn ?? "" }
        onChange={(e) =>
          setCreateLivre({ ...Createlivre, isbn: e.target.value })
        }
      />
      </p>

      <p>
      <label id={ livre ? "show_label" : "edit_label" }>Titre: </label>
      <input id={ livre ? "show" :  "edit" }
        value={Createlivre.titre ?? ""}
        onChange={(e) =>
          setCreateLivre({ ...Createlivre, titre: e.target.value })
        }
      />
      </p>

      <p>
      <label id={ livre ? "show_label" : "edit_label" }>Auteur: </label>
      <input id={ livre ? "show" :  "edit" }
        value={Createlivre.auteur ?? ""}
        onChange={(e) =>
          setCreateLivre({ ...Createlivre, auteur: e.target.value })
        }
      />
      </p>

      <p>
      <label id={ livre ? "show_label" : "edit_label" }>Année: </label>
      <input id={ livre ? "show" :  "edit" }
        type="number" 
        min="1900" 
        max="2099" 
        step="1" 
        value={Createlivre?.annee ?? (new Date()).getFullYear() }
        onChange={(e) =>
          setCreateLivre({ ...Createlivre, annee: Number(e.target.value) })
        }
      />
      </p>

      <p>
      <label id={ livre ? "show_label" : "edit_label" }>Genre: </label>
      <select id={ livre ? "show" :  "edit" }
        value={Createlivre?.genre ?? "" }
        onChange={(e) =>
          setCreateLivre( { ...Createlivre, genre: e.target.value })}
      >
        <option value="">-- Choisir --</option>
        <option value="Fantasy">Fantasy</option>
        <option value="Autres">Autres</option>
      </select>
      </p>

      <button id={ livre ? "show" :  "edit" } onClick={handleCreate}>
        Créer
      </button>

      <button
        id="edit"
        type="button"
        onClick={() => { livre ? navigate(`/livres/update/${livre?.id}`) : navigate(-1) }}
      >
        { livre ?  "Mettre à jours" : "Retour" }
      </button>

      <div id="floating_message" style={{backgroundColor: feedbackMessage.status == "ok" ? "#21a315e3": "#e4243e" }}>
        {feedbackMessage.message}
      </div>
  </div>
  )
}

