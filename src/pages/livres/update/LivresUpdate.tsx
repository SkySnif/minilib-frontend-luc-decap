// frontend/src/pages/LivresRecherche
import { useState } from "react";
import { useParams } from "react-router-dom";

import { useNavigate } from "react-router-dom";
import type { NavigateFunction }  from "react-router-dom";

import type { FiltresLivre } from "@hendec/types/minilib";

/**
 * Search for livres
 *
 */
export function LivreUpdate()
{

  const { id } = useParams();

  const [livres,     setLivres]     = useState<Livre>();
  const [chargement, setChargement] = useState<boolean>(true);
  const [erreur,     setErreur]     = useState<string | null>(null);


  // const [v_FiltreLivre, setLivres] = useState<FiltresLivre>({});
  // const [v_DisponibleString, setDisponible] = useState<string>("all");

  const v_navigate: NavigateFunction = useNavigate();

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) 
  {
    e.preventDefault();

  //     const disponible =
  //       v_DisponibleString === "all"
  //         ? undefined
  //         : v_DisponibleString === "available";

  //     const v_FiltreFinal: FiltresLivre = {
  //       ...v_FiltreLivre,
  //       disponible
  //     };

  //     const params = new URLSearchParams();

  //     Object.entries(v_FiltreFinal).forEach(([k, v]) => {
  //       if (v !== undefined && v !== "") {
  //         params.append(k, String(v));
  //       }
  //     });

  //     v_navigate(`/rechercher/afficher?${params.toString()}`);
  }



  return (
    <form onSubmit={handleSubmit}>
      <label id="recherche_title">
        <p>Mise à jours livre {id}</p>
      </label>



      <button id="recherche" type="submit">Rechercher</button>
    </form>
  )}
