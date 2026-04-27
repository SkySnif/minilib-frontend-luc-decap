// frontend/src/pages/LivresRecherche
import { useState, useEffect} from "react";

import { useNavigate } from "react-router-dom";
import type { NavigateFunction }  from "react-router-dom";

import { useForm } from "react-hook-form";

import { zodResolver } from '@hookform/resolvers/zod';

import { createLivreSchema } from "@hendec/types/minilib";
import type { CreateLivreDto, LivreResponseDto } from "@hendec/types/minilib";

import { creerLivre } from "../../../services/livreService";
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

  // Retrieve context rigths
  const { isallowToCreate } = useAuth();

  // use partial instead of init empty, more secure because data are validated by Zod
  // Deprecated - use form. data will stored in registerCreateData from form struct
  // const [createlivre, setCreateLivre] = useState<CreateLivreDto | null>(null);
  const [livre, setLivre] = useState<LivreResponseDto | null>(null);

  const [feedbackMessage, setMessage] = useState<infoMessage | null> ( null);

  // https://react-hook-form.com/ts
  // https://react-hook-form.com/docs/useform
  const 
  {
    register: registerCreateFormFields, // where the data will be stored (check form) - register: UseFormRegister<TFieldValues>
    handleSubmit: handleSubmitCreate, // action when form is submitted -  handleSubmit: UseFormHandleSubmit<TFieldValues>
    reset: resetLivreCreateDto, //  reset the state of the Dto - important for refresh use effect - reset: UseFormReset<TFieldValues>
//    getValues: getCreateLivreValues,
    formState: { errors: errorsLivreCreateData } // State of form.errors state of the form data -  formState: FormState<TFieldValues>
  } = useForm<CreateLivreDto>
  (
    {
      resolver: zodResolver(createLivreSchema), // Use to validate the data writen in the form
      mode: "onChange", // will validate in real-time
    }
  );
  
  // Check access rigth
  useEffect(() => {
      if ( !isallowToCreate)
       navigate( '/');
  }, [isallowToCreate, navigate]); // Recheck access rigth when isallowToEdit or navigate change  

  const onSubmitCreateForm = async (livreCreateFormData: CreateLivreDto) => 
  {
    if (!livreCreateFormData) 
      return;

      try
      { 
        // DEPRECATED : done with useForm revolver
        //const v_CreatelivreValidated = createLivreSchema.safeParse(Createlivre);
  
        if ( confirm(`Etes-vous sure de vouloir créer le livre  "${livreCreateFormData.titre}" !`) == true) 
        {
          const CreatedLivreResponse: LivreResponseDto = await creerLivre(livreCreateFormData);

          setMessage( { status : "success", message: `Livre créer : Livre id = ${CreatedLivreResponse.id}` } );

          setLivre(CreatedLivreResponse);

          // Initilize the create form data with Book data - mapped to remove id not in create Dto
          resetLivreCreateDto( mapLivreResponseToCreateDto( CreatedLivreResponse));

          // Go to create ? replaced by button "Mise à jour"
          // navigate( `/livres/create/${v_retour?.id}`)
        }
      }
      catch (err: any) 
      {
        setMessage( { status : "error", message: `Creation failed : ${err.message}` } );
      }
  };

  // Empty at the beggining - not correct
  // Instead initialition aith empty value, use Partial and zod validate before sending http request<
  //if  ( !Createlivre)
  //    return 

  return (

    <div>
        <form onSubmit={handleSubmitCreate(onSubmitCreateForm)}>
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
          {...registerCreateFormFields("isbn")} />
          {errorsLivreCreateData.isbn && <p id="error_form">{errorsLivreCreateData.isbn.message}</p>}
        </p>

        <p>
          <label id={ livre ? "show_label" : "edit_label" }>Titre: </label>
          <input id={ livre ? "show" :  "edit" }
          {...registerCreateFormFields("titre")} />
          {errorsLivreCreateData.titre && <p id="error_form">{errorsLivreCreateData.titre.message}</p>}
        </p>

        <p>
          <label id={ livre ? "show_label" : "edit_label" }>Auteur: </label>
          <input id={ livre ? "show" :  "edit" }
          {...registerCreateFormFields("auteur")} />
          {errorsLivreCreateData.auteur && <p id="error_form">{errorsLivreCreateData.auteur.message}</p>}
        </p>

        <p>
          <label id={ livre ? "show_label" : "edit_label" }>Année: </label>
          <input id={ livre ? "show" :  "edit" }
            type="number" 
            min="1" 
            max={new Date().getFullYear().toString()}
            step="1" 
            {...registerCreateFormFields(
              "annee", 
                { 
                    setValueAs: (v) => 
                    {
                      if (v === "" || v === null || Number.isNaN(v)) return null;
                        return Number(v);
                    }
                }, 
            )
              } 
          />
          {errorsLivreCreateData.annee && <p id="error_form">{errorsLivreCreateData.annee.message}</p>}
        </p>

        <p>
        <label id={ livre ? "show_label" : "edit_label" }>Genre: </label>
          <select id={ livre ? "show" :  "edit" }
            {...registerCreateFormFields("genre") }
          >
            <option value="">----</option>
            <option value="Fantasy">Fantasy</option>
            <option value="Autres">Autres</option>
            <option value="false">Indisponible</option>
          </select>
        </p>

        <button id={ livre ? "show" :  "edit" } type="submit">Créer</button>

        <button 
          id="edit" 
          type="button" 
          onClick={() => { livre ? navigate(`/livres/update/${livre.id}`) : navigate(-1) }}
        >
          { livre ?  "Mettre à jour" : "Retour" }
        </button>

        { 
        livre &&
          <button 
            id="edit" 
            type="button" 
            onClick= { () => 
              {
                  if (livre) 
                  {
                      setLivre(null);
                      resetLivreCreateDto(); // TODO => reset form value. Helper or Dto Form
                      setMessage( null)
                      navigate(`/livres/create`);
                  }
                  else
                  {
                    navigate(-1) 
                  }
              }
            }
          >
            { livre ?  "Nouveau" : "Retour" }
          </button>
        }

        {feedbackMessage &&
          <div id="floating_message" style={{ color:"white", backgroundColor: feedbackMessage.status == "success" ? "#21a315e3": "#B71C1C" }}>
            {feedbackMessage.message}
          </div>
        }

    </form>
  </div>
  )
}

/**
 * Map Livre reponse to Create to refresh DOM
 */
function mapLivreResponseToCreateDto(
  livreResponse: LivreResponseDto
) : CreateLivreDto
{
  const { id, disponible, annee, ...createdLivreFromLivreRespond } = livreResponse;

  return createdLivreFromLivreRespond;
}
