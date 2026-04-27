// minilib-frontend-luc-decap/src/pages/livres/update/LivresPageUpdate
import { useState, useEffect } from "react";

import { useParams, useNavigate } from "react-router-dom";
import type { NavigateFunction }  from "react-router-dom";

import { useForm } from "react-hook-form";

import { zodResolver } from '@hookform/resolvers/zod';

import type { ParamIdDto } from "@hendec/types/param";
import { paramIdSchema } from "@hendec/types/param";

import type { LivreResponseDto, UpdateLivreDto } from "@hendec/types/minilib";
import { updateLivreSchema } from "@hendec/types/minilib"; // for zod validation

import { getLivreById, updateLivre } from "../../../services/livreService";

// tmp to move in @hendec
import { validate } from "../../../middleware/index"

// tmp type to put in @hendec - review format and validation/enum
import type { infoMessage } from "../../../types/index";

// Tmp auth for test button Delete, Edit or Emprunt
import { useAuth } from "../../../auth/auth"


/**
 * Search for livres
 *
 */
export function LivresPageUpdate()
{

  const navigate: NavigateFunction = useNavigate();

  // Retrieve context rigths
  const { isallowToEdit } = useAuth();

  // Param
  const updateLivreParams = useParams();

  const [livre, setLivre]     = useState<LivreResponseDto | null>(null);
  // Deprecated - use form. data will stored in registerUpdateData from form struct
  // const [updatedLivre, setUpdateLivre]     = useState<UpdateLivreDto>();
  
  const [chargement, setChargement] = useState<boolean>(true);
  const [erreur, setErreur] = useState<string | null>(null);
  const [feedbackMessage, setMessage] = useState<infoMessage | null> ( null);

  const updateLivreParamsValidated: ParamIdDto = validate(paramIdSchema, updateLivreParams) as ParamIdDto;

  // https://react-hook-form.com/ts
  // https://react-hook-form.com/docs/useform
  const 
  {
    register: registerUpdateFormFields, // where the data will be stored (check form) - register: UseFormRegister<TFieldValues>
    handleSubmit: handleSubmitUpdate, // action when form is submitted -  handleSubmit: UseFormHandleSubmit<TFieldValues>
    reset: resetLivreUpdateDto, //  reset the state of the Dto - important for refresh use effect - reset: UseFormReset<TFieldValues>
    getValues: getUpdateLivreValues,
    formState: { errors: errorsLivreUpdateData } // State of form.errors state of the form data -  formState: FormState<TFieldValues>
  } = useForm<UpdateLivreDto>
  (
    {
      resolver: zodResolver( updateLivreSchema), // Use to validate the data writen in the form
      mode: "onChange", // will validate in real-time
    }
  );

  // Check access rigth
  useEffect(() => {
      if ( !isallowToEdit)
       navigate( '/');
  }, [isallowToEdit, navigate]); // Recheck access rigth when isallowToEdit or navigate change  

  // loaded when the componment is mount
  useEffect(() => 
    {
      const chargerLivreToUpdate = async () => 
      {
        try 
        {
          setChargement(true);
          setErreur(null);

          const data: LivreResponseDto = await getLivreById( updateLivreParams);

          setLivre( data);
          resetLivreUpdateDto( mapLivreResponseToUpdateDto( data));
        }
        catch (err: any) 
        {
          setErreur( err instanceof Error ? err.message : "Erreur inconnue");
        } 
        finally 
        {
          setChargement(false);
        }
      };

      chargerLivreToUpdate();
    }, 
    [updateLivreParams, resetLivreUpdateDto]
  );

  /**
   * Action on submit form
   */
  const onSubmitUpdateForm = async ( livreUpdateFormData: UpdateLivreDto) => {
    try {
      // deprecated - use form : No need validation before sending to updateLivre. Done by the form resolver
      // const validatedUpdatedLivre: UpdateLivreDto = validate(updateLivreSchema, updatedLivre);

      if ( !confirm(`Confirmer la mise à jour de "${livreUpdateFormData.titre}" ?`) ) 
        return;

      const updatedLivreResponse: LivreResponseDto = await updateLivre( updateLivreParams, livreUpdateFormData);

      // Initilize the book with data updated
      setLivre( updatedLivreResponse);

      // Initilize the update form data with Book data - mapped to remove id not in update Dto
      resetLivreUpdateDto( mapLivreResponseToUpdateDto( updatedLivreResponse));

      setMessage( { status: "success", message: "Mise à jour réussie"});
    }
    catch (e: any) {
      setMessage( { status: "error", message : `Echec mise à jour ${ e.message ? `: ${e.message}`: `` }` }   );
    }
  };

  // ── Rendu conditionnel ──────────────────────────────────────
  if (chargement) 
  {
    return <p>Chargement du livre à mettre à jour {updateLivreParams.id} ...</p>;
  }

  if (erreur) 
  {
    return (
      <div id="floating_message" style={{ backgroundColor: "#B71C1C" }} >
        {erreur}
      </div>
    );
  }

  if (!livre) 
    return (
      <div id="floating_message" style={{ backgroundColor: "#B71C1C" }} >
        <p>Livre {updateLivreParams.id} introuvable</p>
      </div>
    )

  return (
  <div>
      <form onSubmit={handleSubmitUpdate(onSubmitUpdateForm)}>
        <p>
        <label id="edit_title">
          <p>Mise à jours livre - id : {livre.id}  - ISBIN {getUpdateLivreValues("isbn")} </p>
        </label>
      </p>

      <p>
        <label id="edit_label">ISBN: </label>
        <input id="edit"  {...registerUpdateFormFields("isbn")} />
        {errorsLivreUpdateData.isbn && <p id="error_form">{errorsLivreUpdateData.isbn.message}</p>}
      </p>

      <p>
        <label id="edit_label">Titre: </label>
        <input id="edit" {...registerUpdateFormFields("titre")} />
        {errorsLivreUpdateData.titre && <p id="error_form">{errorsLivreUpdateData.titre.message}</p>}
      </p>

      <p>
        <label id="edit_label">Auteur: </label>
        <input id="edit" {...registerUpdateFormFields("auteur")} />
        {errorsLivreUpdateData.auteur && <p id="error_form">{errorsLivreUpdateData.auteur.message}</p>}
      </p>

      <p>
        <label id="edit_label">Année: </label>
        <input id="edit"
          type="number" 
          max={new Date().getFullYear().toString()}
          step="1" 
          {...registerUpdateFormFields("annee", { valueAsNumber: true } )} 
        />
        {errorsLivreUpdateData.annee && <p id="error_form">{errorsLivreUpdateData.annee.message}</p>}
      </p>

      <p>
        <label id="edit_label">Disponibilité: </label>
        <input
          type="checkbox"
          id="edit"
          {...registerUpdateFormFields("disponible")} 
        />
        {errorsLivreUpdateData.disponible && <p id="error_form">{errorsLivreUpdateData.disponible.message}</p>}
      </p>

      <p>
        <label id="edit_label">Genre: </label>
        <select id="edit"
          {...registerUpdateFormFields("genre") }
        >
          <option value="">----</option>
          <option value="Fantasy">Fantasy</option>
          <option value="Autres">Autres</option>
          <option value="false">Indisponible</option>
        </select>
      </p>

      <button id="edit" type="submit">Update</button>
      <button id="edit" type="button" onClick={() => navigate(-1)}>Retour</button>

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
 * 
 * Map the Reponse from the Back-end (Live) To Update DTO ( Livre without not needed Id)
 */
function mapLivreResponseToUpdateDto(
  livreResponse: LivreResponseDto
) : UpdateLivreDto 
{
  const { id,...updatedLivreFromLivreRespond } = livreResponse;

  return updatedLivreFromLivreRespond;
}
