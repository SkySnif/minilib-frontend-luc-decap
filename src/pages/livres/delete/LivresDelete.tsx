// frontend/src/pages/LivresRecherche
import { useState } from "react";

import { useNavigate } from "react-router-dom";
import type { NavigateFunction }  from "react-router-dom";

import type { FiltresLivre } from "@hendec/types/minilib";

/**
 * Search for livres
 *
 */
export function LivresDelete()
{
  const [v_FiltreLivre, setLivres] = useState<FiltresLivre>({});
  const [v_DisponibleString, setDisponible] = useState<string>("all");

  const v_navigate: NavigateFunction = useNavigate();

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

      const disponible =
        v_DisponibleString === "all"
          ? undefined
          : v_DisponibleString === "available";

      const v_FiltreFinal: FiltresLivre = {
        ...v_FiltreLivre,
        disponible
      };

      const params = new URLSearchParams();

      Object.entries(v_FiltreFinal).forEach(([k, v]) => {
        if (v !== undefined && v !== "") {
          params.append(k, String(v));
        }
      });

      v_navigate(`/rechercher/afficher?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label id="recherche_title">
        <p>effacer un livre :</p>
      </label>

      <label id="recherche">Titre :</label>
        <input id="recherche"
          value={v_FiltreLivre.recherche ?? ""}
          onChange={(e) =>
              setLivres((prev) => ({ ...prev, recherche: e.target.value }))
            }
      />

      <label id="recherche">Genre :</label>
      <input id="recherche"
        value={v_FiltreLivre.genre ?? ""}
        onChange={(e) =>
          setLivres((prev) => ({ ...prev, genre: e.target.value }))
        }
      />

      <label id="recherche">
        Disponible : 
      </label>
      <select id="recherche"
        value={v_DisponibleString ?? "all"}
        onChange={(e) => setDisponible( e.target.value)}
      >
        <option value="all">Tous</option>
        <option value="available">Disponible</option>
        <option value="unavailable">Indisponible</option>
      </select>

      { " "}

      <button id="recherche" type="submit">Rechercher</button>
    </form>
  )}
